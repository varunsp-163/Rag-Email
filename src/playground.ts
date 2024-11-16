import { OramaClient } from "./lib/orama";
import { turndown } from "./lib/turndown";
import { db } from "./server/db";


const orama = new OramaClient("79476")
await orama.initialize()


// const emails = await db.email.findMany({
//     select: {
//         subject: true,
//         body: true,
//         bodySnippet: true,
//         rawBody: true,
//         from: true,
//         to: true,
//         sentAt: true,
//         threadId: true,
//     }

// })

// for (const email of emails) {
//     console.log("Inserting")
//     const body = turndown.turndown(email.body ?? email.bodySnippet ?? "")
//     await orama.insert({
//         subject: email.subject,
//         body: body,
//         from: email.from.address,
//         rawBody: email.bodySnippet ?? "",
//         to: email.to.map(to => to.address),
//         sentAt: email.sentAt.toLocaleString(),
//         threadId: email.threadId
//     })
//     console.log("Done Inserting")
// }

const searchResult = await orama.search({
    term: "shiksha"
})

// console.log(searchResult)

console.log("Output")
for (const hit of searchResult.hits) {
    console.log(hit.document.from)
}