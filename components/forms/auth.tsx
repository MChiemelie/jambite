'use client';

import { useState } from 'react';
import { Button } from '@/components/shadcn/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/shadcn/form';
import { Input } from '@/components/shadcn/input';
import { createAccount, signInUser, signUpWithGoogle } from '@/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { OtpModal } from './';

type AuthType = 'sign-in' | 'sign-up';

const authFormSchema = (authType: AuthType) =>
  z.object({
    email: z.string().email(),
    fullname: authType === 'sign-up' ? z.string().min(2).max(50) : z.string().optional(),
  });

const AuthForm = ({ type }: { type: AuthType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: '',
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const user =
        type === 'sign-up'
          ? await createAccount({
              fullname: values.fullname ?? '',
              email: values.email,
            })
          : await signInUser({ email: values.email });
      setUserId(user?.userId ?? null);
    } catch (err: any) {
      setErrorMessage(err?.message ?? 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col gap-4 w-full items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">{type === 'sign-in' ? '🤗 Welcome Back!' : '🏆 Join The League'}</h1>

          {type === 'sign-up' && (
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" className="shad-input" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label" htmlFor="email">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input id="email" placeholder="Enter your email" className="shad-input" aria-describedby="email-message" {...field} />
                  </FormControl>
                </div>
                <FormMessage id="email-message" className="shad-form-message" />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
            {isLoading && <Image src="/assets/loader.svg" alt="Loading circle" width={24} height={24} className="ml-2 animate-spin" />}
          </Button>

          {errorMessage && (
            <p className="error-message text-red-500" role="alert" aria-live="assertive">
              *{errorMessage}
            </p>
          )}

          <div className="body-2 flex justify-center gap-2 text-xs">
            <p className="text-foreground/60">{type === 'sign-in' ? "Don't have an account?" : 'Already have an account?'}</p>
            <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className="font-medium text-brand">
              {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
            </Link>
          </div>
        </form>
      </Form>

      <div className="flex items-center mx-auto">
        <div className="flex-grow border border-foreground/20 min-w-10 max-w-20" />
        <span className="px-2 whitespace-nowrap text-xs text-foreground/80">continue with</span>
        <div className="flex-grow border border-foreground/20 min-w-10 max-w-20" />
      </div>

      <div className="flex flex-col xs:flex-row justify-evenly gap-2">
        <button
          type="button"
          onClick={async () => {
            try {
              await signUpWithGoogle();
            } catch (err) {
              console.error(err);
            }
          }}
          className="border border-foreground/20 rounded-lg w-full flex items-center justify-center p-2 shadow-lg mx-auto gap-2"
        >
          <Image src="/images/socials/google.png" alt="Login with Google Button" width={24} height={24} className="w-6" />
          <span className="text-sm font-medium">Google</span>
        </button>
      </div>

      {userId && <OtpModal email={form.getValues('email')} userId={userId} />}
    </main>
  );
};

export default AuthForm;
