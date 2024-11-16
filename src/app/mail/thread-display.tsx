'use client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import useThreads from '@/hooks/use-threads'
import { Archive, ArchiveX, Clock, Trash2, MoreVertical } from 'lucide-react'
import React from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import EmailDisplay from './email-display'
import ReplyBox from './reply-box'
import { useAtom } from 'jotai'
import { isSearchingAtom } from './search-bar'
import SearchDisplay from './search-display'


const ThreaDisplay = () => {
    const { threadId, threads } = useThreads()
    const thread = threads?.find(t => t.id === threadId)
    const [isSearching] = useAtom(isSearchingAtom)
    // console.log(thread)
    return (
        <div className='flex flex-col h-full overflow-scroll'>
            {/* buttons */}
            <div className='items-center flex p-2'>
                <div className="flex items-center-gap-2">
                    <Button variant={"ghost"} size="icon" disabled={!thread}>
                        <Archive className='size-4' />
                    </Button>
                    <Button variant={"ghost"} size="icon" disabled={!thread}>
                        <ArchiveX className='size-4' />
                    </Button>
                    <Button variant={"ghost"} size="icon" disabled={!thread}>
                        <Trash2 className='size-4' />
                    </Button>
                </div>
                <Separator orientation='vertical' className='ml-2' />
                <Button className='ml-2' variant={'ghost'} size={'icon'} disabled={!thread}>
                    <Clock className='size-4' />
                </Button>

                <div className="flex items-center ml-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button className='ml-2' variant={'ghost'} size={'icon'} disabled={!thread}>
                                <MoreVertical className='size-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Mark as unread</DropdownMenuLabel>
                            <DropdownMenuItem>Start thread</DropdownMenuItem>
                            <DropdownMenuItem>Add label</DropdownMenuItem>
                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuItem>Mute thread</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
            <Separator />
            {isSearching ? <><SearchDisplay /></> :
                <>
                    {thread ? <div className='flex flex-col flex-1 overflow-scroll'>
                        <div className='flex items-center p-2'>
                            <div className='flex items-center gap-4 text-sm'>
                                <Avatar>
                                    {/* <AvatarImage src="https://github.com/shadcn.png" alt="avatar" /> */}
                                    <AvatarFallback>{thread.emails[0]?.from?.name?.split(' ').map(c => c[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className='grid gap-1'>
                                    <div className='font-semibold'>
                                        {thread.emails[0]?.from?.name}
                                        <div className='text-xs line clamp-1'>
                                            {thread.emails[0]?.subject}
                                        </div>
                                        <div className='text-xs line clamp-1'>
                                            <span className="font-medium">
                                                Reply-To:
                                            </span>
                                            {thread.emails[0]?.from?.address}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {thread.emails[0]?.sentAt && (
                                <div className='ml-auto text-xs text-muted-foreground'>
                                    {format(new Date(thread.emails[0]?.sentAt), "PPpp")}
                                </div>
                            )}
                        </div>
                        <Separator />
                        <div className='max-h-[calc(100vh-450px)] overflow-scroll flex flex-col'>
                            <div className='flex flex-col gap-4 p-6'>
                                {thread.emails.map(e => {
                                    // Display Email Subject
                                    return <EmailDisplay email={e} key={e.id} />
                                })}
                            </div>
                        </div>
                        <Separator className='mt-auto' />
                        {/* Reply Box */}
                        <div className='overflow-scroll max-h-[300px]'>
                            <ReplyBox />
                        </div>

                    </div> : <div className='p-8 text-center text-muted-foreground'>No Message Selected</div>}
                </>
            }


        </div>
    )
}

export default ThreaDisplay
