use std::{ops::DerefMut, sync::Arc};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tauri::{AppHandle, Emitter, async_runtime::Mutex};
use tokio::task::JoinHandle;
use tokio_util::sync::CancellationToken;
use cands_cyphal::CANInterface;

use crate::{KeyValue, KeyValues};

pub struct CANInterfaceState {
    pub interface: Arc<Mutex<Option<CANInterface>>>,
    monitor_handle: Arc<Mutex<Option<JoinHandle<()>>>>,
    cancel_token: Arc<Mutex<Option<CancellationToken>>>,
}

impl From<Option<CANInterface>> for CANInterfaceState {
    fn from(value: Option<CANInterface>) -> Self {
        Self {
            interface: Arc::new(Mutex::new(value)),
            monitor_handle: Arc::new(Mutex::new(None)),
            cancel_token: Arc::new(Mutex::new(None))
        }
    }
}

type SharedCANInterface<'a> = tauri::State<'a, CANInterfaceState>;

fn to_string_err<E: ToString>(err: E) -> String {
    err.to_string()
}

async fn sleep(duration_ms: u64) {
    tokio::time::sleep(tokio::time::Duration::from_millis(duration_ms)).await;
}

const CONTROL_MODES: [&str; 3] = [
    "HybridControlBiSSCMTL",
    "P2PControlBiSSCMTL",
    "SpeedControlBiSSCMTL",
];

const MONITOR_KEYS: [&'static str; 4] = [
    "position",
    "velocity",
    "force",
    "disturbanceforce",
];

const EMIT_EVENT_KEY: &str = "monitor_response";

#[derive(Serialize, Deserialize, Clone, Copy)]
struct MonitorResponse {
    position: f64,
    velocity: f64,
    force: f64,
    disturbance: f64,
}

impl From<[f64; 4]> for MonitorResponse {
    fn from(value: [f64; 4]) -> Self {
        Self {
            position: value[0],
            velocity: value[1],
            force: value[2],
            disturbance: value[3]
        }
    }
}



#[tauri::command]
pub async fn cands_check_connection(state: SharedCANInterface<'_>) -> Result<bool, ()> {
    let locked = state.interface.lock().await;
    Ok((*locked).is_some())
}

#[tauri::command]
pub async fn cands_connect(state: SharedCANInterface<'_>) -> Result<(), String> {
    let mut locked = state.interface.lock().await;

    if (*locked).is_some() {
        return Err(String::from("Already connected"));
    }

    let interface = CANInterface::new().map_err(to_string_err)?;
    *locked = Some(interface);

    Ok(())
}

#[tauri::command]
pub async fn cands_disconnect(state: SharedCANInterface<'_>) -> Result<(), String> {
    let mut locked = state.interface.lock().await;

    if (*locked).is_none() {
        return Err(String::from("No connection found"));
    }

    *locked = None;

    Ok(())
}


#[tauri::command]
pub async fn cands_check_drive_status(state: SharedCANInterface<'_>, node_id: u8) -> Result<bool, String>{

    let mut locked = state.interface.lock().await;
    let interface = match locked.deref_mut() {
        Some(interface) => interface,
        None => {return Err("CAN Interface Not Found".to_string())}
    };

    interface.get_scalar_response::<f64>(node_id, "drive")
        .map_err(to_string_err)?
        .map(|ret| ret == 1.0)
        .ok_or("Data Not Found".to_string())
}

