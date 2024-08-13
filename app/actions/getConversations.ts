import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";
import { FullConversationType } from "../types";

const getConversations = async (): Promise<FullConversationType[]> => {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) return [];

    try {
        const conversations: FullConversationType[] =
            await prisma.conversation.findMany({
                orderBy: {
                    lastMessageAt: "desc",
                },
                where: {
                    userIds: {
                        has: currentUser.id,
                    },
                },
                include: {
                    users: true,
                    messages: {
                        include: {
                            sender: true,
                            seen: true,
                        },
                    },
                },
            });

        return conversations || [];
    } catch (error) {
        return [];
    }
};

export default getConversations;
