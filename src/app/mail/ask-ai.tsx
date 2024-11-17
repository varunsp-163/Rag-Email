'use client'

import React, { useEffect } from 'react'
import { useChat } from 'ai/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLocalStorage } from 'usehooks-ts'
import { cn } from '@/lib/utils'
import { SparklesIcon } from '@heroicons/react/24/solid'
import { Send } from 'lucide-react'
import { toast } from 'sonner'
import PremiumBanner from './premium-banner'

const transitionDebug = {
    type: 'easeOut',
    duration: 0.2,
}

const AskAI = ({ isCollapsed }: { isCollapsed: boolean }) => {
    const [accountId] = useLocalStorage('accountId', '')
    const { input, handleInputChange, handleSubmit, messages } = useChat({
        api: '/api/chat',
        body: { accountId },
        onError: (error) => {
            if (error.message.includes('Limit reached')) {
                toast.error('You have reached the limit for today. Upgrade to pro for unlimited questions.')
            }
        },
        initialMessages: [],
    })

    useEffect(() => {
        if (messages?.length) {
            const messageContainer = document.getElementById('message-container')
            messageContainer?.scrollTo({
                top: messageContainer.scrollHeight,
                behavior: 'smooth',
            })
        }
    }, [messages])

    if (isCollapsed) return null

    const handlePresetQuestion = (question: string) => {
        handleInputChange({ target: { value: question } } as React.ChangeEvent<HTMLInputElement>)
    }

    return (
        <div className='p-4 mb-14'>
            <PremiumBanner />
            <div className='h-4'></div>
            <motion.div className='flex flex-1 flex-col items-end justify-end pb-4 border p-4 rounded-lg bg-gray-100 shadow-inner dark:bg-gray-900'>
                {/* Message Display */}
                <div className='max-h-[50vh] overflow-y-scroll w-full flex flex-col gap-2' id='message-container'>
                    <AnimatePresence mode='wait'>
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                layout='position'
                                className={cn(
                                    'z-10 mt-2 max-w-[250px] break-words rounded-2xl bg-gray-200 dark:bg-gray-800',
                                    {
                                        'self-end text-gray-900 dark:text-gray-100': message.role === 'user',
                                        'self-start bg-blue-500 text-white': message.role === 'assistant',
                                    }
                                )}
                                layoutId={`container-[${messages.length - 1}]`}
                                transition={transitionDebug}
                            >
                                <div className='px-3 py-2 text-[15px] leading-[15px]'>{message.content}</div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                {messages.length > 0 && <div className='h-4'></div>}

                {/* Input Section */}
                <div className='w-full'>
                    {messages.length === 0 && (
                        <div className='mb-4'>
                            <div className='flex items-center gap-4'>
                                <SparklesIcon className='size-6 text-gray-500' />
                                <div>
                                    <p className='text-gray-900 dark:text-gray-100'>Ask AI anything about your emails</p>
                                    <p className='text-gray-500 text-xs dark:text-gray-400'>
                                        Get answers to your questions about your emails
                                    </p>
                                </div>
                            </div>
                            <div className='h-2'></div>
                            <div className='flex items-center gap-2 flex-wrap'>
                                {['What can I ask?', 'When is my next flight?', 'When is my next meeting?'].map((text) => (
                                    <span
                                        key={text}
                                        onClick={() => handlePresetQuestion(text)}
                                        className='px-2 py-1 bg-gray-800 text-gray-200 rounded-md text-xs cursor-pointer'
                                    >
                                        {text}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className='flex w-full'>
                        <input
                            type='text'
                            onChange={handleInputChange}
                            value={input}
                            className='relative h-9 flex-grow rounded-full border border-gray-200 bg-white px-3 text-[15px] placeholder:text-[13px] outline-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-blue-500/20
                                dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400'
                            placeholder='Ask AI anything about your emails'
                            aria-label='Ask AI anything about your emails'
                        />
                        <button
                            type='submit'
                            className='ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800'
                            aria-label='Send message'
                        >
                            <Send className='size-4 text-gray-500 dark:text-gray-300' />
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

export default AskAI
