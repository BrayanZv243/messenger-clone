"use client";

import React, { useState } from "react";
import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPhoto } from "react-icons/hi2";
import { CldUploadButton } from "next-cloudinary";
import MessageInput from "./MessageInput";
import ButtonSend from "./ButtonSend";
import { IoTrash } from "react-icons/io5";
import { Hint } from "@/app/components/Hint";
import Image from "next/image";

const Form = () => {
    const { conversationId } = useConversation();
    const [imageData, setImageData] = useState<string | null>(null);
    const [filename, setFilename] = useState("");
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            message: "",
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue("message", "", { shouldValidate: true });

        if (imageData) {
            axios.post("/api/messages", {
                image: imageData,
                conversationId,
            });
            setImageData(null);
        }
        if (data.message) {
            axios.post("/api/messages", {
                ...data,
                conversationId,
            });
        }
    };

    const handleUpload = (result: any) => {
        const originalName: string = truncateFileName(
            result?.info.original_filename,
            result?.info.format
        );

        setFilename(originalName);
        setWidth(result?.info.width);
        setHeight(result?.info.height);
        setImageData(result?.info?.secure_url);
    };

    const truncateFileName = (name: string, format: string): string => {
        if (name.length > 20) {
            name = `${name.substring(0, 20)}...`;
        }

        const fullFilename = `${name}.${format}`;

        return fullFilename;
    };

    const deleteImage = async (publicId: string) => {
        try {
            await axios.delete("/api/delete-image", {
                data: { publicId },
            });
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    const handleDelete = () => {
        const publicId = extractPublicIdFromUrl(imageData!);
        deleteImage(publicId);
        setImageData(null);
    };

    const extractPublicIdFromUrl = (url: string) => {
        const parts = url.split("/");
        const lastPart = parts.pop()!.split(".");
        return lastPart[0];
    };

    return (
        <div className="py-4 px-4 bg-white border-t flex flex-col items-center gap-2 lg:gap-4 w-full sm:overflow-auto">
            {imageData && (
                <div className="relative w-full h-full">
                    <div className="flex flex-col items-start">
                        <div className="relative w-auto shadow-xl shadow-gray-600 rounded-lg">
                            <Hint label={filename} asChild side="top">
                                <Image
                                    src={imageData}
                                    width={width}
                                    height={height}
                                    alt="Preview"
                                    className="w-auto h-36 object-contain rounded-md bg-gray-100 border-4 border-solid border-gray-300/100"
                                />
                            </Hint>
                            <Hint label="Delete file" asChild>
                                <div className="absolute -top-2 -right-1 cursor-pointer rounded-md p-0.5 bg-gray-400/75 shadow-lg shadow-gray-600">
                                    <IoTrash
                                        className="text-red-700 hover:text-red-800 transition"
                                        onClick={handleDelete}
                                    />
                                </div>
                            </Hint>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex items-center gap-2 lg:gap-4 w-full mt-2 lg:mt-0">
                <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onSuccess={handleUpload}
                    uploadPreset="cjsiejih"
                >
                    <HiPhoto
                        size={30}
                        className="text-sky-500 hover:text-sky-600 transition"
                    />
                </CldUploadButton>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex items-center gap-2 lg:gap-4 w-full"
                >
                    {imageData ? (
                        <MessageInput
                            id="message"
                            register={register}
                            errors={errors}
                            placeholder="Write a message"
                        />
                    ) : (
                        <MessageInput
                            id="message"
                            register={register}
                            errors={errors}
                            required
                            placeholder="Write a message"
                        />
                    )}
                    <ButtonSend
                        size={18}
                        className="text-white"
                        type="submit"
                    />
                </form>
            </div>
        </div>
    );
};

export default Form;
