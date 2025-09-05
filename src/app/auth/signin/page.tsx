'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Loader2,
  Shield
} from 'lucide-react';
import { GoogleLogo } from '@phosphor-icons/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.replace('/dashboard');
    }
  }, [session, status, router]);

  const handleGoogleSignIn = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    setError(null);
    try {
      const result = await signIn('google', { 
        redirect: false, 
        callbackUrl: '/dashboard' 
      });
      if (result?.error) {
        setError('Sign-in failed. Please try again.');
        setIsSigningIn(false);
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setIsSigningIn(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent-50/20 to-background dark:from-background dark:via-accent-950/10 dark:to-background flex items-center justify-center">
        <LoadingSpinner className="w-12 h-12 text-accent-600 dark:text-accent-400" />
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent-50/20 to-background dark:from-background dark:via-accent-950/10 dark:to-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner className="w-8 h-8 text-accent-600 dark:text-accent-400 mx-auto" />
          <p className="text-lg text-muted-foreground dark:text-slate-400">
            Already signed in, redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent-50/20 to-background dark:from-background dark:via-accent-950/10 dark:to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 backdrop-blur-sm border-border/50 dark:border-white/10">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-muted-foreground dark:text-slate-400">
              Sign in to your Intelligent Task Planner account
            </p>
          </div>

          {error && (
            <motion.div 
              className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive dark:text-destructive/90"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full relative group hover:border-accent-500/50 dark:hover:border-accent-400/50"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
            >
              <div className="absolute left-4">
                <GoogleLogo className="w-5 h-5" />
              </div>
              {isSigningIn ? (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Signing in...
                </div>
              ) : (
                <span>Continue with Google</span>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border dark:border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background dark:bg-background/95 px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="space-y-2 text-center">
              <p className="text-sm text-muted-foreground dark:text-slate-400">
                Don't have an account?
              </p>
              <Button 
                variant="accent"
                size="lg"
                className="w-full group"
                asChild
              >
                <Link href="/signup">
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/50 dark:border-white/10 text-center">
            <p className="text-xs text-muted-foreground dark:text-slate-400 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              By signing in you agree to our Terms and Privacy Policy
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
