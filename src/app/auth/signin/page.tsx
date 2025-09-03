'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.replace('/');
    }
  }, [session, status, router]);

  const handleGoogleSignIn = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    setError(null);
    try {
      const result = await signIn('google', { redirect: false, callbackUrl: '/dashboard' });
      if (result?.error) {
        setError('Sign-in failed. Please try again.');
        setIsSigningIn(false);
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch {
      setError('Unexpected error occurred.');
      setIsSigningIn(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lavender-50">
        <p className="text-lavender-600 text-lg">Checking authentication...</p>
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lavender-50">
        <p className="text-lavender-600 text-lg">Already signed in, redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-lavender-50 select-none">
      <div className="bg-white rounded-xl p-8 shadow-md max-w-md w-full animate-fadeIn">
        <h2 className="text-3xl font-semibold mb-6 font-display text-lavender-700">
          Welcome Back
        </h2>
        <p className="mb-8 text-lavender-600 font-normal">
          Sign in to your Intelligent Task Planner account
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 rounded-md p-3 mb-6 animate-pulse" role="alert">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
          className="w-full bg-lavender-500 hover:bg-lavender-600 text-white font-semibold py-3 rounded-lg transition-colors duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSigningIn ? 'Signing In...' : 'Continue with Google'}
        </button>

        <p className="mt-6 text-center text-lavender-500 text-sm font-light">
          By signing in you agree to the Terms of Use and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
