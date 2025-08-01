import AuthForm from '@/components/auth-form';
import H1 from '@/components/h1';
import Link from 'next/link';

export default function Page() {
  return (
    <main>
      <H1 className="text-center mb-5">Log in</H1>

      <AuthForm />

      <p className="mt-6 text-sm text-zinc-500 text-center">
        No account yet?{' '}
        <Link className="font-medium" href="/signup">
          Sign up
        </Link>
      </p>
    </main>
  );
}
