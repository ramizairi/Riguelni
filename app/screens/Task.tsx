import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { FIREBASE_DB } from '../../FirebaseConfig'; // Import FIREBASE_DB from the FirebaseConfig file

const logo = require("../../assets/logo.png")

interface Task {
    id: string;
    text: string;
    completed: boolean;
}

export default function ToDoApp() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskText, setTaskText] = useState('');

    useEffect(() => {
        const unsubscribe = FIREBASE_DB.collection('usertasks').doc(FIREBASE_AUTH.currentUser?.uid).collection('tasks')
            .onSnapshot(snapshot => {
                const data: Task[] = [];
                snapshot.forEach(doc => {
                    data.push({ id: doc.id, ...doc.data() } as Task);
                });
                setTasks(data);
            });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleAddTask = () => {
        if (taskText.trim() === '') return;

        const newTask: Task = {
            id: Date.now().toString(),
            text: taskText,
            completed: false,
        };

        FIREBASE_DB.collection('usertasks').doc(FIREBASE_AUTH.currentUser?.uid).collection('tasks').doc(newTask.id).set(newTask);

        setTasks([...tasks, newTask]);
        setTaskText('');
    };

    const handleToggleTask = (taskId: string) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const handleDeleteTask = (taskId: string) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

        FIREBASE_DB.collection('usertasks').doc(FIREBASE_AUTH.currentUser?.uid).collection('tasks').doc(taskId).delete();
    };

    const renderItem = ({ item }: { item: Task }) => (
        <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => handleToggleTask(item.id)}>
                <Text style={[styles.taskText, item.completed && styles.completedTaskText]}>
                    {item.text}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.image} resizeMode='contain' />
            <TextInput
                style={styles.input}
                value={taskText}
                onChangeText={setTaskText}
                placeholder="Enter task"
                onSubmitEditing={handleAddTask}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>
            <FlatList
                data={tasks}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.taskList}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '100%',
    },
    addButton: {
        backgroundColor: '#1b444f',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    taskList: {
        flexGrow: 1,
        width: '100%',
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        width: '100%',
    },
    taskText: {
        fontSize: 16,
    },
    completedTaskText: {
        textDecorationLine: 'line-through',
        color: '#777',
    },
    deleteButton: {
        color: 'red',
    },
    image: {
        height: 200,
        width: 200
    },
});
