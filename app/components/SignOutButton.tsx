import { useClerk } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Button, ButtonText } from '@/components/ui/button';

export const SignOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <Button
      size="xl"
      variant="outline"
      className="w-full border-2 border-red-400/40 bg-red-500/5 rounded-2xl mt-4 shadow-lg"
      onPress={handleSignOut}
    >
      <ButtonText className="font-bold text-base text-red-400 tracking-wide">
        🚪 Sign Out
      </ButtonText>
    </Button>
  );
};
