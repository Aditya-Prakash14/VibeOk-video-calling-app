import React, { useState } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { Alert } from 'react-native';

export default function HomeScreen({ navigation }) {
    const [roomId, setRoomId] = useState('');
    const { user, logout } = useAuth();

    const handleJoinRoom = () => {
        if (!roomId) {
            Alert.alert('Error', 'Please enter a Room ID');
            return;
        }
        navigation.navigate('Call', { roomId, user });
    };

    const handleCreateRoom = () => {
        const newRoomId = Math.random().toString(36).substring(7);
        setRoomId(newRoomId);
        navigation.navigate('Call', { roomId: newRoomId, user });
    };

    return (
        <Box className="flex-1 bg-white justify-center px-6">
            <VStack space="xl">
                <VStack space="xs" className="items-center">
                    <Heading size="3xl" className="text-purple-600">VibeOk</Heading>
                    <Text size="lg" className="text-gray-500">Logged in as {user?.email}</Text>
                </VStack>

                <VStack space="md" className="mt-8">
                    <Input size="xl" variant="outline" className="rounded-xl">
                        <InputField
                            placeholder="Enter Room ID"
                            value={roomId}
                            onChangeText={setRoomId}
                            autoCapitalize="none"
                        />
                    </Input>

                    <Button
                        size="xl"
                        className="bg-purple-600 rounded-xl"
                        onPress={handleJoinRoom}
                    >
                        <ButtonText>Join Room</ButtonText>
                    </Button>

                    <Button
                        size="xl"
                        variant="outline"
                        className="border-purple-600 rounded-xl"
                        onPress={handleCreateRoom}
                    >
                        <ButtonText className="text-purple-600">Create New Room</ButtonText>
                    </Button>
                </VStack>

                <Button
                    variant="link"
                    className="mt-8"
                    onPress={logout}
                >
                    <ButtonText className="text-red-500">Logout</ButtonText>
                </Button>
            </VStack>
        </Box>
    );
}
