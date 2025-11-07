import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { AlertCircle, CheckCircle, LoaderCircle, Smartphone, ArrowLeft } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

interface OtpVerificationProps {
  personnel_id: string;
  phone_number: string;
  message?: string;
}

export default function OtpVerification({ personnel_id, phone_number, message }: OtpVerificationProps) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  const { data, setData, post, processing, errors, clearErrors } = useForm({
    otp_code: '',
    personnel_id: personnel_id,
  });

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendEnabled(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('verify.otp'));
  };

  const handleResendOtp = () => {
    router.post(route('resend.otp'), { personnel_id }, {
      onSuccess: () => {
        setTimeLeft(600);
        setIsResendEnabled(false);
        clearErrors();
      }
    });
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setData('otp_code', value);
    if (errors.otp_code) {
      clearErrors('otp_code');
    }
  };

  const isFormValid = data.otp_code.length === 6;

  return (
    <>
      <Head title="OTP Verification">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        <meta name="description" content="Verify your OTP code for password reset." />
      </Head>

      <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-[#FDFDFC] via-[#FAFAFA] to-[#F5F5F4] p-6 text-[#1b1b18] lg:justify-center lg:p-8">
        <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
          <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-2xl lg:flex-row">
            {/* OTP Verification Form Section */}
            <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white/80 p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.12),0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16),0_8px_24px_rgba(0,0,0,0.08)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20">
              {/* Header */}
              <div className="mb-8 flex flex-col items-center">
                <div className="mb-6 flex items-center gap-6">
                  <img src="/PGO.jpg" alt="Logo 1" className="h-20 w-auto rounded-full p-1" />
                  <img src="/SCRDC.jpg" alt="Logo 2" className="h-20 w-auto rounded-full p-1" />
                </div>
                <h1 className="mb-3 text-3xl font-semibold text-[#1b1b18] lg:text-4xl">OTP Verification</h1>
                <p className="text-center text-base text-[#6b6b6b] lg:text-lg">
                  Enter the 6-digit OTP sent to your phone number ending with <strong>{phone_number}</strong>
                </p>
              </div>

              {/* Status Messages */}
              {message && (
                <Alert className="mb-6 border-green-200 bg-green-50/80 backdrop-blur-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="font-medium text-green-800">{message}</AlertDescription>
                </Alert>
              )}

              {errors.otp_code && (
                <Alert className="mb-6 border-red-200 bg-red-50/80 backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="font-medium text-red-800">
                    {errors.otp_code}
                  </AlertDescription>
                </Alert>
              )}

              {Object.keys(errors).filter(key => key !== 'otp_code').length > 0 && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Unable to process request</AlertTitle>
                  <AlertDescription>
                    {Object.entries(errors)
                      .filter(([key]) => key !== 'otp_code')
                      .map(([_, error], index) => (
                        <ul className="list-inside list-disc text-sm" key={index}>
                          <li>{error}</li>
                        </ul>
                      ))}
                  </AlertDescription>
                </Alert>
              )}

              {/* OTP Verification Form */}
              <form className="flex flex-col gap-6" onSubmit={submit} noValidate>
                <div className="grid gap-6">
                  {/* OTP Code Field */}
                  <div className="grid gap-3">
                    <Label htmlFor="otp_code" className="text-sm font-medium text-[#1b1b18]">
                      OTP Code
                    </Label>
                    <div className="group relative">
                      <div className="absolute top-1/2 left-3 flex -translate-y-1/2 items-center text-[#6b6b6b] transition-colors group-focus-within:text-[#1b1b18]">
                        <Smartphone className="h-4 w-4" />
                      </div>
                      <Input
                        id="otp_code"
                        type="text"
                        required
                        autoFocus
                        tabIndex={1}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="one-time-code"
                        value={data.otp_code}
                        onChange={handleOtpChange}
                        placeholder="Enter 6-digit OTP"
                        className={`h-12 pl-10 text-base text-center tracking-widest transition-all duration-200 ${
                          errors.otp_code
                            ? 'border-red-300 bg-red-50/50 focus-visible:ring-red-200'
                            : 'border-gray-200 hover:border-gray-300 focus-visible:ring-blue-200'
                        }`}
                        aria-invalid={errors.otp_code ? 'true' : 'false'}
                        aria-describedby={errors.otp_code ? 'otp_code-error' : undefined}
                        disabled={processing}
                      />
                    </div>
                  </div>

                  {/* Timer and Resend Section */}
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="text-sm text-[#6b6b6b]">
                      Time remaining: <span className="font-semibold text-[#1b1b18]">{formatTime(timeLeft)}</span>
                    </div>
                    {isResendEnabled && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleResendOtp}
                        className="text-sm font-medium text-[#6b6b6b] hover:text-[#1b1b18]"
                        disabled={processing}
                      >
                        Resend OTP
                      </Button>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="mt-4 h-12 w-full bg-[#1b1b18] text-base font-medium text-white transition-all duration-200 hover:bg-[#2d2d2a] disabled:opacity-50"
                    tabIndex={2}
                    disabled={processing || !isFormValid}
                  >
                    {processing ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Verifying OTP...
                      </>
                    ) : (
                      'Verify OTP'
                    )}
                  </Button>

                  {/* Back to Forgot Password Link */}
                  <div className="text-center">
                    <Link
                      href="/forgot-password"
                      className="inline-flex items-center text-sm font-medium text-[#6b6b6b] transition-colors hover:text-[#1b1b18] hover:underline"
                      tabIndex={3}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to reset request
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
