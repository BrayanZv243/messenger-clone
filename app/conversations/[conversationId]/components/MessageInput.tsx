"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
    id: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
    errors: FieldErrors;
    register: UseFormRegister<FieldValues>;
}

const MessageInput = ({
    id,
    placeholder,
    type,
    required,
    errors,
    register,
}: MessageInputProps) => {
    return (
        <div className="relative w-full">
            <input
                id={id}
                type={type}
                autoComplete={id}
                {...register(id, { required })}
                placeholder={placeholder}
                className="text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none"
            />
        </div>
    );
};

export default MessageInput;
