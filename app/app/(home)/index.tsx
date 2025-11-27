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
    <Box className="flex-1 bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <StatusBar style="light" />
      <Center className="flex-1 px-6">
        <VStack space="2xl" className="w-full max-w-md items-center">
          {/* Logo/Icon Area */}
          <Box className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl items-center justify-center shadow-2xl border border-white/20">
            <Text className="text-6xl">📹</Text>
          </Box>

          <SignedIn>
            <VStack space="xl" className="items-center w-full">
              <VStack space="sm" className="items-center">
                <Heading size="4xl" className="text-white text-center font-bold tracking-tight">
                  Welcome back!
                </Heading>
                <Text size="md" className="text-gray-300 text-center">
                  {user?.emailAddresses[0].emailAddress}
                </Text>
              </VStack>
              
              <VStack space="md" className="w-full mt-4">
                <Button 
                  size="xl" 
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-2xl"
                >
                  <ButtonText className="font-bold text-lg tracking-wide">
                    🎥 Start a Call
                  </ButtonText>
                </Button>
                
                <Button 
                  size="xl" 
                  variant="outline"
                  className="w-full border-2 border-white/30 bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl"
                >
                  <ButtonText className="font-bold text-lg text-white tracking-wide">
                    📞 Join a Call
                  </ButtonText>
                </Button>

                <SignOutButton />
              </VStack>
            </VStack>
          </SignedIn>

          <SignedOut>
            {/* Title and Description */}
            <VStack space="lg" className="items-center">
              <Heading size="4xl" className="text-white text-center font-bold tracking-tight">
                Welcome to VibeOk
              </Heading>
              <Text size="lg" className="text-gray-300 text-center px-4 leading-relaxed">
                Connect with friends and family through high-quality video calls
              </Text>
            </VStack>

            {/* Features Card */}
            <VStack space="md" className="w-full bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
              <Box className="flex-row items-center gap-4 py-2">
                <Box className="w-12 h-12 bg-purple-500/20 rounded-2xl items-center justify-center">
                  <Text className="text-2xl">✨</Text>
                </Box>
                <VStack className="flex-1">
                  <Text className="text-white font-semibold text-base">Crystal Clear Quality</Text>
                  <Text className="text-gray-400 text-xs">HD video and audio</Text>
                </VStack>
              </Box>
              
              <Box className="flex-row items-center gap-4 py-2">
                <Box className="w-12 h-12 bg-purple-500/20 rounded-2xl items-center justify-center">
                  <Text className="text-2xl">🔒</Text>
                </Box>
                <VStack className="flex-1">
                  <Text className="text-white font-semibold text-base">Secure & Private</Text>
                  <Text className="text-gray-400 text-xs">End-to-end encrypted</Text>
                </VStack>
              </Box>
              
              <Box className="flex-row items-center gap-4 py-2">
                <Box className="w-12 h-12 bg-purple-500/20 rounded-2xl items-center justify-center">
                  <Text className="text-2xl">🌍</Text>
                </Box>
                <VStack className="flex-1">
                  <Text className="text-white font-semibold text-base">Global Connection</Text>
                  <Text className="text-gray-400 text-xs">Call from anywhere</Text>
                </VStack>
              </Box>
            </VStack>

            {/* Call to Action Buttons */}
            <VStack space="md" className="w-full mt-4">
              <Button 
                size="xl" 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-2xl"
                onPress={handleGetStarted}
              >
                <ButtonText className="font-bold text-lg tracking-wide">
                  Get Started
                </ButtonText>
              </Button>
              
              <Button 
                size="xl" 
                variant="outline"
                className="w-full border-2 border-white/30 bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl"
                onPress={handleJoinCall}
              >
                <ButtonText className="font-bold text-lg text-white tracking-wide">
                  Sign In
                </ButtonText>
              </Button>
            </VStack>

            {/* Footer */}
            <Text size="xs" className="text-gray-400 text-center mt-6 px-8">
              By continuing, you agree to our Terms & Privacy Policy
            </Text>
          </SignedOut>
        </VStack>
      </Center>
    </Box>
  );
}
