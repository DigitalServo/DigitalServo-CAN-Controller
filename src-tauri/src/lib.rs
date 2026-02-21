use tauri::Manager;
use tauri_plugin_sql::{Migration, MigrationKind};

use crate::tauri_api::cands::CANInterfaceState;

mod key_value;
pub use key_value::{KeyValue, KeyValues};

mod tauri_api;

const SQLITE_MIGEATIONS: [Migration; 1] = [Migration {
    version: 1,
    description: "create recipe table",
    sql: include_str!("./sqlite_migrations/init.sql"),
    kind: MigrationKind::Up,
}];

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {

    let sql_plugin = tauri_plugin_sql::Builder::default()
        .add_migrations("sqlite:recipe.db", Vec::from(SQLITE_MIGEATIONS))
        .build();

    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(sql_plugin)
        .invoke_handler(tauri::generate_handler![
            tauri_api::cands::cands_check_connection,
            tauri_api::cands::cands_connect,
            tauri_api::cands::cands_disconnect,
            tauri_api::cands::cands_check_drive_status,
            tauri_api::cands::cands_drive_enable,
            tauri_api::cands::cands_drive_disable,
            tauri_api::cands::cands_set_node_id,
            tauri_api::cands::cands_check_control_mode,
            tauri_api::cands::cands_set_control_mode,
            tauri_api::cands::cands_get_parameters,
            tauri_api::cands::cands_set_parameters,
            tauri_api::cands::cands_reset_position_encoder,
            tauri_api::cands::cands_save_parameters,
            tauri_api::cands::cands_send_hybrid_control_parameter,
            tauri_api::cands::cands_set_p2p_increment_mode,
            tauri_api::cands::cands_send_p2p_control_command,
            tauri_api::recipe::recipe_load_from_json,
            tauri_api::recipe::recipe_save_to_json,
        ])
        .setup(|app| {

            if cfg!(debug_assertions) {
                app.handle().plugin(
                tauri_plugin_log::Builder::default()
                    .level(log::LevelFilter::Info)
                    .build(),
                )?;

                let app_data_dir = app.path().app_data_dir()?;
                println!("🔍 Debug: App Data Directory: {}", app_data_dir.display());
            }

            let can_interface = cands_cyphal::CANInterface::new().ok();
            let can_interface_state = CANInterfaceState::from(can_interface);
            app.manage(can_interface_state);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
