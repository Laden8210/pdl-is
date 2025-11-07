import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { CheckCircle, LoaderCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface ResetPasswordProps {
  personnel_id: string;
  token: string;
  email: string;
  status?: string;
}

export default function ResetPassword({ personnel_id, token, email, status }: ResetPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    token: token,
    personnel_id: personnel_id,
    password: '',
    password_confirmation: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('password.reset'));
  };

  const isFormValid = data.password.length >= 8 && data.password === data.password_confirmation;

  return (
    <>
      <Head title="Reset Password">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        <meta name="description" content="Reset your password." />
      </Head>

      <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-[#FDFDFC] via-[#FAFAFA] to-[#F5F5F4] p-6 text-[#1b1b18] lg:justify-center lg:p-8">
        <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
          <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-2xl lg:flex-row">
            <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white/80 p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.12),0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16),0_8px_24px_rgba(0,0,0,0.08)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20">
              {/* Header */}
              <div className="mb-8 flex flex-col items-center">
                <div className="mb-6 flex items-center gap-6">
                  <img src="/PGO.jpg" alt="Logo 1" className="h-20 w-auto rounded-full p-1" />
                  <img src="/SCRDC.jpg" alt="Logo 2" className="h-20 w-auto rounded-full p-1" />
                </div>
                <h1 className="mb-3 text-3xl font-semibold text-[#1b1b18] lg:text-4xl">Reset Password</h1>
                <p className="text-center text-base text-[#6b6b6b] lg:text-lg">
                  Create a new password for your account
                </p>
                {email && (
                  <p className="text-sm text-[#6b6b6b] mt-2">
                    Account: {email}
                  </p>
                )}
              </div>

              {/* Status Messages */}
              {status && (
                <Alert className="mb-6 border-green-200 bg-green-50/80 backdrop-blur-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="font-medium text-green-800">{status}</AlertDescription>
                </Alert>
              )}

              {Object.keys(errors).length > 0 && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Unable to reset password</AlertTitle>
                  <AlertDescription>
                    {Object.values(errors).map((error, index) => (
                      <ul className="list-inside list-disc text-sm" key={index}>
                        <li>{error}</li>
                      </ul>
                    ))}
                  </AlertDescription>
                </Alert>
              )}

              {/* Reset Password Form */}
              <form className="flex flex-col gap-6" onSubmit={submit} noValidate>
                <div className="grid gap-6">
                  {/* Password Field */}
                  <div className="grid gap-3">
                    <Label htmlFor="password" className="text-sm font-medium text-[#1b1b18]">
                      New Password
                    </Label>
                    <div className="group relative">
                      <div className="absolute top-1/2 left-3 flex -translate-y-1/2 items-center text-[#6b6b6b] transition-colors group-focus-within:text-[#1b1b18]">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="new-password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Enter new password (min. 8 characters)"
                        className="h-12 pl-10 pr-10 text-base transition-all duration-200 border-gray-200 hover:border-gray-300 focus-visible:ring-blue-200"
                      />
                      <button
                        type="button"
                        className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center text-[#6b6b6b] hover:text-[#1b1b18]"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <InputError message={errors.password} />
                  </div>

                  {/* Confirm Password Field */}
                  <div className="grid gap-3">
                    <Label htmlFor="password_confirmation" className="text-sm font-medium text-[#1b1b18]">
                      Confirm New Password
                    </Label>
                    <div className="group relative">
                      <div className="absolute top-1/2 left-3 flex -translate-y-1/2 items-center text-[#6b6b6b] transition-colors group-focus-within:text-[#1b1b18]">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        id="password_confirmation"
                        type={showPasswordConfirmation ? 'text' : 'password'}
                        required
                        tabIndex={2}
                        autoComplete="new-password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Confirm your new password"
                        className="h-12 pl-10 pr-10 text-base transition-all duration-200 border-gray-200 hover:border-gray-300 focus-visible:ring-blue-200"
                      />
                      <button
                        type="button"
                        className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center text-[#6b6b6b] hover:text-[#1b1b18]"
                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                      >
                        {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <InputError message={errors.password_confirmation} />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="mt-4 h-12 w-full bg-[#1b1b18] text-base font-medium text-white transition-all duration-200 hover:bg-[#2d2d2a] disabled:opacity-50"
                    tabIndex={3}
                    disabled={processing || !isFormValid}
                  >
                    {processing ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>

                  {/* Back to Login Link */}
                  <div className="text-center">
                    <Link
                      href="/login"
                      className="text-sm font-medium text-[#6b6b6b] transition-colors hover:text-[#1b1b18] hover:underline"
                      tabIndex={4}
                    >
                      ← Back to login
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </main>
        </div>
        <div className="hidden h-14.5 lg:block"></div>
      </div>
    </>
  );
}
