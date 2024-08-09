"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ModalImage from "@/app/components/Modal-Image";

interface ImageModalProps {
    src?: string | null;
    isOpen?: boolean;
    onClose: () => void;
}

const ImageModal = ({ src, isOpen, onClose }: ImageModalProps) => {
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (src) {
            const img = new window.Image();
            img.src = src;
            img.onload = () => {
                setImageSize({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                });
            };
        }
    }, [src]);

    if (!src) return null;

    return (
        <ModalImage isOpen={isOpen} onClose={onClose}>
            <Image
                alt="Image"
                className={`object-cover md:max-w-xl lg:max-w-xl xl:max-w-2xl 2xl:max-w-7xl`}
                width={imageSize.width}
                height={imageSize.height}
                src={src}
            />
        </ModalImage>
    );
};

export default ImageModal;
