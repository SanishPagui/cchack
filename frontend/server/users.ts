"use server";
import { success } from "zod";
import { auth } from "../lib/auth"
 
export const signIn = async (email: string, password:string) => {
    try{
        await auth.api.signInEmail({
            body: {
                email,
                password,
            }
        })

        return {
            success: true,
            message: "Sign in successful",
        }
    }catch (error) {
        const e = error as Error;
        return {
            success: false,
            message: "Sign in failed",
            error: error instanceof Error ? e.message : "Unknown error",
        }
    }
}



export const signUp = async (email: string, password:string) => {
    await auth.api.signUpEmail({
        body: {
            email,
            password,
            name: "User Name",
        }


    })
}
