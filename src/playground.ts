import { db } from "./server/db";

await db.user.create({
  data: {
    emailAddress: "test12@gmail.com",
    firstName: "Varun",
    lastName: "S P",
  },
});

console.log("Done with query");
