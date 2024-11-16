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



const ComposeButton = () => {

    const [toValues, setToValues] = React.useState<{ label: string, value: string }[]>([])
    const [ccValues, setCcValues] = React.useState<{ label: string, value: string }[]>([])
    const [subject, setSubject] = React.useState<string>("")

    const handleSend = async () => {
        console.log("value", value)
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
                    isSending={false}
                />
            </DrawerContent>
        </Drawer>

    )
}



export default ComposeButton
