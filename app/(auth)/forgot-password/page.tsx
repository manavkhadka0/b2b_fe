import { Metadata } from 'next';
import { PasswordResetFlow } from '@/components/auth/PasswordResetFlow';

export const metadata: Metadata = {
  title: 'Forgot Password - CIM Platform',
  description: 'Reset your CIM platform account password using an email verification code.',
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <PasswordResetFlow />
    </main>
  );
}
