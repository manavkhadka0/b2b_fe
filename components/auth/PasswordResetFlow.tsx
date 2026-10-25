'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useRequestResetCode,
  useResendResetCode,
  useConfirmResetPassword,
} from '@/hooks/usePasswordReset';

type Step = 'REQUEST' | 'CONFIRM' | 'SUCCESS';

export const PasswordResetFlow: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<Step>('REQUEST');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Resend cooldown timer (60 seconds)
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const requestMutation = useRequestResetCode();
  const resendMutation = useResendResetCode();
  const confirmMutation = useConfirmResetPassword();

  // Step 1: Submit Email
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    requestMutation.mutate(
      { email: email.trim() },
      {
        onSuccess: () => {
          setStep('CONFIRM');
          setCountdown(60);
        },
        onError: (err) => {
          const detail =
            err.response?.data?.detail ||
            err.response?.data?.email?.[0] ||
            'Failed to send verification code. Please check your email.';
          setErrorMessage(detail);
        },
      }
    );
  };

  // Resend Code
  const handleResendCode = () => {
    if (countdown > 0 || resendMutation.isPending) return;
    setErrorMessage(null);

    resendMutation.mutate(
      { email: email.trim() },
      {
        onSuccess: () => {
          setCountdown(60);
        },
        onError: (err) => {
          const detail =
            err.response?.data?.detail ||
            err.response?.data?.email?.[0] ||
            'Failed to resend code. Please try again.';
          setErrorMessage(detail);
        },
      }
    );
  };

  // Step 2: Submit Code + New Password
  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (code.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    confirmMutation.mutate(
      {
        email: email.trim(),
        code: code.trim(),
        new_password: newPassword,
      },
      {
        onSuccess: () => {
          setStep('SUCCESS');
        },
        onError: (err) => {
          const detail =
            err.response?.data?.detail ||
            err.response?.data?.code?.[0] ||
            err.response?.data?.new_password?.[0] ||
            'Failed to reset password. Please verify the code and try again.';
          setErrorMessage(detail);
        },
      }
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-slate-100">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {step === 'SUCCESS'
            ? 'Password Reset Complete'
            : step === 'CONFIRM'
            ? 'Verify Code & Set Password'
            : 'Reset Your Password'}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {step === 'REQUEST' && 'Enter your email to receive a 6-digit verification code.'}
          {step === 'CONFIRM' && `We sent a 6-digit code to ${email}`}
          {step === 'SUCCESS' && 'Your password has been successfully updated.'}
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Step 1: Request Code */}
      {step === 'REQUEST' && (
        <form onSubmit={handleRequestCode} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={requestMutation.isPending}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {requestMutation.isPending ? 'Sending code...' : 'Send Verification Code'}
          </button>
        </form>
      )}

      {/* Step 2: Confirm Code + Password */}
      {step === 'CONFIRM' && (
        <form onSubmit={handleConfirmReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              6-Digit Verification Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="w-full tracking-widest text-center text-xl font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Didn't receive code?</span>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={countdown > 0 || resendMutation.isPending}
              className="text-blue-600 hover:text-blue-700 font-semibold disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Code'}
            </button>
          </div>

          <button
            type="submit"
            disabled={confirmMutation.isPending}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {confirmMutation.isPending ? 'Resetting password...' : 'Reset Password'}
          </button>

          <button
            type="button"
            onClick={() => setStep('REQUEST')}
            className="w-full text-center text-sm text-slate-500 hover:text-slate-700 py-1"
          >
            Back to email entry
          </button>
        </form>
      )}

      {/* Step 3: Success Confirmation */}
      {step === 'SUCCESS' && (
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            ✓
          </div>
          <p className="text-slate-600 text-sm">
            You can now sign in with your new password.
          </p>
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            Go to Login
          </button>
        </div>
      )}

      {/* Footer Back Link */}
      {step !== 'SUCCESS' && (
        <div className="text-center mt-6 text-sm text-slate-500">
          Remember your password?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
};
