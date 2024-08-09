"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
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
    const router = useRouter();

    const handleClick = () => {
        if (active) return;

        setLoading(true);
        // Agregar un pequeño retraso para evitar parpadeo
        setTimeout(() => {
            if (onClick) {
                onClick();
            } else {
                router.push(href);
            }
            // Asegurarse de que el loading dure al menos 300ms
            setTimeout(() => setLoading(false), 300);
        }, 650); // Retraso inicial para mostrar el loading modal
    };

    return (
        <li>
            {loading && <ModalLoading isOpen={true} />}
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

export default DesktopItem;
