import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig'; // Import FIREBASE_DB and FIREBASE_AUTH from the configFirebase file
import { onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { NavigationProp } from '@react-navigation/native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
const logo = require("../../assets/logo.png")

interface Task {
    id: string;
    text: string;
    completed: boolean;
}

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const TaskManager = ({ navigation }: RouterProps) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskText, setTaskText] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const unsubscribe = onSnapshot(doc(FIREBASE_DB, `usertasks/${FIREBASE_AUTH.currentUser?.uid}`), (doc) => {
                    if (doc.exists()) {
                        const data = doc.data();
                        setTasks(data ? data.tasks : []);
                    }
                });

                return () => unsubscribe();
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        FIREBASE_AUTH.signOut();
    };

    const handleAddTask = async () => {
        if (taskText.trim() === '') return;

        const newTask: Task = {
            id: Date.now().toString(),
            text: taskText,
            completed: false,
        };

        try {
            await setDoc(doc(FIREBASE_DB, `usertasks/${FIREBASE_AUTH.currentUser?.uid}`), {
                tasks: [...tasks, newTask]
            }, { merge: true });
            setTaskText('');
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleToggleTask = async (taskId: string) => {
        try {
            const updatedTasks = tasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            );
            await setDoc(doc(FIREBASE_DB, `usertasks/${FIREBASE_AUTH.currentUser?.uid}`), { tasks: updatedTasks });
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            await setDoc(doc(FIREBASE_DB, `usertasks/${FIREBASE_AUTH.currentUser?.uid}`), { tasks: updatedTasks });
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const renderItem = ({ item }: { item: Task }) => (
        <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => handleToggleTask(item.id)} key={item.id}>
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
                <MaterialIcons name="add" size={24} color="white" />
                <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>
            <FlatList
                data={tasks}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.taskList}
            />

            <TouchableOpacity style={styles.addButton} onPress={handleLogout}>
                <MaterialIcons name="generating-tokens" size={24} color="white" />
                <Text style={styles.addButtonText}>Generate plan</Text>
            </TouchableOpacity>
        </View>

    );
}

export default TaskManager;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100,
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
        flexDirection: 'row',
        backgroundColor: '#1b444f',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center', // Center text horizontally
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
        width: '75%',
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
