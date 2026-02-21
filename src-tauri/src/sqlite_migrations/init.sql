CREATE TABLE IF NOT EXISTS recipe (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  UNIQUE(name)
);

CREATE TRIGGER trigger_recipe_updated_at AFTER UPDATE ON recipe
BEGIN
  UPDATE recipe SET updated_at = DATETIME('now', 'localtime') WHERE rowid == NEW.rowid;
END;

CREATE TABLE IF NOT EXISTS recipe_parameter (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER,
  key TEXT NOT NULL,
  value NUMERIC,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  FOREIGN KEY(recipe_id) REFERENCES recipe(id) ON DELETE CASCADE
);

CREATE TRIGGER trigger_recipe_parameter_updated_at AFTER UPDATE ON recipe_parameter
BEGIN
  UPDATE recipe_parameter SET updated_at = DATETIME('now', 'localtime') WHERE rowid == NEW.rowid;
END;
