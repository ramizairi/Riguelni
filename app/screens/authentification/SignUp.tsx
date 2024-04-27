import { View, Text, StyleSheet, TextInput, ActivityIndicator, KeyboardAvoidingView, Alert, Pressable, SafeAreaView, Switch, Image, Button, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../FirebaseConfig';
import { sendEmailVerification } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection } from "firebase/firestore";

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';


interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const SignUp = ({ navigation }: RouterProps) => {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const handleSignUp = () => {
        if (!email || !password || !confirmPassword || !phone) {
            Alert.alert('Tous les champs sont requis');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Les mots de passe ne correspondent pas');
            return;
        } else {

            setLoading(true);
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    setLoading(true);
                    const user = userCredential.user;
                    sendEmailVerification(user)
                        .then(() => {
                            Alert.alert('Un email de vérification a été envoyé à votre adresse email.');
                        })
                        .catch(error => {
                            console.log(error);
                            Alert.alert('Erreur lors de l\'envoi de l\'email de vérification', error.message);
                        });
                    handleAdduser();
                    navigation.navigate('Login');
                })
                .catch(error => {
                    setLoading(false);
                    Alert.alert('Erreur lors de la création du compte', error.message);
                });
        }
    };

    const handleAdduser = async () => {
        try {
            await addDoc(collection(FIREBASE_DB, 'user'), {
                fname: fname,
                lname: lname,
                email: email,
                phone: phone,
            });
        } catch (error) {
            console.error('Error adding user to database: ', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <View style={styles.inputView}>
                <TextInput
                    value={fname}
                    style={styles.input}
                    placeholder='First Name'
                    autoCapitalize='none'
                    onChangeText={(text) => setFname(text)}
                />
                <TextInput
                    value={lname}
                    style={styles.input}
                    placeholder='Last Name'
                    autoCapitalize='none'
                    onChangeText={(text) => setLname(text)}
                />
                <TextInput
                    value={email}
                    style={styles.input}
                    placeholder='Email'
                    autoCapitalize='none'
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    value={password}
                    style={styles.input}
                    placeholder='Password'
                    autoCapitalize='none'
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={true}
                />
                <TextInput
                    value={confirmPassword}
                    style={styles.input}
                    placeholder='Confirm password'
                    autoCapitalize='none'
                    onChangeText={(text) => setConfirmPassword(text)}
                    secureTextEntry={true}
                />
                <TextInput
                    value={phone}
                    style={styles.input}
                    placeholder='Phone numb'
                    autoCapitalize='none'
                    onChangeText={(text) => setPhone(text)}
                    keyboardType='numeric'
                />
            </View>

            <Text></Text>
            <View style={styles.buttonView}>
                {loading ? (
                    <ActivityIndicator color="white" size='large' />
                ) : (
                    <TouchableOpacity style={styles.loginButton} onPress={() => { handleSignUp(); }}>
                    <MaterialIcons name="login" size={24} color="white" />
                        <Text style={styles.buttonText}>     Sign Up</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.optionsText}>
                <Text>Already have an account?</Text>
                <Pressable onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.signup}>               Login Here</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: "#1b444f",
        borderRadius: 7,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        width: "100%",
        justifyContent: 'center', // Center text horizontally
        flexDirection: 'row',
    },
    container: {
        alignItems: "center",
        paddingTop: 70,
    },
    image: {
        height: 200,
        width: 200
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        paddingVertical: 40,
        color: "#1b444f"
    },
    inputView: {
        gap: 15,
        width: "100%",
        paddingHorizontal: 40,
        marginBottom: 5
    },
    input: {
        height: 50,
        paddingHorizontal: 20,
        borderColor: "#1b444f",
        borderWidth: 1,
        borderRadius: 7
    },
    switch: {
        flexDirection: "row",
        gap: 1,
        justifyContent: "center",
        alignItems: "center"

    },
    rememberText: {
        fontSize: 13
    },
    forgetText: {
        fontSize: 11,
        color: "#1b444f"
    },
    button: {
        backgroundColor: "#1b444f",
        height: 45,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    },
    buttonView: {
        width: "100%",
        paddingHorizontal: 50
    },
    optionsText: {
        textAlign: "center",
        paddingVertical: 10,
        color: "gray",
        fontSize: 13,
        marginBottom: 6
    },
    mediaIcons: {
        flexDirection: "row",
        gap: 15,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 23
    },
    icons: {
        width: 40,
        height: 40,
    },
    footerText: {
        textAlign: "center",
        color: "gray",
    },
    signup: {
        color: "#1b444f",
        fontSize: 13
    }
})