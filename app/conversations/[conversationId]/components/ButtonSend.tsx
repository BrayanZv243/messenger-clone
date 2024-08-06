"use client";

import React from "react";
import { HiPaperAirplane } from "react-icons/hi2";

interface ButtonSend {
    size?: number;
    className?: string;
    type?: "submit" | "button" | "reset";
}

const ButtonSend = ({ size, className }: ButtonSend) => {
    return (
        <button
            type="submit"
            className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
        >
            <HiPaperAirplane size={size} className={className} />
        </button>
    );
};

export default ButtonSend;
