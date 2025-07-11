import { ToDoItem } from "@/components/TodoItem";
import { Stack } from "expo-router";
import { useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
	const initialTodos = ["Go to shopping", "Eat healthy", "Do some movement"];
	const [todos, setTodos] = useState<string[]>(initialTodos);
	const [newTodo, setNewTodo] = useState<string | null>(null);

	const addTodo = () => {
		if (!newTodo?.trim()) return;
		setTodos([...todos, newTodo]);
		setNewTodo(null);
	};

	const deleteTodo = (todo: string) => {
		setTodos([...todos.filter((item) => item !== todo)]);
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top", "left", "right"]}>
			<Stack.Screen options={{ headerShown: false }} />
			<Text style={styles.header}>Todo Application</Text>

			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<FlatList
					contentContainerStyle={{ alignItems: "center", justifyContent: "center", gap: 10, marginTop: 10 }}
					keyExtractor={(item) => item}
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
