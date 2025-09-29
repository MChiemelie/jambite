import { signUpWithGoogle } from '@/services';
import Image from 'next/image';

export default function GoogleAuth() {
  return (
    <form action={signUpWithGoogle}>
      <button type="submit" className="border border-foreground/20 rounded-lg w-full flex items-center justify-center p-2 shadow-lg mx-auto gap-2">
        <Image src="/images/socials/google.png" alt="Login with Google Button" width={24} height={24} className="w-6" />
        <span className="text-sm font-medium">Google</span>
      </button>
    </form>
  );
}
