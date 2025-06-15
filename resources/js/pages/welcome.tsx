import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { Alert } from '@/components/ui/alert';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import Swal from 'sweetalert2';
type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};


interface WelcomeProps {
    status?: string;
}

export default function Welcome({ status }: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;

    const {data, setData, post, processing, errors, reset} = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Welcome!',
            text: 'This is a placeholder for the login functionality.',
            icon: 'info',
            confirmButtonText: 'OK',
        });
        // TODO: Implement login functionality here.
        // post(route('login'), {
        //     onFinish: () => reset('password'),
        // });
    };

    return (
        <>



            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                {/* <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a]"
                                >
                                    Register
                                </Link> */}
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-2xl lg:flex-row">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20">
                            <h1 className="mb-4 text-2xl font-semibold">Login to {import.meta.env.VITE_APP_NAME}</h1>
                            <p className="mb-6">Please enter your credentials to log in.</p>

                            <form onSubmit={submit}>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" required autoFocus className="mb-4" />
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" required className="mb-6" />

                                <div className="mb-4 flex items-center justify-between">
                                    <Label htmlFor="remember" className="flex items-center gap-2">
                                        <Input id="remember" name="remember" type="checkbox" className="h-4 w-4" />
                                        Remember me
                                    </Label>
                                    <Link href="forgot-password" className="text-sm text-[#1b1b18] hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>

                                <Button type="submit" className="w-full" >
                                    Log in
                                </Button>



                            </form>
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
