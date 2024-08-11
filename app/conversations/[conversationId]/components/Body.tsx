"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import MessageBox, { MessageBoxSkeleton } from "./MessageBox";
import { useSession } from "next-auth/react";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
    initialMessages: FullMessageType[];
}

const Body = ({ initialMessages }: BodyProps) => {
    const session = useSession();
    const [messages, setMessages] =
        useState<FullMessageType[]>(initialMessages);
    const bottomRef = useRef<HTMLDivElement>(null);
    const topRef = useRef<HTMLDivElement>(null);

    const { conversationId } = useConversation();

    useEffect(() => {
        const handleScroll = () => {
            if (topRef.current) {
                localStorage.setItem(
                    conversationId,
                    topRef.current.scrollTop.toString()
                );
            }
        };

        const currentRef = topRef.current;
        currentRef?.addEventListener("scroll", handleScroll);

        const scrollPosition = localStorage.getItem(conversationId) || "0";
        currentRef?.scrollTo({
            top: parseFloat(scrollPosition),
            behavior: "smooth",
        });

        return () => {
            currentRef?.removeEventListener("scroll", handleScroll);
        };
    }, [conversationId]);

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`);
    }, [conversationId]);

    useEffect(() => {
        pusherClient.subscribe(conversationId);

        const messageHandler = (message: FullMessageType) => {
            axios.post(`/api/conversations/${conversationId}/seen`);

            setMessages((current) => {
                if (find(current, { id: message.id })) {
                    return current;
                }

                return [...current, message];
            });
        };

        const updateMessageHandler = (newMessage: FullMessageType) => {
            setMessages((current) =>
                current.map((currentMessage) => {
                    if (currentMessage.id === newMessage.id) {
                        return newMessage;
                    }
                    return currentMessage;
                })
            );
        };

        pusherClient.bind("messages:new", messageHandler);
        pusherClient.bind("message:update", updateMessageHandler);

        return () => {
            pusherClient.unsubscribe(conversationId);
            pusherClient.unbind("messages:new", messageHandler);
            pusherClient.unbind("message:update", updateMessageHandler);
        };
    }, [conversationId]);

    // Use a separate effect to ensure scroll is updated after messages change
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView();
        }
    }, [messages]);

    if (!session.data) return <BodyMessagesSkeleton />;

    return (
        <div className="flex-1 overflow-y-auto mt-3" ref={topRef}>
            {messages.map((message, i) => (
                <MessageBox
                    isLast={i === messages.length - 1}
                    key={message.id}
                    data={message}
                />
            ))}
            <div className="pt-2" ref={bottomRef} />
        </div>
    );
};

export const BodyMessagesSkeleton = () => {
    return (
        <div className="flex-1 overflow-y-auto mt-3">
            {[...Array(5)].map((_, i) => (
                <MessageBoxSkeleton key={i} number={i} />
            ))}
        </div>
    );
};

export default Body;
