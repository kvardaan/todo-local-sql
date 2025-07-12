import { enablePromise, openDatabase, SQLiteDatabase } from "react-native-sqlite-storage";

import { TodoItem } from "@/models";

const tableName = "todos";

// enable promise based APIs
enablePromise(true);

export const getDBConnection = async () => {
	return openDatabase({ name: "todo-data.db", location: "default" });
};

// create table if not exists
export const createTable = async (db: SQLiteDatabase) => {
	try {
		const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      value TEXT NOT NULL
      )`;

		await db.executeSql(query);
	} catch (error) {
		console.error(error);
		throw new Error("Failed to create table");
	}
};

export const getTodoItems = async (db: SQLiteDatabase): Promise<TodoItem[]> => {
	try {
		const todoItems: TodoItem[] = [];

		const results = await db.executeSql(`SELECT id, value FROM ${tableName}`);

		results.forEach((result) => {
			for (let index = 0; index < result.rows.length; index++) {
				todoItems.push(result.rows.item(index));
			}
		});

		return todoItems;
	} catch (error) {
		console.error(error);
		throw new Error("Failed to get todo items");
	}
};

export const saveTodoItem = async (db: SQLiteDatabase, todoItem: TodoItem) => {
	try {
		const insertQuery = `INSERT INTO ${tableName} (id, value) VALUES (${todoItem.id}, "${todoItem.value}");`;

		return db.executeSql(insertQuery);
	} catch (error) {
		console.error(error);
		throw new Error("Failed to save todo item");
	}
};

export const deleteTodoItem = async (db: SQLiteDatabase, id: number) => {
	try {
		const deleteQuery = `DELETE FROM ${tableName} WHERE id = ${id}`;
		return db.executeSql(deleteQuery);
	} catch (error) {
		console.error(error);
		throw new Error("Failed to delete todo item");
	}
};

export const deleteAllTodoItems = async (db: SQLiteDatabase) => {
	try {
		const deleteQuery = `DELETE FROM ${tableName}`;
		return db.executeSql(deleteQuery);
	} catch (error) {
		console.error(error);
		throw new Error("Failed to delete todo items");
	}
};

export const deleteTable = async (db: SQLiteDatabase) => {
	try {
		const deleteQuery = `DROP TABLE IF EXISTS ${tableName}`;

		await db.executeSql(deleteQuery);
	} catch (error) {
		console.error(error);
		throw new Error("Failed to delete table");
	}
};