#[tauri::command]
pub async fn cands_drive_enable(app: AppHandle, state: SharedCANInterface<'_>, node_id: u8) -> Result<bool, String>{

    let mut locked = state.interface.lock().await;
    let interface = match locked.deref_mut() {
        Some(interface) => interface,
        None => {return Err("CAN Interface Not Found".to_string())}
    };

    interface.drive_enable(node_id).map_err(to_string_err)?;

    interface.get_scalar_response::<f64>(node_id, "drive")
        .map_err(to_string_err)?
        .map(|ret| ret == 1.0)
        .ok_or("Data Not Found".to_string())?;

    drop(locked);

    let cancel_token = CancellationToken::new();
    let mut ct = state.cancel_token.lock().await;
    *ct = Some(cancel_token.clone());
    drop(ct);

    let handle = state.monitor_handle.clone();
    let interface = state.interface.clone();

    let app_arc = Arc::new(app);
    let app = app_arc.clone();

    let monitor_handle = {
        tokio::spawn(async move {

            let mut interval = tokio::time::interval(tokio::time::Duration::from_millis(100));
            let mut value: [f64; 4] = [0.0; 4];
            let gain = 0.8;

            loop {
                tokio::select! {
                    _ = cancel_token.cancelled() => {
                        break;
                    }
                    _ = interval.tick() => {
                        let mut locked = interface.lock().await;
                        if let Some(interface) = locked.deref_mut() {
                            for (i, key) in MONITOR_KEYS.iter().enumerate() {
                                let _ = interface.send_digitalservo_get_value_request(node_id, key);
                                if let Ok(ret) = interface.get_scalar_response_from_buffer::<f64>(node_id, key) {
                                    if let Some(val) = ret {
                                        value[i] = gain * val + (1.0 - gain) * value[i];
                                    }
                                };
                            }
                            drop(locked);
                            let responses = MonitorResponse::from(value);
                            let _ = app.emit(EMIT_EVENT_KEY, responses);
                        } else {

                            let mut handle = handle.lock().await;
                            *handle = None;
                            drop(handle);

                            break;
                        }
                    }
                }
            }
        })
    };

    let mut handle = state.monitor_handle.lock().await;
    *handle = Some(monitor_handle);
    drop(handle);

    Ok(true)
}


#[tauri::command]
pub async fn cands_drive_disable(state: SharedCANInterface<'_>, node_id: u8) -> Result<bool, String>{

    let mut locked = state.interface.lock().await;
    let interface = match locked.deref_mut() {
        Some(interface) => interface,
        None => {return Err("CAN Interface Not Found".to_string())}
    };

    interface.drive_disable(node_id).map_err(to_string_err)?;

    interface.get_scalar_response::<f64>(node_id, "drive")
        .map_err(to_string_err)?
        .map(|ret| ret == 0.0)
        .ok_or("Data Not Found".to_string())?;

    drop(locked);

    if let Some(token) = state.cancel_token.lock().await.take() {
        token.cancel();
    }

    if let Some(handle) = state.monitor_handle.lock().await.take() {
        handle.await.map_err(to_string_err)?;
    }

    Ok(true)
}

#[tauri::command]
pub async fn cands_set_node_id(state: SharedCANInterface<'_>, node_id: u8, new_node_id: u8) -> Result<(), String>{

    let mut locked = state.interface.lock().await;
    let interface = match locked.deref_mut() {
        Some(interface) => interface,
        None => {return Err("CAN Interface Not Found".to_string())}
    };

    interface.send_digitalservo_set_value(node_id, "NODEID", &[new_node_id as f64])
        .map_err(to_string_err)
}

#[tauri::command]
pub async fn cands_check_control_mode(state: SharedCANInterface<'_>, node_id: u8) -> Result<String, String>{

    let mut locked = state.interface.lock().await;
    let interface = match locked.deref_mut() {
        Some(interface) => interface,
        None => {return Err("CAN Interface Not Found".to_string())}
    };

    interface.get_scalar_response::<String>(node_id, "DriveMode")
        .map_err(to_string_err)?
        .ok_or("Data Not Found".into())
}

