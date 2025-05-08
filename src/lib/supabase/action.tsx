'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/app/routes'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const Userdata = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { data, error } = await supabase.auth.signInWithPassword(Userdata)

    if (error) {
        return { error: { message: error.message } };
    }

    return { data };
}


export async function signInWithEmail(email: string) {
    const supabase = await createClient()
    
    const response = await supabase.auth.signUp({
        email: email,
        password: Math.random + "",
        options: {
            // set this to false if you do not want the user to be automatically signed up

            emailRedirectTo: "https://jazzy-platypus-aa6485.netlify.app/auth/register",
        },
    })

    return response;
}


export async function signOut() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
}

export async function newsLetterSignUp(array: any) {
    const supabase = await createClient()
    const response = await supabase.from('news_letters').insert(
        array
    );
    return response;
}


export async function userMetaInsert(array: any) {
    const supabase = await createClient()
    const response = await supabase.from('user_meta').insert(
        array
    );
    return response;
}
export async function updateUserPassword(password: string) {
    const supabase = await createClient()
    const response = await supabase.auth.updateUser({
        password: password,
    })
    return response;
}

export async function userMetaSelect(userId: string) {
    const supabase = await createClient()
    const response = await supabase.from('user_meta').select('*').eq('user_id', userId).single();
    return response;
}


export async function signup(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}