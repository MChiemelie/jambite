'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { z } from 'zod';
import { Button } from '@/components/shadcn/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/shadcn/form';
import { Input } from '@/components/shadcn/input';
import { createAccount, signInUser, signUpWithFacebook, signUpWithGoogle } from '@/services/auth';
import OtpModal from './otpmodal';

type AuthType = 'sign-in' | 'sign-up';

const authFormSchema = (authType: AuthType) => {
  return z.object({
    email: z.string().email(),
    fullname: authType === 'sign-up' ? z.string().min(2).max(50) : z.string().optional(),
  });
};

const AuthForm = ({ type }: { type: AuthType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setuserId] = useState(null);

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
              fullname: values.fullname || '',
              email: values.email,
            })
          : await signInUser({ email: values.email });

      setuserId(user.userId);
    } catch {
      setErrorMessage('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
                  <FormLabel className="shad-form-label">Email</FormLabel>

                  <FormControl>
                    <Input placeholder="Enter your email" className="shad-input" {...field} />
                  </FormControl>
                </div>

                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {type === 'sign-in' ? 'Sign In' : 'Sign Up'}

            {isLoading && <Image src="/loader.svg" alt="loader" width={24} height={24} className="ml-2 animate-spin" />}
          </Button>

          {errorMessage && <p className="error-message">*{errorMessage}</p>}

          <div className="body-2 flex justify-center">
            <p className="text-light-100 dark:text-light-300">{type === 'sign-in' ? "Don't have an account?" : 'Already have an account?'}</p>
            <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className="ml-1 font-medium text-blue-500">
              {' '}
              {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
            </Link>
          </div>
        </form>
      </Form>
      <div className="flex items-center">
        <div className="grow border border-gray-200 dark:border-gray-800 min-w-[90px]"></div>
        <span className="mx-2 text-xs">continue with </span>
        <div className="grow border border-gray-200 dark:border-gray-800 min-w-[90px]"></div>
      </div>

      <div className="sm:flex justify-evenly w-full p-4 gap-2 sm:gap-0">
        <form action={signUpWithGoogle}>
          <button className="rounded-md flex items-center justify-center p-2 shadow-lg mx-auto">
            <Image src="/images/socials/google.png" alt="Google" width={24} height={24} className="w-6 mr-2" />
            <span className="text-sm font-medium">Google</span>
          </button>
        </form>

        <form action={signUpWithFacebook}>
          <button className="rounded-md flex items-center justify-center p-2 shadow-lg mx-auto">
            <Image src="/images/socials/facebook.png" alt="Facebook" width={24} height={24} className="w-6 mr-2" />
            <span className="text-sm font-medium">Facebook</span>
          </button>
        </form>
      </div>
      {userId && <OtpModal email={form.getValues('email')} userId={userId} />}
    </>
  );
};

export default AuthForm;
