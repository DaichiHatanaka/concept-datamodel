use tauri::State;

use crate::db::models::Project;
use crate::error::AppError;
use crate::AppState;

#[tauri::command]
pub fn list_projects(state: State<AppState>) -> Result<Vec<Project>, AppError> {
    let db = state.db.lock().unwrap();
    let mut stmt = db
        .conn
        .prepare("SELECT id, name, description, created_at, updated_at FROM projects ORDER BY updated_at DESC")?;

    let projects = stmt
        .query_map([], |row| {
            Ok(Project {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                created_at: row.get(3)?,
                updated_at: row.get(4)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;

    Ok(projects)
}

#[tauri::command]
pub fn get_project(state: State<AppState>, id: String) -> Result<Project, AppError> {
    let db = state.db.lock().unwrap();
    let project = db.conn.query_row(
        "SELECT id, name, description, created_at, updated_at FROM projects WHERE id = ?1",
        [&id],
        |row| {
            Ok(Project {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                created_at: row.get(3)?,
                updated_at: row.get(4)?,
            })
        },
    )?;

    Ok(project)
}

#[tauri::command]
pub fn create_project(
    state: State<AppState>,
    name: String,
    description: Option<String>,
) -> Result<Project, AppError> {
    let db = state.db.lock().unwrap();
    let id = uuid::Uuid::new_v4().to_string();

    db.conn.execute(
        "INSERT INTO projects (id, name, description) VALUES (?1, ?2, ?3)",
        rusqlite::params![&id, &name, &description],
    )?;

    let project = db.conn.query_row(
        "SELECT id, name, description, created_at, updated_at FROM projects WHERE id = ?1",
        [&id],
        |row| {
            Ok(Project {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                created_at: row.get(3)?,
                updated_at: row.get(4)?,
            })
        },
    )?;

    Ok(project)
}

#[tauri::command]
pub fn update_project(
    state: State<AppState>,
    id: String,
    name: String,
    description: Option<String>,
) -> Result<Project, AppError> {
    let db = state.db.lock().unwrap();

    let updated = db.conn.execute(
        "UPDATE projects SET name = ?1, description = ?2, updated_at = datetime('now') WHERE id = ?3",
        rusqlite::params![&name, &description, &id],
    )?;

    if updated == 0 {
        return Err(AppError::NotFound(format!("Project {id} not found")));
    }

    let project = db.conn.query_row(
        "SELECT id, name, description, created_at, updated_at FROM projects WHERE id = ?1",
        [&id],
        |row| {
            Ok(Project {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                created_at: row.get(3)?,
                updated_at: row.get(4)?,
            })
        },
    )?;

    Ok(project)
}

#[tauri::command]
pub fn delete_project(state: State<AppState>, id: String) -> Result<(), AppError> {
    let db = state.db.lock().unwrap();

    let deleted = db
        .conn
        .execute("DELETE FROM projects WHERE id = ?1", [&id])?;

    if deleted == 0 {
        return Err(AppError::NotFound(format!("Project {id} not found")));
    }

    Ok(())
}
