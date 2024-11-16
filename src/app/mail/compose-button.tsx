'use client'

import React from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import EmailEditor from './email-editor'
import { api } from '@/trpc/react'
import useThreads from '@/hooks/use-threads'
import { toast } from 'sonner'



const ComposeButton = () => {

    const [toValues, setToValues] = React.useState<{ label: string, value: string }[]>([])
    const [ccValues, setCcValues] = React.useState<{ label: string, value: string }[]>([])
    const [subject, setSubject] = React.useState<string>("")

    const sendEmail = api.account.sendEmail.useMutation()
    const { account } = useThreads()

    const handleSend = async (value: string) => {
        if (!account) return
        sendEmail.mutate({
            accountId: account.id,
            threadId: undefined,
            body: value,
            from: { name: account?.name ?? "Me", address: account.emailAddress ?? "rag_mail@gmail.com" },
            to: toValues.map(to => ({ name: to.value, address: to.value })),
            cc: ccValues.map(cc => ({ name: cc.value, address: cc.value })),
            replyTo: { name: account?.name ?? "Me", address: account.emailAddress ?? "rag_mail@gmail.com" },
            subject: subject,
            inReplyTo: undefined
        }, {
            onSuccess: () => {
                toast.success("Email sent successfully")
            },
            onError: (e) => {
                console.log(e)
                toast.error("Couldn't send the email")
            }
        })
    }

    return (
        <Drawer>
            <DrawerTrigger>
                <Button>Compose <Pencil /> </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Compose Email</DrawerTitle>
                </DrawerHeader>
                <EmailEditor
                    toValues={toValues}
                    setToValues={setToValues}
                    ccValues={ccValues}
                    setCcValues={setCcValues}
                    subject={subject}
                    setSubject={setSubject}

                    to={toValues.map(e => e.value)}
                    defaultToolBarExpanded={true}

                    handleSend={handleSend}
                    isSending={sendEmail.isPending}
                />
            </DrawerContent>
        </Drawer>

    )
}



export default ComposeButton
