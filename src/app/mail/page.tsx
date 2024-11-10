
import ThemeToggle from '@/components/theme-toggle'
import dynamic from 'next/dynamic'
import React from 'react'

const Mail = dynamic(() => {
    return import("./mail")
}, {
    ssr: false
})

const page = () => {
    return (
        <>
            <div className="absolute bottom-4 left-4">
                <ThemeToggle />
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
