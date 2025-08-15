import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff, User, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

type LoginForm = {
    username: string;
    password: string;
    remember: boolean;
};

interface WelcomeProps {
    status?: string;
}

export default function Welcome({ status }: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;
    const [showPassword, setShowPassword] = useState(false);
    const [attemptCount, setAttemptCount] = useState(0);
    const [isTyping, setIsTyping] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<Required<LoginForm>>({
        username: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setAttemptCount(prev => prev + 1);

        post(route('login'), {
            onFinish: () => reset('password'),
            onError: () => {
                reset('password');
                setShowPassword(false);
            },
            onSuccess: () => {
                // Reset attempt count on success
                setAttemptCount(0);
            }
        });
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('username', e.target.value);
        setIsTyping(true);
        if (errors.username) {
            clearErrors('username');
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('password', e.target.value);
        setIsTyping(true);
        if (errors.password) {
            clearErrors('password');
        }
    };

    // Clear typing indicator after user stops typing
    useEffect(() => {
        const timer = setTimeout(() => setIsTyping(false), 1000);
        return () => clearTimeout(timer);
    }, [data.username, data.password]);

    const isFormValid = data.username.trim().length > 0 && data.password.length > 0;
    const hasErrors = Object.keys(errors).length > 0;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                <meta name="description" content={`Welcome to ${import.meta.env.VITE_APP_NAME}. Please log in to access your account.`} />
            </Head>

            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-[#FDFDFC] via-[#FAFAFA] to-[#F5F5F4] p-6 text-[#1b1b18] lg:justify-center lg:p-8">
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-2xl lg:flex-row">
                        {/* Login Form Section */}
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white/80 backdrop-blur-sm p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.12),0_4px_12px_rgba(0,0,0,0.05)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 transition-all duration-300 hover:shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16),0_8px_24px_rgba(0,0,0,0.08)]">

                            {/* Header */}
                            <div className="mb-8">
                                <h1 className="mb-3 text-3xl font-semibold text-[#1b1b18] lg:text-4xl">
                                    Welcome back
                                </h1>
                                <p className="text-base text-[#6b6b6b] lg:text-lg">
                                    Sign in to South Cotabato Rehabilitation and Detention Center.
                                </p>
                            </div>

                            {/* Status Messages */}
                            {status && (
                                <Alert className="mb-6 border-green-200 bg-green-50/80 backdrop-blur-sm">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800 font-medium">
                                        {status}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {attemptCount >= 2 && hasErrors && (
                                <Alert className="mb-6 border-amber-200 bg-amber-50/80 backdrop-blur-sm">
                                    <AlertCircle className="h-4 w-4 text-amber-600" />
                                    <AlertDescription className="text-amber-800">
                                        <strong>Having trouble?</strong> Double-check your credentials or try resetting your password.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Login Form */}
                            <form className="flex flex-col gap-6" onSubmit={submit} noValidate>
                                <div className="grid gap-6">

                                    {/* Username Field */}
                                    <div className="grid gap-3">
                                        <Label htmlFor="username" className="text-sm font-medium text-[#1b1b18]">
                                            Username
                                        </Label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b6b6b] transition-colors group-focus-within:text-[#1b1b18]" />
                                            <Input
                                                id="username"
                                                type="text"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="username"
                                                value={data.username}
                                                onChange={handleUsernameChange}
                                                placeholder="Enter your username"
                                                className={`pl-10 h-12 text-base transition-all duration-200 ${
                                                    errors.username
                                                        ? 'border-red-300 focus-visible:ring-red-200 bg-red-50/50'
                                                        : 'border-gray-200 focus-visible:ring-blue-200 hover:border-gray-300'
                                                } ${isTyping && !errors.username ? 'border-blue-300' : ''}`}
                                                aria-invalid={errors.username ? 'true' : 'false'}
                                                aria-describedby={errors.username ? 'username-error' : undefined}
                                            />
                                        </div>
                                        <InputError id="username-error" message={errors.username} />
                                    </div>

                                    {/* Password Field */}
                                    <div className="grid gap-3">
                                        <Label htmlFor="password" className="text-sm font-medium text-[#1b1b18]">
                                            Password
                                        </Label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b6b6b] transition-colors group-focus-within:text-[#1b1b18]" />
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                value={data.password}
                                                onChange={handlePasswordChange}
                                                placeholder="Enter your password"
                                                className={`pl-10 pr-12 h-12 text-base transition-all duration-200 ${
                                                    errors.password
                                                        ? 'border-red-300 focus-visible:ring-red-200 bg-red-50/50'
                                                        : 'border-gray-200 focus-visible:ring-blue-200 hover:border-gray-300'
                                                } ${isTyping && !errors.password ? 'border-blue-300' : ''}`}
                                                aria-invalid={errors.password ? 'true' : 'false'}
                                                aria-describedby={errors.password ? 'password-error' : undefined}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b] hover:text-[#1b1b18] focus:outline-none focus:text-[#1b1b18] transition-colors"
                                                tabIndex={-1}
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        <InputError id="password-error" message={errors.password} />
                                    </div>

                                    {/* Remember Me & Forgot Password */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                checked={data.remember}
                                                onCheckedChange={(checked) => setData('remember', !!checked)}
                                                tabIndex={3}
                                                className="data-[state=checked]:bg-[#1b1b18] data-[state=checked]:border-[#1b1b18]"
                                            />
                                            <Label htmlFor="remember" className="text-sm font-normal cursor-pointer text-[#1b1b18]">
                                                Remember me for 30 days
                                            </Label>
                                        </div>

                                        <Link
                                            href="/forgot-password"
                                            className="text-sm text-[#6b6b6b] hover:text-[#1b1b18] hover:underline transition-colors font-medium"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="mt-6 w-full h-12 bg-[#1b1b18] hover:bg-[#2d2d2a] text-white font-medium text-base transition-all duration-200 disabled:opacity-50"
                                        tabIndex={4}
                                        disabled={processing || !isFormValid}
                                    >
                                        {processing ? (
                                            <>
                                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                                Signing you in...
                                            </>
                                        ) : (
                                            'Sign in to your account'
                                        )}
                                    </Button>
                                </div>

                                {/* Additional Help */}
                                {/* <div className="mt-6 text-center">
                                    <p className="text-sm text-[#6b6b6b]">
                                        Need help? {' '}
                                        <Link
                                            href="/support"
                                            className="text-[#1b1b18] hover:underline font-medium transition-colors"
                                            tabIndex={6}
                                        >
                                            Contact support
                                        </Link>
                                    </p>
                                </div> */}
                            </form>
                        </div>

                        {/* Welcome Content Section (if you want to add it later) */}
                        {/* <div className="flex-1 bg-gradient-to-br from-[#1b1b18] to-[#2d2d2a] rounded-tr-lg rounded-tl-lg lg:rounded-bl-lg lg:rounded-tr-none p-8 lg:p-20 text-white hidden lg:flex flex-col justify-center">
                            <h2 className="text-4xl font-bold mb-6">Welcome to {import.meta.env.VITE_APP_NAME}</h2>
                            <p className="text-xl opacity-90 leading-relaxed">
                                Your journey continues here. Access your dashboard, manage your projects, and collaborate with your team.
                            </p>
                        </div> */}
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
