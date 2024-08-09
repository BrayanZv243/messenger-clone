"use client";

import { getInitialsColor } from "@/app/actions/getRandomColorUserAvatar";
import clsx from "clsx";
import { useMemo } from "react";

interface UserProps {
    name: string;
    isGroup?: boolean;
}

const UserAvatarDefault = ({ name, isGroup }: UserProps) => {
    const { backgroundColor, initials } = useMemo(
        () => getInitialsColor(name),
        [name]
    );

    return (
        <div className="flex items-center">
            <div
                className={clsx(
                    `w-10 h-10 text-center items-center justify-center rounded-full text-white font-bold`,
                    !isGroup && "flex text-lg",
                    isGroup && "text-sm"
                )}
                style={{ backgroundColor }}
            >
                {initials}
            </div>
        </div>
    );
};

export default UserAvatarDefault;
