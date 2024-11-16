import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import ThemeToggle from '@/components/theme-toggle'

const LandingPage = async () => {
  const { userId } = auth()
  if (userId) {
    return redirect('/mail')
  }
  return (
    <>
      {/* <div className="h-screen w-full bg-white absolute inset-0">
            </div> */}
      <div className="absolute z-[-1] bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_80%)]">
      </div>
      <div className="min-h-screen flex flex-col items-center pt-56 relative z-[10]">
        <h1 className="bg-gradient-to-r text-center from-gray-600 font-bold text-6xl to-gray-900 inline-block text-transparent bg-clip-text">
          The minimalistic, <br />AI-powered email client.
        </h1>
        <div className="h-4"></div>
        <p className="text-xl mb-8 text-gray-600 max-w-xl text-center">
          Normal Human is a minimalistic, AI-powered email client that empowers you to manage your email with ease.
        </p>
        <div className="space-x-4">
          <Button>
            <Link href="/mail">Get Started</Link>
          </Button>

          <Button variant="outline" >Learn More</Button>

        </div>
        <div className="mt-12 max-w-5xl mx-auto mb-2">
          <h2 className="text-2xl font-semibold mb-4 text-center">Experience the power of:</h2>
          <div className="flex gap-8">
            <div className="bg-white border rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">AI-driven email RAG</h3>
              <p className="text-gray-600">Automatically prioritize your emails with our advanced AI system.</p>
              <h6 className='text-sm'>* Coming Soon</h6>
            </div>
            <div className="bg-white border rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Full-text search</h3>
              <p className="text-gray-600">Quickly find any email with our powerful search functionality.</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4 mb-10">
          <Link href="/sign-in" className="text-sm hover:underline">Sign In</Link>
          <Link href="/sign-up" className="text-sm hover:underline">Sign Up</Link>
          <ThemeToggle />
        </div>
      </div>
    </>
  )
}

export default LandingPage