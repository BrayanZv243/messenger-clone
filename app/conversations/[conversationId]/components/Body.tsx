"use client";

import { FullMessageType } from "@/app/types";

interface BodyProps {
    initialMessages: FullMessageType[];
}

const Body = ({ initialMessages }: BodyProps) => {
    return <div className="flex-1 overflow-y-auto">Body</div>;
};

export default Body;
