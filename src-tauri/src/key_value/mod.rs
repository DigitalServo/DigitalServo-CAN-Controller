use std::io::{Write, BufWriter};
use std::ops::{Deref, DerefMut};

use serde::{Deserialize, Serialize};
use serde_json::Value;

use std::error::Error;
use std::fmt;
use std::path::Path;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct KeyValue {
    pub key: String,
    pub value: Value
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct KeyValues(pub Vec<KeyValue>);

impl Deref for KeyValues {
    type Target = Vec<KeyValue>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl DerefMut for KeyValues {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl FromIterator<KeyValue> for KeyValues {
    fn from_iter<I: IntoIterator<Item = KeyValue>>(iter: I) -> Self {
        Self(iter.into_iter().collect())
    }
}

impl IntoIterator for KeyValues {
    type Item = KeyValue;
    type IntoIter = std::vec::IntoIter<KeyValue>;

    fn into_iter(self) -> Self::IntoIter {
        self.0.into_iter()
    }
}

impl<'a> IntoIterator for &'a KeyValues {
    type Item = &'a KeyValue;
    type IntoIter = std::slice::Iter<'a, KeyValue>;

    fn into_iter(self) -> Self::IntoIter {
        self.0.iter()
    }
}

#[derive(Debug)]
pub enum KeyValuesError {
    Io(std::io::Error),
    Json(serde_json::Error),
    NotAnObject {
        actual: serde_json::Value,
        message: &'static str,
    },
}

impl fmt::Display for KeyValuesError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            KeyValuesError::Io(e) => write!(f, "Failed to load JSON file: {}", e),
            KeyValuesError::Json(e) => write!(f, "Failed to parse JSON: {}", e),
            KeyValuesError::NotAnObject { actual: _, message } => write!(f, "{}", message),
        }
    }
}

impl Error for KeyValuesError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        match self {
            KeyValuesError::Io(e) => Some(e),
            KeyValuesError::Json(e) => Some(e),
            KeyValuesError::NotAnObject { .. } => None,
        }
    }
}

impl From<std::io::Error> for KeyValuesError {
    fn from(err: std::io::Error) -> Self {
        KeyValuesError::Io(err)
    }
}

impl From<serde_json::Error> for KeyValuesError {
    fn from(err: serde_json::Error) -> Self {
        KeyValuesError::Json(err)
    }
}

impl KeyValues {
    pub fn from_json<P: AsRef<Path>>(path: P) -> Result<Self, KeyValuesError> {

        let content = std::fs::read_to_string(&path)?;
        let value = serde_json::from_str::<Value>(&content)?;

        let obj = match value {
            Value::Object(map) => map,
            other => {
                return Err(KeyValuesError::NotAnObject {
                    actual: other,
                    message: "Not a top object",
                });
            }
        };

        let ret: Vec<KeyValue> = obj
            .into_iter()
            .map(|(key, value)| KeyValue { key, value })
            .collect();

        Ok(KeyValues(ret))
    }

    pub fn save_to_json<P: AsRef<Path>>(&self, path: P) -> std::io::Result<()> {
        let mut map = serde_json::Map::new();

        for kv in &self.0 {
            map.insert(kv.key.clone(), kv.value.clone());
        }

        let json_value = Value::Object(map);

        let file = std::fs::File::create(&path)?;
        let mut writer = BufWriter::new(file);

        serde_json::to_writer_pretty(&mut writer, &json_value)?;

        writer.flush()?;

        Ok(())
    }
}
