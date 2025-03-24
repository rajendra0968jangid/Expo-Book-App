import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Alert } from 'react-native'
import React, { useState } from 'react'
import styles from "../../assets/styles/login.styles"
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { Link } from 'expo-router';
import { useAuthStore } from '../../store/authStore'
export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    // const [isLoading, setisLoading] = useState(false)

    const { isLoading, login, isCheckingAuth } = useAuthStore();


    const handleLogin = async () => {
        const result = await login(email, password);
        

        if (!result.success) Alert.alert("Error", result.error);
    }

    if (isCheckingAuth) return null

    return (
        <KeyboardAvoidingView>
            <View style={styles.container}>
                <View style={styles.topIllustration}>
                    <Image source={require("../../assets/images/i.png")}
                        style={styles.illustrationImage}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.card}>
                    <View style={styles.formContainer}>
                        {/* email */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name='mail-outline' size={20} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder='Enter your email'
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType='email-address'
                                    autoCapitalize='none' />

                            </View>
                        </View>
                        {/* password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Passwords</Text>
                            <View style={styles.inputContainer}>
                                {/* left icon */}
                                <Ionicons name='lock-closed-outline'
                                    size={20} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput style={styles.input} placeholder='Enter your password'
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword} />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                    {/* right icon */}
                                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"}
                                        size={20}
                                        color={COLORS.primary} />
                                </TouchableOpacity>

                            </View>
                        </View>
                        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                            {isLoading ? (<ActivityIndicator color="#fff" />) : (<Text style={styles.buttonText}>Login</Text>)}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account?</Text>
                        <Link href="/signup" asChild>
                            <TouchableOpacity>
                                <Text style={styles.link}>Sign In</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                </View>
            </View>
        </KeyboardAvoidingView>
    )

}