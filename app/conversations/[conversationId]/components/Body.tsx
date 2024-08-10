"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { useSession } from "next-auth/react";
import Loading from "./Loading";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

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
    }, [session, conversationId]);

    useEffect(() => {
        if (bottomRef.current) {
            const scrollPosition = localStorage.getItem(conversationId) || "0";
            setTimeout(() => {
                bottomRef.current?.scrollTo({
                    top: parseFloat(scrollPosition),
                    behavior: "smooth",
                });
            }, 100);
        }
    }, [session, messages, conversationId]);

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`);
    }, [conversationId]);

    useEffect(() => {
        pusherClient.subscribe(conversationId);
        bottomRef?.current?.scrollIntoView({ behavior: "smooth" });

        const messagesHandler = (message: FullMessageType) => {
            axios.post(`/api/conversations/${conversationId}/seen`);

            setMessages((current) => {
                if (find(current, { id: message.id })) return current;

                return [...current, message];
            });
            bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
        };

        const updateMessageHandler = (newMessage: FullMessageType) => {
            setMessages((current) =>
                current.map((currentMessage) => {
                    if (currentMessage.id === newMessage.id) return newMessage;

                    return currentMessage;
                })
            );
        };

        pusherClient.bind("messages:new", messagesHandler);
        pusherClient.bind("message:update", updateMessageHandler);

        return () => {
            pusherClient.unsubscribe(conversationId);
            pusherClient.unbind("messages:new", messagesHandler);
            pusherClient.unbind("message:update", updateMessageHandler);
        };
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
