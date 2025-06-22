import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  Dimensions
} from 'react-native';
import { Link, router } from 'expo-router';
import { User } from '@/types/types';
import { addUser } from '@/api/api';
import { useCart } from '@/context/AppContext';


const { width } = Dimensions.get('window');


export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setCurrentUser } = useCart();

  const getAvatarUrl = (name: string) => {
    const baseUrl = 'https://ui-avatars.com/api/';
    const formattedName = encodeURIComponent(name);
    const background = '876d4c';
    const color = '2C1810';

    return `${baseUrl}?name=${formattedName}&background=${background}&color=${color}`;
  };

  const validateInputs = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Validation Error', 'Please enter your password');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmission = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    setError('');

    const user: User = {
      email: email.trim(),
      full_name: name.trim(),
      password: password,
      avatar_url: getAvatarUrl(name.trim()),
    };

    try {
      const res = await addUser(user);

      if (res?.success && res?.data) {
        Alert.alert('Success', `User registered successfully! ,welcome ${res?.data.full_name}`, [
          { text: 'OK', onPress: () => router.push('/(tabs)/home') }
        ]);

        setCurrentUser(res?.data);
      } else {
        const errorMessage = res?.error?.message || 'User registration failed';
        Alert.alert('Registration Failed', errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      const errorMessage = 'Something went wrong. Please try again.';
      Alert.alert('Error', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/bg.jpg')}
      style={styles.backgroundImage}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.overlay}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>Create Account</Text>

              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#A0A0A0"
                  value={name}
                  onChangeText={setName}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#A0A0A0"
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
                  placeholderTextColor="#A0A0A0"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password-new"
                  editable={!isLoading}
                />
              </View>

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleSubmission}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#2C1810" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>

              <Link href="/sign-in" asChild>
                <TouchableOpacity style={styles.linkButton}>
                  <Text style={styles.linkText}>
                    Already have an account? <Text style={styles.linkTextBold}>Sign In</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#77400f',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: '#8B4513',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
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