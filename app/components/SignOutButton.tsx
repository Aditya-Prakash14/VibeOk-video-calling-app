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
      size="lg"
      variant="outline"
      className="w-full border-red-400 rounded-xl mt-4"
      onPress={handleSignOut}
    >
      <ButtonText className="font-semibold text-lg text-red-400">
        Sign Out
      </ButtonText>
    </Button>
  );
};
