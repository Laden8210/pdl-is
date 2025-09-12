import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle, LoaderCircle, User, Phone } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface ForgotPasswordProps {
  status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
  const [hasBeenSent, setHasBeenSent] = useState(false);

  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    usernameOrPhone: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('password.request'), {
      onSuccess: () => {
        setHasBeenSent(true);
        reset();
      },
    });
  };

  const handleUsernameOrPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData('usernameOrPhone', e.target.value);
    if (errors.usernameOrPhone) {
      clearErrors('usernameOrPhone');
    }
  };

  const isFormValid = data.usernameOrPhone.trim().length > 0;



  return (
    <>
      <Head title="Forgot Password">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        <meta name="description" content={`Reset your password for ${import.meta.env.VITE_APP_NAME}.`} />
      </Head>

      <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-[#FDFDFC] via-[#FAFAFA] to-[#F5F5F4] p-6 text-[#1b1b18] lg:justify-center lg:p-8">
        <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
          <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-2xl lg:flex-row">
            {/* Forgot Password Form Section */}
            <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white/80 p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.12),0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16),0_8px_24px_rgba(0,0,0,0.08)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20">
              {/* Header */}
              <div className="mb-8 flex flex-col items-center">
                <div className="mb-6 flex items-center gap-6">
                  <img src="/PGO.jpg" alt="Logo 1" className="h-20 w-auto rounded-full p-1" />
                  <img src="/scrdc.jpg" alt="Logo 2" className="h-20 w-auto rounded-full p-1" />
                </div>
                <h1 className="mb-3 text-3xl font-semibold text-[#1b1b18] lg:text-4xl">Reset Password</h1>
                <p className="text-center text-base text-[#6b6b6b] lg:text-lg">
                  Enter your username or phone number to request a password reset from the admin.
                </p>
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
                        <AlertTitle>Unable to process request</AlertTitle>
                        <AlertDescription>
                            {Object.values(errors).map((error, index) => (
                                <ul className="list-inside list-disc text-sm" key={index}>
                                    <li>{error}</li>
                                </ul>
                            ))}
                        </AlertDescription>
                    </Alert>
                )}


              {hasBeenSent && (
                <Alert className="mb-6 border-green-200 bg-green-50/80 backdrop-blur-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="font-medium text-green-800">
                    If an account with that username or phone number exists, a password reset request has been sent to the admin.
                  </AlertDescription>
                </Alert>
              )}

              {errors.usernameOrPhone && !hasBeenSent && (
                <Alert className="mb-6 border-red-200 bg-red-50/80 backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="font-medium text-red-800">
                    {errors.usernameOrPhone}
                  </AlertDescription>
                </Alert>
              )}

              {/* Forgot Password Form */}
              <form className="flex flex-col gap-6" onSubmit={submit} noValidate>
                <div className="grid gap-6">
                  {/* Username or Phone Number Field */}
                  <div className="grid gap-3">
                    <Label htmlFor="usernameOrPhone" className="text-sm font-medium text-[#1b1b18]">
                      Username or Phone Number
                    </Label>
                    <div className="group relative">
                      <div className="absolute top-1/2 left-3 flex -translate-y-1/2 items-center text-[#6b6b6b] transition-colors group-focus-within:text-[#1b1b18]">
                        <User className="h-4 w-4" />

                      </div>
                      <Input
                        id="usernameOrPhone"
                        type="text"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="username"
                        value={data.usernameOrPhone}
                        onChange={handleUsernameOrPhoneChange}
                        placeholder="Enter your username or phone number"
                        className={`h-12 pl-10 text-base transition-all duration-200 ${
                          errors.usernameOrPhone
                            ? 'border-red-300 bg-red-50/50 focus-visible:ring-red-200'
                            : 'border-gray-200 hover:border-gray-300 focus-visible:ring-blue-200'
                        }`}
                        aria-invalid={errors.usernameOrPhone ? 'true' : 'false'}
                        aria-describedby={errors.usernameOrPhone ? 'usernameOrPhone-error' : undefined}
                        disabled={hasBeenSent || processing}
                      />
                    </div>
                    <InputError id="usernameOrPhone-error" message={errors.usernameOrPhone} />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="mt-6 h-12 w-full bg-[#1b1b18] text-base font-medium text-white transition-all duration-200 hover:bg-[#2d2d2a] disabled:opacity-50"
                    tabIndex={2}
                    disabled={processing || !isFormValid || hasBeenSent}
                  >
                    {processing ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Sending request to admin...
                      </>
                    ) : hasBeenSent ? (
                      'Reset Request Sent'
                    ) : (
                      'Request Password Reset'
                    )}
                  </Button>

                  {/* Back to Login Link */}
                  <div className="text-center">
                    <Link
                      href="/login"
                      className="text-sm font-medium text-[#6b6b6b] transition-colors hover:text-[#1b1b18] hover:underline"
                      tabIndex={3}
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