#[tauri::command]
pub async fn cands_set_control_mode(state: SharedCANInterface<'_>, node_id: u8, mode: String) -> Result<(), String>{

    let mut locked = state.interface.lock().await;
    let interface = match locked.deref_mut() {
        Some(interface) => interface,
        None => {return Err("CAN Interface Not Found".to_string())}
    };

    if !CONTROL_MODES.contains(&mode.as_str()) {
        return Err("Specified Mode Not Available".into());
    }

    let drive_status = interface.get_scalar_response::<f64>(node_id, "drive")
        .map_err(to_string_err)?
        .map(|ret| ret == 1.0)
        .ok_or("Data Not Found")?;

    // Enable servo if enabled before mode changing
    if drive_status == true {
        interface.drive_disable(node_id).map_err(to_string_err)?;
        if interface.get_scalar_response::<f64>(node_id, "drive")
            .map_err(to_string_err)?
            .map(|ret| ret == 0.0)
            .ok_or("Data Not Found")? == false
        {
            return Err("Drive Disable Failed".into())
        }
    }

    interface.send_digitalservo_set_value(node_id, "DriveMode", &[mode.clone()]).map_err(to_string_err)?;
    if interface.get_scalar_response::<String>(node_id, "DriveMode")
        .map_err(to_string_err)?
        .ok_or("Cannot Get Drive Mode")? != mode
    {
        return Err("Drive Mode Setting Failed".into())
    };

    // Enable servo if enabled before mode changing
    if drive_status == true {
        interface.drive_enable(node_id).map_err(to_string_err)?;
        if interface.get_scalar_response::<f64>(node_id, "drive")
            .map_err(to_string_err)?
            .map(|ret| ret == 1.0)
            .ok_or("Data Not Found")? == false
        {
            return Err("Drive Enable Failed".into())
        }
    }

    Ok(())
}


#[tauri::command]
pub async fn cands_get_parameters(state: SharedCANInterface<'_>, node_id: u8, keys: Vec<String>) -> Result<KeyValues, String>{

    let mut locked = state.interface.lock().await;
    let interface = match locked.deref_mut() {
        Some(interface) => interface,
        None => {return Err("CAN Interface Not Found".to_string())}
    };

    let mut parameters: KeyValues = KeyValues(Vec::with_capacity(keys.len()));

    for key in keys {
        let value = interface.get_scalar_response::<f64>(node_id, &key)
            .map_err(to_string_err)?
            .ok_or(format!("Failed to Get {}", key))?;
        parameters.push(KeyValue {
            key,
            value: Value::from(value)
        });
    }

    Ok(parameters)
}

#[tauri::command]
pub async fn cands_set_parameters(state: SharedCANInterface<'_>, node_id: u8, parameters: KeyValues) -> Result<(), String>{

    let mut locked = state.interface.lock().await;
    let interface = match locked.deref_mut() {
        Some(interface) => interface,
        None => {return Err("CAN Interface Not Found".to_string())}
    };

    for parameter in parameters {
        if let Some(params) = parameter.value.as_f64() {
            interface.send_digitalservo_set_value(node_id, &parameter.key, &[params]).map_err(to_string_err)?;
            if interface.get_scalar_response::<f64>(node_id, &parameter.key)
                .map_err(to_string_err)?
                .ok_or(format!("Failed to Get {}", &parameter.key))? != parameter.value
            {
                return Err(format!("Failed to Set {}", &parameter.key));
            };
        }

        if let Some(params) = parameter.value.as_str() {
            interface.send_digitalservo_set_value(node_id, &parameter.key, &[params.to_string()]).map_err(to_string_err)?;
            if interface.get_scalar_response::<String>(node_id, &parameter.key)
                .map_err(to_string_err)?
                .ok_or(format!("Failed to Get {}", &parameter.key))? != parameter.value
            {
                return Err(format!("Failed to Set {}", &parameter.key));
            };
        }
    }

    Ok(())
}

#[tauri::command]
pub async fn cands_reset_position_encoder(state: SharedCANInterface<'_>, node_id: u8) -> Result<(), String>{

    let mut locked = state.interface.lock().await;
    let interface = match locked.deref_mut() {
        Some(interface) => interface,
        None => {return Err("CAN Interface Not Found".to_string())}
    };

    interface.send_digitalservo_set_value(node_id, "resetposition", &[true]).map_err(to_string_err)
}

#[tauri::command]
pub async fn cands_save_parameters(state: SharedCANInterface<'_>, node_id: u8) -> Result<(), String>{

    let mut locked = state.interface.lock().await;
    let interface = match locked.deref_mut() {
        Some(interface) => interface,
        None => {return Err("CAN Interface Not Found".to_string())}
    };

    interface.send_digitalservo_set_value(node_id, "savetoflash", &[true]).map_err(to_string_err)?;
    drop(locked);

    sleep(500).await;

    Ok(())
}


#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HybridControlParameter {
  pub torque_feedforward: f64,
  pub position_reference: f64,
  pub velocity_reference: f64,
  pub torque_reference: f64,
  pub position_gain: f64,
  pub velocity_gain: f64,
  pub torque_gain: f64,
  pub torque_limit: f64,
}

