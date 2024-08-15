"use client";

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem, { MobileItemSkeleton } from "./MobileItem";
import { User } from "@prisma/client";

const MobileFooter = () => {
    const routes = useRoutes();
    const { isOpen } = useConversation();

    if (isOpen) return;

    return (
        <>
            <div className="fixed justify-center w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden">
                {routes.map((route) => (
                    <MobileItem
                        key={route.href}
                        href={route.href}
                        active={route.active}
                        icon={route.icon}
                        onClick={route.onClick}
                        label={route.label}
                    />
                ))}
            </div>
        </>
    );
};

export const MobileFooterSkeleton = () => {
    return (
        <div className="fixed justify-between bg-gray-100 w-full bottom-0 z-40 flex items-center border-t-[1px] lg:hidden animate-pulse ">
            {[...Array(3)].map((_, i) => (
                <MobileItemSkeleton key={i} />
            ))}
        </div>
    );
};

export default MobileFooter;
