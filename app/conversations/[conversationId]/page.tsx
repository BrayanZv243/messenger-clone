import dynamic from "next/dynamic";
import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";
import { Suspense } from "react";

// Cargar componentes de forma dinámica, solo en el cliente
const Header = dynamic(() => import("./components/Header"), { ssr: false });
const Body = dynamic(() => import("./components/Body"), { ssr: false });
const Form = dynamic(() => import("./components/Form"), { ssr: false });
const HeaderSkeleton = dynamic(
    () => import("./components/Header").then((mod) => mod.HeaderSkeleton),
    { ssr: false }
);
const BodyMessagesSkeleton = dynamic(
    () => import("./components/Body").then((mod) => mod.BodyMessagesSkeleton),
    { ssr: false }
);
const FormSkeleton = dynamic(
    () => import("./components/Form").then((mod) => mod.FormSkeleton),
    { ssr: false }
);

interface IParams {
    conversationId: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const HeaderConversationContent = async ({ params }: { params: IParams }) => {
    const conversation = await getConversationById(params.conversationId);
    await delay(3500);

    if (!conversation) {
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <EmptyState />
                </div>
            </div>
        );
    }
    return <Header conversation={conversation} />;
};

const MessageBodyContent = async ({ params }: { params: IParams }) => {
    const messages = await getMessages(params.conversationId);
    await delay(3500);

    return <Body initialMessages={messages} />;
};

const ConversationId = async ({ params }: { params: IParams }) => {
    return (
        <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
                <Suspense fallback={<LayoutConversationSkeleton />}>
                    <HeaderConversationContent params={params} />
                    <MessageBodyContent params={params} />
                    <Form />
                </Suspense>
            </div>
        </div>
    );
};

export const LayoutConversationSkeleton = () => {
    return (
        <>
            <HeaderSkeleton />
            <BodyMessagesSkeleton />
            <FormSkeleton />
        </>
    );
};

export default ConversationId;
