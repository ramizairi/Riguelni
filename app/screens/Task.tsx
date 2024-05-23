import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, Modal, ActivityIndicator } from 'react-native';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig'; // Import FIREBASE_DB and FIREBASE_AUTH from the configFirebase file
import { onSnapshot, doc, setDoc, deleteDoc, getDocs, collection, query, getDoc, where } from "firebase/firestore";
import { NavigationProp } from '@react-navigation/native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { showMessage } from 'react-native-flash-message';
import * as GoogleGenerativeAI from "@google/generative-ai";
const logo = require("../../assets/logo.png");

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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [responseText, setResponseText] = useState('');
    const API_KEY = "AIzaSyA-RiB6nvzquymNr4YPUXcfMY3LQd2pxJ4";
    const [loading, setLoading] = useState(false);

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

    const handleGeneratePlan = async () => {
        try {
            // Check if the user ID is available
            if (!FIREBASE_AUTH.currentUser?.uid) {
                console.error('User ID not available.');
                return;
            }

            setLoading(true);
            const userTasksCollectionRef = collection(FIREBASE_DB, 'usertasks');
            const userTasksDocRef = doc(userTasksCollectionRef, FIREBASE_AUTH.currentUser?.uid);
            console.log('User tasks document reference:', userTasksDocRef.path);

            // Fetch tasks from Firestore
            const userTasksDocSnapshot = await getDoc(userTasksDocRef);
            const userTasksData = userTasksDocSnapshot.data();
            const tasks = userTasksData ? userTasksData.tasks : [];
            console.log('Tasks:', tasks);


            // Prepare task text for Gemini Chat API
            const taskPrompt = tasks.length > 0 ? tasks.map(task => task.text).join('. ') : "No tasks pending.";
            console.log('Task prompt:', taskPrompt);

            // Greet and generate plan using Gemini Chat API
            const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `Hey there, I need your help with organizing my tasks efficiently. Can you help me break down my to-do list into manageable chunks with estimated times for completion? Here's what I need you to do:" ${taskPrompt} " remember, the key here is efficiency! And i want you to give me the answers in format Task : Estimated time : What you should do that Can you handle that? "`;
            console.log('Prompt:', prompt);

            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            console.log(text);
            setResponseText(text);
            showMessage({
                message: "Gemini Chat Response",
                description: text,
                type: "info",
                icon: "info",
                duration: 2000,
            });

            setLoading(false);
            setIsModalVisible(true);
        } catch (error) {
            console.error('Error generating plan:', error);
        }
    };
    const closeModal = () => {
        setIsModalVisible(false);
    };
    const renderItem = ({ item }: { item: Task }) => (
        <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => handleToggleTask(item.id)} key={item.id}>
                <Text style={[styles.taskText, item.completed && styles.completedTaskText]}>
                    {item.text}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                <MaterialIcons name="delete" size={24} color="red" />
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
            {loading ? (
                <ActivityIndicator color="white" size='large' />
            ) : (
                <TouchableOpacity style={styles.generateButton} onPress={handleGeneratePlan}>
                    <FontAwesome size={24} color="white" />
                    <Text style={styles.addButtonText}>Generate plan</Text>
                </TouchableOpacity>
            )}

            <Modal visible={isModalVisible} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{responseText}</Text>
                        <TouchableOpacity onPress={closeModal}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    generateButton: {
        flexDirection: 'row',
        backgroundColor: '#1b444f', // Set background color to gradient from red to blue
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
        width: '74%',
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
    }, modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 50,
        marginTop: 50,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
    },
    closeButton: {
        color: 'blue',
        fontSize: 16,
    },
});
