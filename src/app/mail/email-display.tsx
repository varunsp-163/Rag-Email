'use client'

import useThreads from '@/hooks/use-threads'
import { cn } from '@/lib/utils'
import { RouterOutputs } from '@/trpc/react'
import { formatDistanceToNow } from 'date-fns'
import React from 'react'
import Avatar from "react-avatar"
import { Letter } from "react-letter"

type Props = {
    email: RouterOutputs['account']['getThreads'][0]['emails'][0] // type output of the procedures
}

const EmailDisplay = ({ email }: Props) => {
    // console.log(email)
    const { account } = useThreads()
    // console.log(account?.emailAddress)
    const isMe = account?.emailAddress === email.from.address // to have different ui for email from me and from others



    return (
        <div className={
            cn("border rounded-mb p-4 transition-all hover:translate-x-2 ", {
                'border-l-gray-900 border-l-4': isMe
            })
        }>
            <div className='flex items-center justify-between gap-2'>
                <div className='flex items-center justify-between gap-2'>
                    {!isMe && <Avatar name={email.from.name ?? email.from.address} email={email.from.address} size="35" round={true} />}
                    {isMe &&
                        <span className='font-medium'>
                            {isMe ? "Me" : email.from.address}
                        </span>}
                </div>
                <p className='text-xm text-muted-foreground'>
                    {formatDistanceToNow(email.sentAt ?? new Date(), {
                        addSuffix: true
                    })}
                </p>
            </div>
            <div className='h-4'></div>
            <Letter html={email?.body ?? ""} className='bg-white text-black rounded-md' />

        </div>
    )
}

export default EmailDisplay
