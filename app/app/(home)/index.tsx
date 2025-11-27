import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { SignOutButton } from '@/components/SignOutButton';

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/(auth)/sign-up');
  };

  const handleJoinCall = () => {
    router.push('/(auth)/sign-in');
  };

  return (
    <Box className="flex-1 bg-gradient-to-b from-purple-900 to-indigo-900">
      <StatusBar style="light" />
      <Center className="flex-1 px-6">
        <VStack space="2xl" className="w-full max-w-md items-center">
          {/* Logo/Icon Area */}
          <Box className="w-24 h-24 bg-purple-500 rounded-full items-center justify-center mb-4">
            <Text className="text-5xl">📹</Text>
          </Box>

          <SignedIn>
            <VStack space="md" className="items-center w-full">
              <Heading size="3xl" className="text-white text-center">
                Welcome back!
              </Heading>
              <Text size="lg" className="text-gray-300 text-center">
                Hello {user?.emailAddresses[0].emailAddress}
              </Text>
              
              <VStack space="md" className="w-full mt-8">
                <Button 
                  size="lg" 
                  className="w-full bg-purple-600 rounded-xl"
                >
                  <ButtonText className="font-semibold text-lg">
                    Start a Call
                  </ButtonText>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full border-purple-400 rounded-xl"
                >
                  <ButtonText className="font-semibold text-lg text-purple-300">
                    Join a Call
                  </ButtonText>
                </Button>

                <SignOutButton />
              </VStack>
            </VStack>
          </SignedIn>

          <SignedOut>
            {/* Title and Description */}
            <VStack space="md" className="items-center">
              <Heading size="4xl" className="text-white text-center font-bold">
                Welcome to VibeOk
              </Heading>
              <Text size="lg" className="text-gray-300 text-center px-4">
                Connect with friends and family through high-quality video calls
              </Text>
            </VStack>

            {/* Features */}
            <VStack space="sm" className="mt-8 w-full">
              <Box className="flex-row items-center gap-3">
                <Text className="text-2xl">✨</Text>
                <Text className="text-white">Crystal clear video quality</Text>
              </Box>
              <Box className="flex-row items-center gap-3">
                <Text className="text-2xl">🔒</Text>
                <Text className="text-white">Secure and private calls</Text>
              </Box>
              <Box className="flex-row items-center gap-3">
                <Text className="text-2xl">🌍</Text>
                <Text className="text-white">Connect from anywhere</Text>
              </Box>
            </VStack>

            {/* Call to Action Buttons */}
            <VStack space="md" className="w-full mt-8">
              <Button 
                size="lg" 
                className="w-full bg-purple-600 rounded-xl"
                onPress={handleGetStarted}
              >
                <ButtonText className="font-semibold text-lg">
                  Get Started
                </ButtonText>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="w-full border-purple-400 rounded-xl"
                onPress={handleJoinCall}
              >
                <ButtonText className="font-semibold text-lg text-purple-300">
                  Join a Call
                </ButtonText>
              </Button>
            </VStack>

            {/* Footer */}
            <Text size="sm" className="text-gray-400 text-center mt-8">
              By continuing, you agree to our Terms & Privacy Policy
            </Text>
          </SignedOut>
        </VStack>
      </Center>
    </Box>
  );
}
