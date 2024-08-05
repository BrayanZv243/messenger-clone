import prisma from "@/app/libs/prismadb";

import getSession from "./getSession";
import { User } from "@prisma/client";

const getUsers = async (): Promise<User[]> => {
    const session = await getSession();

    if (!session?.user?.email) return [];

    try {
        const users: User[] = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
            where: {
                NOT: {
                    email: session.user.email,
                },
            },
        });

        return users;
    } catch (error) {
        return [];
    }
};

export default getUsers;
