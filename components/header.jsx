import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { LayoutDashboard, PenBox } from 'lucide-react'
import { checkUser } from '@/lib/user'

const Header = async () => {
    const user = await checkUser();
    // console.log("user", user);

    return (
        <div className='fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b'>
            <nav className='container mx-auto px-4 py-4 flex item-center justify-between'>
                <Link href="/">
                <h1 className='text-2xl md:text-3xl lg:text-[50px] pb-6 gradient-header'>
                   Wealthy Pandaa.
                </h1>
                
                </Link>

                <div className='flex items-center space-x-4 '>
                    <SignedIn>
                        <Link href={"/dashboard"} className='text-grey-600 hover:text-blue-600
                    flex items-center gap-2
                    '>
                            <Button variant="outline">
                                <LayoutDashboard size={18} />
                                <span className='hidden md:inline'>Dashboard</span>
                            </Button>
                        </Link>
                        <Link href={"/transaction/create"}>
                            <Button className={"flex items-center gap-2"}>
                                <PenBox size={18} />
                                <span className='hidden md:inline'>Transaction</span>
                            </Button>
                        </Link>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton forceRedirectUrl="/dashboard">
                            <Button className="" variant="outline">
                                Login
                            </Button>
                        </SignInButton>
                        {/* <SignUpButton>

                </SignUpButton> */}
                    </SignedOut>
                    <SignedIn>
                        <UserButton appearance={{
                            elements: {
                                avatarBox: "w-10 h-10",
                            }
                        }} />
                    </SignedIn>
                </div>
            </nav>
        </div>
    )
}

export default Header
