"use client";

import { useEffect, useState } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { TextareaAutosize } from "@mui/material";

interface MessageInputProps {
    id: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
    maxLength?: number;
    errors: FieldErrors;
    resetCharCount: boolean;
    register: UseFormRegister<FieldValues>;
}

const MessageInput = ({
    id,
    placeholder,
    type,
    required,
    maxLength,
    resetCharCount,
    register,
}: MessageInputProps) => {
    const [charCount, setCharCount] = useState(0);
    const [showWarning, setShowWarning] = useState(false);

    const handleChange = (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        const { value } = event.target;
        setCharCount(value.length);
        setShowWarning(maxLength ? value.length >= maxLength : false);
    };

    useEffect(() => {
        if (resetCharCount) {
            setCharCount(0); // Resetear el contador de caracteres
        }
    }, [resetCharCount]);

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        if (event.key === "Enter" && !event.shiftKey) {
            setCharCount(0);
            event.preventDefault();
            const form = event.currentTarget.closest("form");
            if (form?.requestSubmit) {
                let submitButton = form.querySelector(
                    "#btn-send"
                ) as HTMLElement;
                let textArea = form.querySelector("#" + id) as HTMLElement;
                if (submitButton) {
                    submitButton.focus();
                    submitButton.click();
                    textArea.focus();
                }
            }
        }
    };

    if (type === "textarea") {
        return (
            <div className="relative w-full">
                <TextareaAutosize
                    id={id}
                    autoComplete={id}
                    {...register(id, { required })}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    className="text-black h-6 font-light py-2 px-4 bg-neutral-100 w-full rounded-md focus:outline-none resize-none mt-2 max-h-96"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                />
                {maxLength && (
                    <div className="text-xs text-gray-500 -mt-1" id="charCount">
                        {charCount}/{maxLength} characters
                        {showWarning && (
                            <span className="text-red-500 ml-2">
                                Maximum length reached
                            </span>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative w-full">
            <input
                id={id}
                type={type}
                autoComplete={id}
                {...register(id, { required })}
                placeholder={placeholder}
                maxLength={maxLength}
                className="text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

export default MessageInput;
