import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Link, router } from 'expo-router';
import { checkUserLogin } from '@/api/api';
import { useCart } from '@/context/AppContext';
import { User } from '@supabase/supabase-js';


const { width } = Dimensions.get('window');

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { setCurrentUser } = useCart();

    const validateInputs = () => {
        if (!email.trim()) {
            Alert.alert('Validation Error', 'Please enter your email');
            return false;
        }
        if (!password.trim()) {
            Alert.alert('Validation Error', 'Please enter your password');
            return false;
        }
        return true;
    };

    const handleSignIn = async () => {
        if (!validateInputs()) return;

        setIsLoading(true);
        setError('');

        try {
            const { success, user, error } = await checkUserLogin(email, password);

            if (!success) {
                alert(error?.message); // 
                setError('Invalid email or password.');
            } else {
                alert(`Welcome, ${user.full_name}!`);
                setCurrentUser(user);
                router.push('/(tabs)/home');
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            const errorMessage = 'Something went wrong. Please try again.';
            Alert.alert('Error', errorMessage);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        };
    }
    return (
        <ImageBackground
            source={require('../../assets/images/bg.jpg')}
            style={styles.backgroundImage}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}


                    <View style={styles.overlay}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../../assets/images/logo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.formContainer}>
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>Sign in to your account</Text>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor="#8A7968"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    autoComplete="email"
                                    editable={!isLoading}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="#8A7968"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    autoComplete="password"
                                    editable={!isLoading}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.button, isLoading && styles.buttonDisabled]}
                                onPress={handleSignIn}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#2C1810" />
                                ) : (
                                    <Text style={styles.buttonText}>Sign in</Text>
                                )}
                            </TouchableOpacity>

                            <Link href="/sign-up" asChild>
                                <TouchableOpacity style={styles.linkButton}>
                                    <Text style={styles.linkText}>
                                        Don't have an account? <Text style={styles.linkTextBold}>Sign Up</Text>
                                    </Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 20,
        paddingHorizontal: 24,
        paddingVertical: 32,
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 15,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    logo: {
        width: Math.min(width * 0.6, 240),
        height: Math.min(width * 0.6, 240),
    },
    formContainer: {
        width: '100%',
        maxWidth: 350,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#77400f',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B5B4F',
        textAlign: 'center',
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E5D5C8',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    button: {
        backgroundColor: '#8B4513',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#8B4513',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    linkButton: {
        marginTop: 24,
        alignItems: 'center',
        paddingVertical: 12,
    },
    linkText: {
        color: '#6B5B4F',
        fontSize: 16,
    },
    linkTextBold: {
        fontWeight: '600',
        color: '#8B4513',
    },
    buttonDisabled: {
        backgroundColor: '#A0A0A0',
    },
    errorContainer: {
        backgroundColor: '#FFE6E6',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#FF4444',
    },
    errorText: {
        color: '#CC0000',
        fontSize: 14,
        textAlign: 'center',
    },
}); 