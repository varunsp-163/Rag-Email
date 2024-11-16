import axios from "axios"
import { EmailAddress, EmailMessage, SyncResponse, SyncUpdatedResponse } from "./types"

export class Account {
    private token: string
    constructor(token: string) {
        this.token = token
    }

    private async startSync() {
        const res = await axios.post<SyncResponse>(`${process.env.API_BASE_URL}/email/sync`, {}, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
            params: {
                daysWithin: 2,
                bodyType: "html"
            }
        })
        return res.data
    }

    async getUpdatedEmails({ deltaToken, pageToken }: { deltaToken?: string, pageToken?: string }) {
        const params: Record<string, string> = {}
        if (deltaToken) params.deltaToken = deltaToken
        if (pageToken) params.pageToken = pageToken

        const res = await axios.get<SyncUpdatedResponse>(`${process.env.API_BASE_URL}/email/sync/updated`, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            }, params
        })
        return res.data
    }

    async performInitialSync() {
        console.log("In performInitialSync")
        try {
            const daysWithin = 3;
            let syncRes = await this.startSync(daysWithin)
            while (!syncRes.ready) {
                await new Promise(resolve => setTimeout(resolve, 1000))
                syncRes = await this.startSync(daysWithin)
            }

            console.log('Sync is ready. Tokens:', syncRes);
            // get the bookmark deltaToken
            let storedDeltaToken: string = syncRes.syncUpdatedToken
            let updatedResponse = await this.getUpdatedEmails({ deltaToken: syncRes.syncUpdatedToken });
            if (updatedResponse.nextDeltaToken) {
                // sync is done
                storedDeltaToken = updatedResponse.nextDeltaToken
            }
            let allEmails: EmailMessage[] = updatedResponse.records
            // fetch all pages if more

            while (updatedResponse.nextPageToken) {
                updatedResponse = await this.getUpdatedEmails({ pageToken: updatedResponse.nextPageToken })
                allEmails = allEmails.concat(updatedResponse.records)
                if (updatedResponse.nextDeltaToken) {
                    storedDeltaToken = updatedResponse.nextDeltaToken
                }
            }

            console.log("Initial sync completed, we have", allEmails.length, "Emails")
            return {
                emails: allEmails,
                deltaToken: storedDeltaToken
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Error during sync:", JSON.stringify(err.response?.data, null, 2))
            } else {
                console.log("Error during sync", err)
            }
        }
    }

    async sendEmail({
        from,
        subject,
        body,
        inReplyTo,
        references,
        threadId,
        to,
        cc,
        bcc,
        replyTo,
    }: {
        from: EmailAddress;
        subject: string;
        body: string;
        inReplyTo?: string;
        references?: string;
        threadId?: string;
        to: EmailAddress[];
        cc?: EmailAddress[];
        bcc?: EmailAddress[];
        replyTo?: EmailAddress;
    }) {
        try {
            const response = await axios.post(
                `${process.env.API_BASE_URL}/email/messages`,
                {
                    from,
                    subject,
                    body,
                    inReplyTo,
                    references,
                    threadId,
                    to,
                    cc,
                    bcc,
                    replyTo: [replyTo],
                },
                {
                    params: {
                        returnIds: true,
                    },
                    headers: { Authorization: `Bearer ${this.token}` }
                }
            );

            console.log('email sent', response.data)
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error sending email:', JSON.stringify(error.response?.data, null, 2));
            } else {
                console.error('Error sending email:', error);
            }
            throw error;
        }
    }

}