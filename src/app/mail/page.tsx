
import dynamic from 'next/dynamic'
import React from 'react'

const Mail = dynamic(() => {
    return import("./mail")
}, {
    ssr: false
})

const page = () => {
    return (
        <div>
            <Mail
                defaultLayout={[20, 32, 48]}
                defaultCollapse={false}
                navCollapsedSize={4}
            />
        </div>
    )
}

export default page
