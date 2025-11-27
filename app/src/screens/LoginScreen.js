import React, { useState } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { Alert } from 'react-native';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        const result = await login(email, password);
        if (!result.success) {
            Alert.alert('Error', result.message);
        }
    };

    return (
        <Box className="flex-1 bg-white justify-center px-6">
            <VStack space="xl">
                <VStack space="xs">
                    <Heading size="3xl" className="text-purple-600">Welcome Back</Heading>
                    <Text size="lg" className="text-gray-500">Sign in to continue</Text>
                </VStack>

                <VStack space="md">
                    <Input size="xl" variant="outline" className="rounded-xl">
                        <InputField
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </Input>
                    <Input size="xl" variant="outline" className="rounded-xl">
                        <InputField
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </Input>
                </VStack>

                <Button
                    size="xl"
                    className="bg-purple-600 rounded-xl mt-4"
                    onPress={handleLogin}
                    isDisabled={isLoading}
                >
                    <ButtonText>{isLoading ? 'Signing In...' : 'Sign In'}</ButtonText>
                </Button>

                <Button
                    variant="link"
                    onPress={() => navigation.navigate('Register')}
                >
                    <ButtonText className="text-purple-600">Don't have an account? Sign Up</ButtonText>
                </Button>
            </VStack>
        </Box>
    );
}
