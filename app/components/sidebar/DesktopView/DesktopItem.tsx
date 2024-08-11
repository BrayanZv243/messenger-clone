"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { Hint } from "../../Hint";
import { Skeleton } from "@/components/ui/skeleton";
import { DesktopSidebarSkeleton } from "./DesktopSidebar";

interface DesktopItemProps {
    label: string;
    icon: any;
    href: string;
    onClick?: () => void;
    active?: boolean;
}

const DesktopItem: React.FC<DesktopItemProps> = ({
    label,
    icon: Icon,
    href,
    onClick,
    active,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleClick = () => {
        if (active) return;

        if (onClick) {
            onClick();
        } else {
            setIsLoading(true);
            router.push(href);
        }
    };

    if (isLoading) return <DesktopSidebarSkeleton />;

    return (
        <li>
            <Hint label={label} side="right" align="center">
                <div
                    className={clsx(
                        `group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100`,
                        active && "bg-gray-100 text-black"
                    )}
                    onClick={handleClick}
                >
                    <Icon className="h-6 w-6 shrink-0" />
                    <span className="sr-only">{label}</span>
                </div>
            </Hint>
        </li>
    );
};

export const DesktopItemSkeleton = () => {
    return (
        <div className="group flex gap-x-3 rounded-full p-3 text-sm leading-6 font-semibold text-gray-500 bg-gray-200 animate-pulse">
            <Skeleton className="h-4 w-4" />
        </div>
    );
};

export default DesktopItem;
