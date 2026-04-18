import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'smartu.db';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;

  db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY NOT NULL,
      text TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0
    );
  `);

  return db;
};

export const getTodos = async (): Promise<Todo[]> => {
  const database = await initDatabase();
  const allRows = await database.getAllAsync<{ id: string; text: string; completed: number }>(
    'SELECT * FROM todos ORDER BY id DESC'
  );
  
  return allRows.map(row => ({
    ...row,
    completed: row.completed === 1
  }));
};

export const addTodo = async (text: string): Promise<Todo> => {
  const database = await initDatabase();
  const id = Date.now().toString();
  await database.runAsync(
    'INSERT INTO todos (id, text, completed) VALUES (?, ?, ?)',
    [id, text, 0]
  );
  return { id, text, completed: false };
};

export const toggleTodo = async (id: string, completed: boolean): Promise<void> => {
  const database = await initDatabase();
  await database.runAsync(
    'UPDATE todos SET completed = ? WHERE id = ?',
    [completed ? 1 : 0, id]
  );
};

export const updateTodo = async (id: string, text: string): Promise<void> => {
  const database = await initDatabase();
  await database.runAsync(
    'UPDATE todos SET text = ? WHERE id = ?',
    [text, id]
  );
};

export const deleteTodo = async (id: string): Promise<void> => {
  const database = await initDatabase();
  await database.runAsync('DELETE FROM todos WHERE id = ?', [id]);
};
