import { 
    View, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, ActivityIndicator, Alert 
} from 'react-native';
import React, { useState } from 'react';
import styles from '../../assets/styles/signup.styles';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

export default function Signup() {
    const router = useRouter();
    const { isLoading, register } = useAuthStore();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignup = async () => {
        if (!username || !email || !phone || !password || !confirmPassword) {
            return Alert.alert("Error", "All fields are required.");
        }

        if (password !== confirmPassword) {
            return Alert.alert("Error", "Passwords do not match.");
        }

        if (!/^\d{10}$/.test(phone)) {
            return Alert.alert("Error", "Please enter a valid 10-digit phone number.");
        }

        const result = await register(username, email, phone, password);
        if (!result.success) {
            Alert.alert("Error", result.error);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.container}>
                <View style={styles.card}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>BookWorm</Text>
                        <Text style={styles.subtitle}>Share your favorite reads</Text>
                    </View>

                    <View style={styles.formContainer}>
                        {/* Username Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Username</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="JohnDoe" 
                                    placeholderTextColor={COLORS.placeholderText} 
                                    value={username}
                                    onChangeText={setUsername}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Email Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="johndoe@gmail.com" 
                                    placeholderTextColor={COLORS.placeholderText} 
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        {/* Phone Number Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="call-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="9876543210" 
                                    placeholderTextColor={COLORS.placeholderText} 
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="Enter your password"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={COLORS.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="Confirm your password"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                                    <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color={COLORS.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Signup Button */}
                        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={isLoading}>
                            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.link}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
