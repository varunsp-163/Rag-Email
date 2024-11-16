'use client'
import React from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { Nav } from './nav'
import {
    AlertCircle,
    Archive,
    ArchiveX,
    File,
    Inbox,
    MessagesSquare,
    Send,
    ShoppingCart,
    Trash2,
    Users2,
} from "lucide-react"
import { usePathname } from 'next/navigation'
import { api } from '@/trpc/react'


type Props = {

    isCollapsed: boolean
}

const Sidebar = ({ isCollapsed }: Props) => {

    const [accountId] = useLocalStorage("accountId", "")
    const [tab] = useLocalStorage<"inbox" | "draft" | "sent">("rag-email-tab", "inbox")


    const { data: inboxThreads } = api.account.getNumThreads.useQuery({
        accountId,
        tab: "inbox"
    }, { enabled: !!accountId && !!tab })

    const { data: draftsThreads } = api.account.getNumThreads.useQuery({
        accountId,
        tab: "drafts"
    }, { enabled: !!accountId && !!tab })

    const { data: sentThreads } = api.account.getNumThreads.useQuery({
        accountId,
        tab: "sent"
    }, { enabled: !!accountId && !!tab })

    return (
        <Nav isCollapsed={isCollapsed}
            links={
                [{
                    title: "Inbox",
                    label: inboxThreads?.toString() || "0",
                    icon: Inbox,
                    variant: tab === "inbox" ? "default" : "ghost",
                },
                {
                    title: "Drafts",
                    label: draftsThreads?.toString() || "0",
                    icon: File,
                    variant: tab === "drafts" ? "default" : "ghost",
                },
                {
                    title: "Sent",
                    label: sentThreads?.toString() || "0",
                    icon: Send,
                    variant: tab === "sent" ? "default" : "ghost",
                },]
            }
        />
    )
}

export default Sidebar