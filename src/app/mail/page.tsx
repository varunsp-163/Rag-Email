'use client'
import ThemeToggle from '@/components/theme-toggle'
import { UserButton } from '@clerk/nextjs'
import dynamic from 'next/dynamic'
import React from 'react'
import ComposeButton from './compose-button'

const Mail = dynamic(() => {
    return import("./mail")
}, {
    ssr: false
})

const page = () => {
    return (
        <>
            <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-2">
                    <UserButton />
                    <ThemeToggle />
                    <ComposeButton />
                </div>

            </div>
            <Mail
                defaultLayout={[20, 32, 48]}
                defaultCollapse={false}
                navCollapsedSize={4}
            />
        </>
    )
}

export default page
