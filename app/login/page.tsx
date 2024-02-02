'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import type { Database } from '@/lib/database.types'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const supabase = createClientComponentClient<Database>()

    const handleSignUp = async () => {
        await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })
        router.refresh()
    }

    const handleSignIn = async () => {
        await supabase.auth.signInWithPassword({
            email,
            password,
        })
        router.refresh()
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <>
            <form action="/auth/login"
                method="post"
                className='flex flex-col max-w-xl mx-auto my-10 space-y-2 text-black'
            >
                <label htmlFor="email">Email</label>
                <input name="email" />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" />
                <Button>Sign In</Button>
                <Button formAction="/auth/sign-up">Sign Up</Button>
            </form>
        </>
    )
}