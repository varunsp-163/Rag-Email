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


type Props = {
    isComposing: boolean,
    onGenerate: (token: string) => void

}

const AiComposeButton = (props: Props) => {

    const [open, setOpen] = React.useState<boolean>(false)
    const [prompt, setPrompt] = React.useState<string>("")

    const aiGenerate = async () => {
        const { output } = await generateEmail("", prompt)
        console.log("prompt",prompt)
        for await (const token of readStreamableValue(output)) {
            console.log(token)
            if (token)
                props.onGenerate(token)
            else console.log("No token")
        }
    }

    return (

        <Dialog>
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
