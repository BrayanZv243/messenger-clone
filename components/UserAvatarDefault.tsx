"use client";

import { getInitialsColor } from "@/app/actions/getRandomColorUserAvatar";

interface UserProps {
    name: string;
}

const UserAvatarDefault = ({ name }: UserProps) => {
    const { backgroundColor, initials } = getInitialsColor(name);

    return (
        <div className="flex items-center">
            <div
                className="w-10 h-10 flex items-center justify-center rounded-full text-white text-lg font-bold"
                style={{ backgroundColor }}
            >
                {initials}
            </div>
        </div>
    );
};

export default UserAvatarDefault;
