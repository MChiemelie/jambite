'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/shadcn/alert-dialog';
import { Button } from '@/components/shadcn/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/shadcn/input-otp';
import { sendEmailOTP, verifySecret } from '@/services/auth';
import { Spinner } from '../shadcn/spinner';

export default function OtpModal({ userId, email }: { userId: string; email: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const sessionId = await verifySecret({ userId, password });
      if (sessionId) router.push('/dashboard');
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    await sendEmailOTP({ email });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className='shad-alert-dialog bg-background'>
        <AlertDialogHeader className='relative flex justify-center'>
          <AlertDialogTitle className='h2 text-center'>
            Enter Your OTP
            <X onClick={() => setIsOpen(false)} className='otp-close-button' />
          </AlertDialogTitle>
          <AlertDialogDescription className='subtitle-2 text-foreground text-center'>
            We&apos;ve sent a code to <span className='text-brand pl-1'>{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup className='shad-otp'>
            <InputOTPSlot index={0} className='shad-otp-slot ring-brand' />
            <InputOTPSlot index={1} className='shad-otp-slot' />
            <InputOTPSlot index={2} className='shad-otp-slot' />
            <InputOTPSlot index={3} className='shad-otp-slot' />
            <InputOTPSlot index={4} className='shad-otp-slot' />
            <InputOTPSlot index={5} className='shad-otp-slot' />
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className='flex w-full flex-col gap-4'>
            <AlertDialogAction onClick={handleSubmit} className='h-12' type='button'>
              Submit
              {isLoading && <Spinner />}
            </AlertDialogAction>

            <div className='subtitle-2 text-light-100 mt-2 text-center'>
              Didn&apos;t get a code?
              <Button type='button' variant='link' className='text-brand pl-1' onClick={handleResendOtp}>
                Click to resend
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
