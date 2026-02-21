use crate::{KeyValues};

#[tauri::command]
pub fn recipe_load_from_json(path: String) -> Result<KeyValues, String> {
    KeyValues::from_json(path).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn recipe_save_to_json(path: String, parameters: KeyValues) -> Result<(), String> {
    parameters.save_to_json(path).map_err(|e| e.to_string())
}
