import { ToDoItem } from "@/components/TodoItem";
import { Stack } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TodoItem } from "@/models";
import { createTable, deleteTodoItem, getDBConnection, getTodoItems, saveTodoItem } from "@/services/db-service";

export default function Index() {
	const [todos, setTodos] = useState<TodoItem[]>([]);
	const [newTodo, setNewTodo] = useState<string | null>(null);

	const loadDataCallback = useCallback(async () => {
		try {
			const initTodos: TodoItem[] = [
				{ id: 0, value: "Get groceries" },
				{ id: 1, value: "Eat healthy" },
				{ id: 2, value: "Do some movement" },
			];

			const db = await getDBConnection();
			await createTable(db);

			const storedTodoItems = await getTodoItems(db);

			if (storedTodoItems.length) {
				setTodos(storedTodoItems);
			} else {
				initTodos.forEach(async (todo) => await saveTodoItem(db, todo));
				setTodos(initTodos);
			}
		} catch (error) {
			console.error(error);
		}
	}, []);

	useEffect(() => {
		loadDataCallback();
	}, [loadDataCallback]);

	const addTodo = async () => {
		if (!newTodo?.trim()) return;

		try {
			const db = await getDBConnection();
			const newTodos = [
				...todos,
				{
					id: todos.length
						? todos.reduce((acc, curr) => {
								if (curr.id > acc.id) return curr;
								return acc;
						  }).id + 1
						: 0,
					value: newTodo,
				},
			];
			setTodos(newTodos);
			await saveTodoItem(db, newTodos[newTodos.length - 1]);
			setNewTodo(null);
		} catch (error) {
			console.error(error);
		}
	};

	const deleteTodo = async (id: number) => {
		try {
			const db = await getDBConnection();
			await deleteTodoItem(db, id);
			todos.splice(id, 1);
			setTodos(todos.slice(0));
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top", "left", "right"]}>
			<Stack.Screen options={{ headerShown: false }} />
			<Text style={styles.header}>Todo Application</Text>

			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<FlatList
					contentContainerStyle={{ alignItems: "center", justifyContent: "center", gap: 10, marginTop: 10 }}
					keyExtractor={(item) => item.id.toString()}
					data={todos}
					renderItem={({ item }) => <ToDoItem todo={item} deleteTodo={deleteTodo} />}
					ListEmptyComponent={() => (
						<View style={styles.emptyContainer}>
							<Text style={styles.emptyMessage}>No todos yet</Text>
						</View>
					)}
				/>
			</View>
			<View style={styles.textInputContainer}>
				<TextInput style={styles.textInput} value={newTodo || ""} onChangeText={setNewTodo} />
				<Button
					disabled={!newTodo?.trim()}
					title="Add Todo"
					onPress={addTodo}
					color="black"
					accessibilityLabel="add todo item"
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	header: {
		textAlign: "center",
		fontWeight: 700,
		fontSize: 20,
		marginTop: 10,
		marginBottom: 20,
	},
	emptyContainer: {
		alignItems: "center",
	},
	emptyMessage: {
		fontSize: 16,
		marginTop: 40,
		color: "red",
		fontStyle: "italic",
	},
	textInputContainer: {
		position: "absolute",
		bottom: 0,
		alignSelf: "center",
		alignItems: "center",
		paddingBottom: 20,
		paddingTop: 10,
	},
	textInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: "#00000050",
		borderRadius: 5,
		height: 40,
		width: 300,
		backgroundColor: "white",
		paddingHorizontal: 10,
	},
});
