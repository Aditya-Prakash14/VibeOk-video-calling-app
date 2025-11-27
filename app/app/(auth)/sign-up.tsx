import * as React from 'react';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Center } from '@/components/ui/center';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <Box className="flex-1 bg-gradient-to-b from-purple-900 to-indigo-900">
        <Center className="flex-1 px-6">
          <VStack space="xl" className="w-full max-w-md">
            <VStack space="md" className="items-center">
              <Heading size="3xl" className="text-white text-center">
                Verify your email
              </Heading>
              <Text className="text-gray-300 text-center">
                Enter the verification code sent to your email
              </Text>
            </VStack>

            <VStack space="lg">
            <Input variant="outline" size="lg" className="bg-white/10 border-purple-400">
              <InputField
                placeholder="Enter verification code"
                value={code}
                onChangeText={setCode}
                className="text-white"
                placeholderTextColor="#9CA3AF"
              />
            </Input>              <Button
                size="lg"
                className="w-full bg-purple-600 rounded-xl"
                onPress={onVerifyPress}
              >
                <ButtonText className="font-semibold text-lg">Verify</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </Center>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-gradient-to-b from-purple-900 to-indigo-900">
      <Center className="flex-1 px-6">
        <VStack space="xl" className="w-full max-w-md">
          <VStack space="md" className="items-center">
            <Heading size="3xl" className="text-white text-center">
              Create Account
            </Heading>
            <Text className="text-gray-300 text-center">
              Sign up to start video calling
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
              onPress={onSignUpPress}
            >
              <ButtonText className="font-semibold text-lg">Continue</ButtonText>
            </Button>

            <Box className="flex-row justify-center gap-2">
              <Text className="text-gray-300">Already have an account?</Text>
              <Link href="/(auth)/sign-in">
                <Text className="text-purple-400 font-semibold">Sign in</Text>
              </Link>
            </Box>
          </VStack>
        </VStack>
      </Center>
    </Box>
  );
}
