"use server"
import { auth } from '@clerk/nextjs/server'
import axios from 'axios'
import { getSubscriptionStatus } from './stripe-actions'
import { db } from '@/server/db'
import { FREE_ACCOUNTS_PER_USER, PRO_ACCOUNTS_PER_USER } from '@/app/constants'

export const getAurinkoAuthUrl = async (serviceType: 'Google' | 'Office365') => {
    const { userId } = await auth()
    console.log("The user loggedIn is;", userId)
    if (!user) throw new Error('User not found')

    const isSubscribed = await getSubscriptionStatus()

    const accounts = await db.account.count({
        where: { userId }
    })

    if (isSubscribed) {
        if (accounts >= PRO_ACCOUNTS_PER_USER) {
            throw new Error('You have reached the maximum number of accounts for your subscription')
        }
    } else {
        if (accounts >= FREE_ACCOUNTS_PER_USER) {
            throw new Error('You have reached the maximum number of accounts for your subscription')
        }
    }


    const params = new URLSearchParams({
        clientId: process.env.AURIKO_CLIENT_ID as string,
        serviceType,
        scopes: "Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All",
        responseType: "code",
        returnUrl: `${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`
    })

    return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`

}

export const exchangeCodeForAccessToken = async (code: string) => {
    try {
        const res = await axios.post(`https://api.aurinko.io/v1/auth/token/${code}`, {}, {
            auth: {
                username: process.env.AURIKO_CLIENT_ID as string,
                password: process.env.AURIKO_CLIENT_SECRET as string
            }
        })
        return res.data as {
            accoundId: number, accessToken: string, userId: string, userSession: string
        }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            console.error(err.response?.data)
        }
        console.log("Error in exchange", err)
    }
}

export const getAccountDetails = async (accessToken: string) => {
    try {
        const response = await axios.get('https://api.aurinko.io/v1/account', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data as {
            email: string,
            name: string
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching account details:', error.response?.data);
        } else {
            console.error('Unexpected error fetching account details:', error);
        }
        throw error;
    }
}

