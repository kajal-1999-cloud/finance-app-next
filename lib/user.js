import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
    const user = await currentUser();
    // console.log("clerk user", user)
    if (!user) {
        return null
    }

    try {
        const loggedInUser = await db.user.findUnique({
            where: {
                clerkUSerId: user.id,
            },
        });
        console.log("logedinuser", loggedInUser)
        if (loggedInUser) {
            return loggedInUser;
        }

        const name = `${user.firstName} ${user.lastName}`;

        const newUser = await db.user.create({
            data: {
                clerkUSerId: user.id,
                name,
                imageUrl: user.imageUrl,
                email: user.emailAddresses[0].emailAddress,
            },
        });
        // console.log("newUser", newUser);
        return newUser;
    } catch (error) {
        console.log("check user error--->", error.message)
    }
}