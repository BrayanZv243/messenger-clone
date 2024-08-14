import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";
import Header, { HeaderSkeleton } from "./components/Header";
import Body, { BodyMessagesSkeleton } from "./components/Body";
import Form, { FormSkeleton } from "./components/Form";
import { FC, Suspense } from "react";

interface IParams {
    conversationId: string;
}

const HeaderConversationContent = async ({ params }: { params: IParams }) => {
    const conversation = await getConversationById(params.conversationId);

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

    return <Body initialMessages={messages} />;
};

const ConversationId = ({ params }: { params: IParams }) => {
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

const LayoutConversationSkeleton: FC = () => {
    return (
        <>
            <HeaderSkeleton />
            <BodyMessagesSkeleton />
            <FormSkeleton />
        </>
    );
};

export default ConversationId;