#[tauri::command]
pub async fn cands_send_hybrid_control_parameter(state: SharedCANInterface<'_>, node_id: u8, parameters: HybridControlParameter) -> Result<(), String>{

    let mut locked = state.interface.lock().await;
    let interface = match locked.deref_mut() {
        Some(interface) => interface,
        None => {return Err("CAN Interface Not Found".to_string())}
    };

    interface.send_digitalservo_set_value(node_id, "cmdarray", &[
        parameters.torque_feedforward,
        parameters.torque_reference,
        parameters.velocity_reference,
        parameters.position_reference,
        parameters.torque_gain,
        parameters.velocity_gain,
        parameters.position_gain,
        parameters.torque_limit
    ]).map_err(to_string_err)
}


#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct P2PControlCommand {
  pub distance_rad: f64,
  pub duration_s: f64,
}

#[tauri::command]
pub async fn cands_set_p2p_increment_mode(state: SharedCANInterface<'_>, node_id: u8, mode: bool) -> Result<(), String>{

    let mut locked = state.interface.lock().await;
    let interface = match locked.deref_mut() {
        Some(interface) => interface,
        None => {return Err("CAN Interface Not Found".to_string())}
    };

    let drive_status = interface.get_scalar_response::<f64>(node_id, "drive")
        .map_err(to_string_err)?
        .map(|ret| ret == 1.0)
        .ok_or("Data Not Found")?;

    // Enable servo if enabled before mode changing
    if drive_status == true {
        interface.drive_disable(node_id).map_err(to_string_err)?;
        if interface.get_scalar_response::<f64>(node_id, "drive")
            .map_err(to_string_err)?
            .map(|ret| ret == 0.0)
            .ok_or("Data Not Found")? == false
        {
            return Err("Drive Disable Failed".into())
        }
    }

    let mode: f64 = if mode == true { 1.0 } else { 0.0 };
    interface.send_digitalservo_set_value(node_id, "P2PIncrementMode", &[mode])
        .map_err(to_string_err)?;

    if interface.get_scalar_response::<f64>(node_id, "P2PIncrementMode")
        .map_err(to_string_err)?
        .map(|ret| ret == mode)
        .ok_or("Data Not Found")? == false
    {
        return Err("Failed to Set P2P Mode".into())
    }

    // Enable servo if enabled before mode changing
    if drive_status == true {
        interface.drive_enable(node_id).map_err(to_string_err)?;
        if interface.get_scalar_response::<f64>(node_id, "drive")
            .map_err(to_string_err)?
            .map(|ret| ret == 1.0)
            .ok_or("Data Not Found")? == false
        {
            return Err("Drive Enable Failed".into())
        }
    }


    Ok(())
}



#[tauri::command]
pub async fn cands_send_p2p_control_command(state: SharedCANInterface<'_>, node_id: u8, command: P2PControlCommand) -> Result<(), String>{

    let mut locked = state.interface.lock().await;
    let interface = match locked.deref_mut() {
        Some(interface) => interface,
        None => {return Err("CAN Interface Not Found".to_string())}
    };

    interface.send_digitalservo_set_value(node_id, "cmdarray", &[command.distance_rad, command.duration_s])
        .map_err(to_string_err)?;
    interface.send_digitalservo_set_value(node_id, "setting", &[true])
        .map_err(to_string_err)?;
    interface.send_digitalservo_set_value(node_id, "execute", &[true])
        .map_err(to_string_err)?;

    drop(locked);

    let duration_ms: u64 = (command.duration_s * 1000.0) as u64 + 100;
    sleep(duration_ms).await;

    for _ in 0..5 {
        let mut locked = state.interface.lock().await;
        let interface = match locked.deref_mut() {
            Some(interface) => interface,
            None => {return Err("CAN Interface Not Found".to_string())}
        };

        if let Ok(Some(value)) = interface.get_scalar_response::<f64>(node_id, "p2pstatus") {
            if value == 0.0 {
                return Ok(());
            }
        };

        drop(locked);
        sleep(10).await;
    }

    Err("Cannot Get P2P Status".to_string())
}
