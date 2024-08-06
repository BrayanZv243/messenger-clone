import prisma from "@/app/libs/prismadb";
import { Message } from "@prisma/client";

const getMessages = async (conversationId: string): Promise<Message[]> => {
    try {
        const messages = await prisma.message.findMany({
            where: {
                conversationId: conversationId,
            },
            include: {
                sender: true,
                seen: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        return messages;
    } catch (error) {
        return [];
    }
};

export default getMessages;
