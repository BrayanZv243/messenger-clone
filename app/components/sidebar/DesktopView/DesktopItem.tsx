"use client";

import React, { useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { Hint } from "../../Hint";
import ModalLoading from "../../Modal-Loading";

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
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (onClick) {
            if (label === "Logout") {
                setLoading(true);
                onClick();
            } else {
                onClick();
            }
        }
    };

    return (
        <li>
            {loading && <ModalLoading isOpen={true} />}
            <Hint label={label} side="right" align="center">
                <Link
                    href={href}
                    className={clsx(
                        `group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100`,
                        active && "bg-gray-100 text-black"
                    )}
                    onClick={handleClick}
                >
                    <Icon className="h-6 w-6 shrink-0" />
                    <span className="sr-only">{label}</span>
                </Link>
            </Hint>
        </li>
    );
};

export default DesktopItem;
