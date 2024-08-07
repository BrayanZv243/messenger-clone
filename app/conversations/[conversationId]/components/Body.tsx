"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { useSession } from "next-auth/react";
import Loading from "./Loading";
import axios from "axios";

interface BodyProps {
    initialMessages: FullMessageType[];
}

const Body = ({ initialMessages }: BodyProps) => {
    const session = useSession();
    const [messages, setMessages] = useState(initialMessages);
    const bottomRef = useRef<HTMLDivElement>(null);

    const { conversationId } = useConversation();

    useEffect(() => {
        const handleScroll = () => {
            if (bottomRef.current) {
                localStorage.setItem(
                    conversationId,
                    bottomRef.current.scrollTop.toString()
                );
            }
        };

        bottomRef.current?.addEventListener("scroll", handleScroll);
    }, [bottomRef.current, messages]);

    useEffect(() => {
        if (bottomRef.current) {
            const scrollPosition = localStorage.getItem(conversationId) || "0";
            bottomRef.current.scrollTop = parseFloat(scrollPosition);
        }
    }, [session, messages, conversationId]);

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`);
    }, [conversationId]);

    // Render Body Messages Skeleton
    if (!session.data) return <Loading />;

    return (
        <div className="flex-1 overflow-y-auto" ref={bottomRef}>
            {messages.map((message, i) => (
                <MessageBox
                    isLast={i === messages.length - 1}
                    key={message.id}
                    data={message}
                />
            ))}
            <div className="pt-2" />
        </div>
    );
};

export default Body;
