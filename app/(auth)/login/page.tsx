'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <Card className="border-0 shadow-xl shadow-black/5 bg-white/80 backdrop-blur-sm">
      <CardContent className="pt-6 pb-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-1">Sign in to continue tracking</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email address"
                className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                {...form.register('email')}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-sm text-destructive pl-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                {...form.register('password')}
              />
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-destructive pl-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive text-center">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-[#6BBF4E] to-[#3D6F2B] hover:from-[#5AAD3D] hover:to-[#3D6F2B] text-white shadow-lg shadow-[#6BBF4E]/25 transition-all duration-200 hover:shadow-xl hover:shadow-[#6BBF4E]/30"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign In
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-medium text-[#6BBF4E] hover:text-[#3D6F2B] transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
