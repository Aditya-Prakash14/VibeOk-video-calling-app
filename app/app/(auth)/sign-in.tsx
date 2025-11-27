import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Center } from '@/components/ui/center';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <Box className="flex-1 bg-gradient-to-b from-purple-900 to-indigo-900">
      <Center className="flex-1 px-6">
        <VStack space="xl" className="w-full max-w-md">
          <VStack space="md" className="items-center">
            <Heading size="3xl" className="text-white text-center">
              Welcome Back
            </Heading>
            <Text className="text-gray-300 text-center">
              Sign in to continue
            </Text>
          </VStack>

          <VStack space="lg">
            <Input variant="outline" size="lg" className="bg-white/10 border-purple-400">
              <InputField
                autoCapitalize="none"
                placeholder="Enter email"
                value={emailAddress}
                onChangeText={setEmailAddress}
                keyboardType="email-address"
                className="text-white"
                placeholderTextColor="#9CA3AF"
              />
            </Input>

            <Input variant="outline" size="lg" className="bg-white/10 border-purple-400">
              <InputField
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="text-white"
                placeholderTextColor="#9CA3AF"
              />
            </Input>

            <Button
              size="lg"
              className="w-full bg-purple-600 rounded-xl"
              onPress={onSignInPress}
            >
              <ButtonText className="font-semibold text-lg">Sign In</ButtonText>
            </Button>

            <Box className="flex-row justify-center gap-2">
              <Text className="text-gray-300">Don't have an account?</Text>
              <Link href="/(auth)/sign-up">
                <Text className="text-purple-400 font-semibold">Sign up</Text>
              </Link>
            </Box>
          </VStack>
        </VStack>
      </Center>
    </Box>
  );
}
