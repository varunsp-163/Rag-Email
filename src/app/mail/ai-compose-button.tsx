'use client'
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Bot } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { generateEmail } from './action'
import { readStreamableValue } from 'ai/rsc'
import useThreads from '@/hooks/use-threads'
import { turndown } from '@/lib/turndown'


type Props = {
    isComposing: boolean,
    onGenerate: (token: string) => void

}

const AiComposeButton = (props: Props) => {

    const { threads, threadId, account } = useThreads()

    const thread = threads?.find(t => t.id === threadId)

    const [open, setOpen] = React.useState<boolean>(false)
    const [prompt, setPrompt] = React.useState<string>("")

    const aiGenerate = async () => {
        let context = ''

        if (!props.isComposing) {
            for (const email of thread?.emails ?? []) {
                const content = `
                Subject:${email.subject}
                From:${email.from.address}
                SentAt:${new Date(email.sentAt).toLocaleString()}
                Body:${turndown.turndown(email.body ?? email.bodySnippet ?? "")}
                `
                context += content
            }
        }
        context += `My name is ${account?.name} and my email is ${account?.emailAddress}.`

        const { output } = await generateEmail(context, prompt)
        console.log("prompt", prompt)
        for await (const token of readStreamableValue(output)) {
            console.log(token)
            if (token)
                props.onGenerate(token)
        }
    }

    return (

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button>
                    <Bot size='icon' onClick={() => setOpen(true)} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>AI smart compose</DialogTitle>
                    <DialogDescription>
                        AI will help you compose the email
                    </DialogDescription>
                    <div className='h-2'></div>
                    <Textarea placeholder='Enter a prompt' value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                    <div className='h-2'></div>
                    <Button onClick={() => {
                        setOpen(false)
                        aiGenerate()
                        setPrompt('')
                    }}>
                        Generate
                    </Button>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}

export default AiComposeButton
