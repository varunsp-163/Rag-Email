import { create, insert, search, save, load, type AnyOrama } from "@orama/orama";
import { persist, restore } from "@orama/plugin-data-persistence";
import { db } from "@/server/db";
import { getEmbeddings } from "@/lib/embeddings";
import { threadId } from "worker_threads";

export class OramaClient {
    // @ts-ignore
    private orama: AnyOrama;
    private accountId: string;

    constructor(accountId: string) {
        this.accountId = accountId;
    }

    async initialize() {
        console.log("Initializing")
        const account = await db.account.findUnique({
            where: { id: this.accountId },
            select: { oramaIndex: true }
        });
        if (!account) throw new Error('Account not found');

        if (account.oramaIndex) {
            console.log("oramaIndex is present")
            this.orama = await restore('json', account.oramaIndex);
            console.log("Done")
        } else {
            console.log("oramaIndex is not present and its being created")
            this.orama = await create({
                schema: {
                    title: "string",
                    body: "string",
                    rawBody: "string",
                    from: 'string',
                    to: 'string[]',
                    sentAt: 'string',
                    threadId: 'string',
                    embeddings: 'vector[1538]'
                },
            });
            await this.saveIndex();
        }
    }

    async insert(document: any) {
        await insert(this.orama, document);
        await this.saveIndex();
    }

    async vectorSearch({ prompt, numResults = 10 }: { prompt: string, numResults?: number }) {
        const embeddings = await getEmbeddings(prompt)
        const results = await search(this.orama, {
            mode: 'hybrid',
            term: prompt,
            vector: {
                value: embeddings,
                property: 'embeddings'
            },
            similarity: 0.80,
            limit: numResults,
            // hybridWeights: {
            //     text: 0.8,
            //     vector: 0.2,
            // }
        })
        // console.log(results.hits.map(hit => hit.document))
        return results
    }
    async search({ term }: { term: string }) {
        const ans = await search(this.orama, {
            term: term,
        });
        return ans
    }

    async saveIndex() {
        const index = await persist(this.orama, 'json');
        await db.account.update({
            where: { id: this.accountId },
            data: { oramaIndex: index as Buffer }
        });
    }
}
