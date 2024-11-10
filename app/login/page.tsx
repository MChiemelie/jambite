import React from 'react';
import { AuthForm } from '@/layout';
import Image from 'next/image';
import { login, signup } from './actions';

export default function SignIn() {
  return (
    <div className="max-w-lg mx-4 sm:mx-auto my-12 py-16 px-8 bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 p-6">
      <Image src="/logo.png" alt="Jambite Logo" width={100} height={100} className="mx-auto rounded-sm my-4" />
      <h1 className="text-2xl text-center font-semibold my-2">Login Into Your Account</h1>
      <form>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <button formAction={login}>Log in</button>
        <button formAction={signup}>Sign up</button>
      </form>
      <AuthForm />
    </div>
  );
}
