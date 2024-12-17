import React, { useState } from 'react'
import StarterKit from "@tiptap/starter-kit"
import { EditorContent, useEditor } from "@tiptap/react"
import { Text } from "@tiptap/extension-text"
import EditorMenuBar from './editor-menuBar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import TagInput from './tag-input'
import useThreads from '@/hooks/use-threads'
import { api } from '@/trpc/react'
import { Input } from '@/components/ui/input'
import AiComposeButton from './ai-compose-button'
import { cn } from '@/lib/utils'
import { generate } from './action'
import { readStreamableValue } from 'ai/rsc'


type Props = {
    subject: string,
    setSubject: (value: string) => void,
    toValues: { label: string, value: string }[],
    setToValues: (value: { label: string, value: string }[]) => void
    ccValues: { label: string, value: string }[],
    setCcValues: (value: { label: string, value: string }[]) => void


    to: string[]
    handleSend: (calue: string) => void
    isSending: boolean

    defaultToolBarExpanded?: boolean


}

const EmailEditor = ({ ccValues, handleSend, isSending, setCcValues, setSubject, setToValues, subject, to, toValues, defaultToolBarExpanded }: Props) => {


    const [value, setValue] = React.useState<string>("")

    const [expanded, setExpanded] = React.useState<boolean>(defaultToolBarExpanded)
    const [token, setToken] = React.useState<string>("")


    const aiGenerate = async (value: string) => {
        const { output } = await generate(value)
        for await (const token of readStreamableValue(output)) {
            if (token) {
                setToken(token)
            }
        }
    }


    const CustomText = Text.extend({
        addKeyboardShortcuts() {
            return {
                'Meta-j': () => {
                    aiGenerate(this.editor.getText())
                    return true;
                }
            }
        }
    })

    const editor = useEditor({
        autofocus: false,
        extensions: [StarterKit, CustomText],
        onUpdate: ({ editor }) => {
            setValue(editor.getHTML())
        }
    })
    React.useEffect(() => {
        editor?.commands?.insertContent(token)

    }, [editor, token])

    const onGenerate = (token: string) => {
        editor?.commands?.insertContent(token)
    }

    if (!editor) return null

    return (
        <div>
            <div className='flex border-b py-2 p-4'>
                <EditorMenuBar editor={editor} />
            </div>

            <div className='p-4 pb-0 space-y-2'>
                {expanded && (
                    <>
                        <TagInput
                            label='To'
                            // @ts-ignore
                            onChange={setToValues}
                            placeholder='Add Recipients'
                            // @ts-ignore
                            value={toValues}
                        />
                        <TagInput
                            label='Cc'
                            // @ts-ignore
                            onChange={setCcValues}
                            placeholder='Add Recipients'
                            // @ts-ignore
                            value={ccValues}
                        />
                        <Input id='subject' placeholder='Subject' value={subject} onChange={(e) => setSubject(e.target.value)} />
                    </>
                )}
                <div className='flex items-center gap-2'>
                    <div className='cursor-pointer' onClick={() => setExpanded(!expanded)}>
                        <span className='text-green-600 font-medium'>
                            Draft {" "}
                        </span>
                        <span>
                            to {to.join(', ')}
                        </span>
                    </div>
                    <AiComposeButton isComposing={defaultToolBarExpanded} onGenerate={onGenerate} />
                </div>
            </div>

            <div className={cn('prose w-full px-4 overflow-auto cursor-text', expanded ? "" : "h-[150px]")}>
                <EditorContent editor={editor} value={value} />
            </div>


            <Separator />
            <div className="py-3 px-4 flex items-center justify-between">
                <span className="text-sm">
                    Tip: Press{" "}
                    <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                        Cmd + J
                    </kbd>{" "}
                    for AI autocomplete
                </span>
                <Button onClick={async () => {
                    editor?.commands?.clearContent()
                    await handleSend(value)
                }} disabled={isSending}>
                    Send
                </Button>
            </div>
        </div>
    )
}

export default EmailEditor