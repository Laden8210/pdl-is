import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [attemptCount, setAttemptCount] = useState(0);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setAttemptCount(prev => prev + 1);

        post(route('login'), {
            onFinish: () => reset('password'),
            onError: () => {
                // Reset password field on error
                reset('password');
            }
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('email', e.target.value);
        // Clear email errors when user starts typing
        if (errors.email) {
            clearErrors('email');
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('password', e.target.value);
        // Clear password errors when user starts typing
        if (errors.password) {
            clearErrors('password');
        }
    };

    const isFormValid = data.email.length > 0 && data.password.length > 0;

    return (
        <AuthLayout title="Welcome back" description="Sign in to your account to continue">
            <Head title="Log in" />

            {status && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">
                        {status}
                    </AlertDescription>
                </Alert>
            )}

            {attemptCount >= 3 && (Object.keys(errors).length > 0) && (
                <Alert className="mb-6 border-amber-200 bg-amber-50">
                    <AlertDescription className="text-amber-800">
                        Having trouble logging in? Make sure your email and password are correct, or try resetting your password.
                    </AlertDescription>
                </Alert>
            )}

            <form className="flex flex-col gap-6" onSubmit={submit} noValidate>
                <div className="grid gap-6">
                    {/* Email Field */}
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email address
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={handleEmailChange}
                                placeholder="Enter your email"
                                className={`pl-10 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                aria-invalid={errors.email ? 'true' : 'false'}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                            />
                        </div>
                        <InputError id="email-error" message={errors.email} />
                    </div>

                    {/* Password Field */}
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Password
                            </Label>
                            {canResetPassword && (
                                <TextLink
                                    href={route('password.request')}
                                    className="text-sm hover:underline"
                                    tabIndex={5}
                                >
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={handlePasswordChange}
                                placeholder="Enter your password"
                                className={`pl-10 pr-10 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                aria-invalid={errors.password ? 'true' : 'false'}
                                aria-describedby={errors.password ? 'password-error' : undefined}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
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

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', !!checked)}
                            tabIndex={3}
                        />
                        <Label
                            htmlFor="remember"
                            className="text-sm font-normal cursor-pointer"
                        >
                            Remember me for 30 days
                        </Label>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="mt-4 w-full"
                        tabIndex={4}
                        disabled={processing || !isFormValid}
                        size="lg"
                    >
                        {processing ? (
                            <>
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Sign in'
                        )}
                    </Button>
                </div>

                {/* Sign up link - uncommented and improved */}
                <div className="text-center">
                    <span className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <TextLink
                            href={route('register')}
                            tabIndex={6}
                            className="font-medium hover:underline"
                        >
                            Create account
                        </TextLink>
                    </span>
                </div>
            </form>
        </AuthLayout>
    );
}
