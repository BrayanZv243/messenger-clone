"use client";

import UserAvatarDefault from "@/components/UserAvatarDefault";
import { User } from "@prisma/client";
import Image from "next/image";
import useActiveList from "../hooks/useActiveList";

interface AvatarProps {
    user: User;
}

const Avatar = ({ user }: AvatarProps) => {
    const { members } = useActiveList();
    const isActive = members.indexOf(user?.email!) !== -1;

    return (
        <div className="relative rounded-full h-9 w-9 md:h-11 md:w-11">
            <div className="relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11">
                {user?.image ? (
                    <Image
                        alt="Avatar"
                        src={user?.image}
                        fill
                        className="object-contain bg-sky-200/50"
                    />
                ) : (
                    <>
                        <UserAvatarDefault name={user.name || ""} />
                        {"xd"}
                    </>
                )}
            </div>
            {isActive && (
                <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3" />
            )}
        </div>
    );
};

export default Avatar;
