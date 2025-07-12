import { TodoItem } from "@/models";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export const ToDoItem: React.FC<{
	todo: TodoItem;
	deleteTodo: Function;
}> = ({ todo, deleteTodo }) => {
	return (
		<View style={styles.todoContainer}>
			<View style={styles.todoTextContainer}>
				<Text style={styles.sectionTitle}>{todo.value}</Text>
			</View>
			<Button
				onPress={() => deleteTodo(todo.id)}
				title="Mark as completed!"
				color="grey"
				accessibilityLabel="delete todo item"
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	todoContainer: {
		paddingVertical: 5,
		paddingHorizontal: 20,
		borderRadius: 10,
		borderColor: "#00000025",
		borderWidth: 0.5,
	},
	todoTextContainer: {
		alignItems: "center",
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "400",
	},
});
