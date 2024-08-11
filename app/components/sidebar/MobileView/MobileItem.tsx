"use client";

import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";
import ModalLoading from "../../Modal-Loading";
import { Skeleton } from "@/components/ui/skeleton";

interface MobileItemProps {
    icon: any;
    href: string;
    onClick?: () => void;
    active?: boolean;
    label: string;
}

const MobileItem: React.FC<MobileItemProps> = ({
    icon: Icon,
    href,
    onClick,
    active,
    label,
}) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (onClick) {
            if (label === "Logout") setLoading(true);
            onClick();
        }
    };

    return (
        <>
            {loading && <ModalLoading />}
            <Link
                href={href}
                onClick={handleClick}
                className={clsx(
                    `group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100`,
                    active && "bg-gray-100 text-black"
                )}
            >
                <Icon className="h-6 w-6" />
            </Link>
        </>
    );
};

export const MobileItemSkeleton = () => {
    return (
        <div className=" flex text-sm leading-6  justify-center p-2 animate-pulse w-1/3 ">
            <div className="rounded-full bg-gray-400 ">
                <Skeleton className="w-8 h-8 " />
            </div>
        </div>
    );
};

export default MobileItem;
