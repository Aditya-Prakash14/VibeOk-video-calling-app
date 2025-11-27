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
      <Box className="flex-1 bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <Center className="flex-1 px-6">
          <VStack space="2xl" className="w-full max-w-md">
            {/* Icon */}
            <Box className="items-center">
              <Box className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl items-center justify-center mb-6 shadow-2xl border border-white/20">
                <Text className="text-5xl">✉️</Text>
              </Box>
              <Heading size="4xl" className="text-white text-center font-bold tracking-tight">
                Verify Email
              </Heading>
              <Text size="md" className="text-gray-300 text-center mt-2 px-4">
                We sent a code to {emailAddress}
              </Text>
            </Box>

            {/* Form Card */}
            <VStack space="lg" className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
              <VStack space="md">
                <Text className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-1">Verification Code</Text>
                <Input 
                  variant="outline" 
                  size="xl" 
                  className="bg-white/10 border-white/20 rounded-xl shadow-lg"
                >
                  <InputField
                    placeholder="000000"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    className="text-white text-base text-center tracking-widest"
                    placeholderTextColor="#9CA3AF"
                    maxLength={6}
                  />
                </Input>
              </VStack>

              <Button
                size="xl"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl mt-4 shadow-xl"
                onPress={onVerifyPress}
              >
                <ButtonText className="font-bold text-lg tracking-wide">Verify Email</ButtonText>
              </Button>
            </VStack>

            <Text className="text-gray-400 text-sm text-center">
              Didn't receive the code? Check your spam folder
            </Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <Center className="flex-1 px-6">
        <VStack space="2xl" className="w-full max-w-md">
          {/* Logo/Icon */}
          <Box className="items-center">
            <Box className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl items-center justify-center mb-6 shadow-2xl border border-white/20">
              <Text className="text-5xl">📹</Text>
            </Box>
            <Heading size="4xl" className="text-white text-center font-bold tracking-tight">
              Create Account
            </Heading>
            <Text size="md" className="text-gray-300 text-center mt-2">
              Join VibeOk and start connecting
            </Text>
          </Box>

          {/* Form Card */}
          <VStack space="lg" className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
            <VStack space="md">
              <Text className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-1">Email</Text>
              <Input 
                variant="outline" 
                size="xl" 
                className="bg-white/10 border-white/20 rounded-xl shadow-lg"
              >
                <InputField
                  autoCapitalize="none"
                  placeholder="you@example.com"
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                  keyboardType="email-address"
                  className="text-white text-base"
                  placeholderTextColor="#9CA3AF"
                />
              </Input>
            </VStack>

            <VStack space="md">
              <Text className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-1">Password</Text>
              <Input 
                variant="outline" 
                size="xl" 
                className="bg-white/10 border-white/20 rounded-xl shadow-lg"
              >
                <InputField
                  placeholder="Create a strong password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  className="text-white text-base"
                  placeholderTextColor="#9CA3AF"
                />
              </Input>
              <Text className="text-white/50 text-xs mt-1">At least 8 characters</Text>
            </VStack>

            <Button
              size="xl"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl mt-4 shadow-xl"
              onPress={onSignUpPress}
            >
              <ButtonText className="font-bold text-lg tracking-wide">Create Account</ButtonText>
            </Button>
          </VStack>

          {/* Footer */}
          <Box className="flex-row justify-center items-center gap-2">
            <Text className="text-gray-400 text-sm">Already have an account?</Text>
            <Link href="/(auth)/sign-in">
              <Text className="text-purple-400 font-bold text-sm">Sign in</Text>
            </Link>
          </Box>
        </VStack>
      </Center>
    </Box>
  );
}
