import { View, Text, StyleSheet, TextInput, ActivityIndicator, SafeAreaView, Image, TouchableOpacity, Pressable } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const logo = require("../../assets/logo.png")

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const ChangePassword = () => {
        if (email) {
            setLoading(true);
            sendPasswordResetEmail(FIREBASE_AUTH, email)
                .then(() => {
                    setLoading(false);
                    alert('Email envoyé!');
                    navigation.navigate('Login'); // Navigate back to the login screen
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                    alert('Erreur lors de l\'envoi de l\'email!');
                });
        } else {
            alert('Veuillez entrer votre email!');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={logo} style={styles.image} resizeMode='contain' />
            <Text style={styles.title}>Modifier votre mot de passe!</Text>
            <View style={styles.inputView}>
                <TextInput value={email} style={styles.input} placeholder='Email...' autoCapitalize='none' onChangeText={(text) => setEmail(text)} />
            </View>
            
            <Text></Text>
            <View style={styles.buttonView}>
                {loading ? (
                    <ActivityIndicator color="white" size='large' />
                ) : (
                    <TouchableOpacity style={styles.loginButton} onPress={ChangePassword}>
                        <Text style={styles.buttonText}>Envoyé un lien</Text>
                    </TouchableOpacity>
                )}
            </View>
            
            <View style={styles.optionsText}>
                <Text>tu l'as en mémoire ?</Text>
                <Pressable onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.login}>Connectez-vous ici</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
};

export default ForgotPassword;

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: "#1b444f",
        borderRadius: 7,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        width: "100%"
    },
    
    login: {
        color: "#1b444f",
        fontSize: 13
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
        fontSize: 20,
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        paddingVertical: 40,
        color: "#1b444f"
    },
    optionsText: {
        textAlign: "center",
        paddingVertical: 10,
        color: "gray",
        fontSize: 13,
        marginBottom: 6
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
    buttonView: {
        width: "100%",
        paddingHorizontal: 50
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    }
});
