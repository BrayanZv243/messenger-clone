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
    const containerRef = useRef<HTMLDivElement>(null);

    const { conversationId } = useConversation();
    const [renderComplete, setRenderComplete] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (bottomRef.current) {
                localStorage.setItem(
                    conversationId,
                    bottomRef.current.scrollTop.toString()
                );
            }
        };

        const currentRef = bottomRef.current;
        currentRef?.addEventListener("scroll", handleScroll);

        const scrollPosition = localStorage.getItem(conversationId) || "0";
        currentRef?.scrollTo({
            top: parseFloat(scrollPosition),
            behavior: "smooth",
        });

        // Cleanup del evento
        return () => {
            currentRef?.removeEventListener("scroll", handleScroll);
        };
    }, [bottomRef, conversationId, renderComplete]);

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

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === "childList") {
                    const messageBoxes =
                        containerRef?.current!.querySelectorAll(
                            "[data-message-id]"
                        );
                    if (messageBoxes.length === messages.length) {
                        setRenderComplete(true);
                        observer.disconnect();
                    }
                }
            }
        });

        observer.observe(containerRef.current, {
            childList: true,
            subtree: true,
        });

        return () => {
            observer.disconnect();
        };
    }, [messages]);

    useEffect(() => {
        bottomRef.current?.scrollTo({ top: bottomRef.current.scrollHeight });
    }, [renderComplete, messages]);

    if (!session.data) return <BodyMessagesSkeleton />;

    return (
        <>
            <div
                className="flex-1 overflow-y-auto"
                ref={bottomRef}
                suppressHydrationWarning
            >
                <div ref={containerRef}>
                    {messages.map((message, i) => {
                        const previousMessage = messages[i - 1];
                        return (
                            <MessageBox
                                isLast={i === messages.length - 1}
                                key={message.id}
                                data={message}
                                previousMessage={previousMessage}
                                data-message-id={message.id}
                            />
                        );
                    })}
                </div>
                <div className="pt-2" />
            </div>
        </>
    );
};

export const BodyMessagesSkeleton = () => {
    return (
        <>
            <div
                className="flex-1 overflow-y-auto mt-3"
                suppressHydrationWarning
            >
                {[...Array(5)].map((_, i) => (
                    <MessageBoxSkeleton key={i} number={i} />
                ))}
            </div>
        </>
    );
};

export default Body;
