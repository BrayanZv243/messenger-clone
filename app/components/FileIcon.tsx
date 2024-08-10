"use client";

import React from "react";
import {
    FaFilePdf,
    FaFileWord,
    FaFileExcel,
    FaFilePowerpoint,
    FaFileImage,
    FaFileAudio,
    FaFileVideo,
    FaFileArchive,
} from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";
import { AiOutlineFileText, AiOutlineFile } from "react-icons/ai";
import { BsFiletypeGif } from "react-icons/bs";

export type FileType =
    | "pdf"
    | "docx"
    | "xls"
    | "pptx"
    | "image"
    | "document"
    | "audio"
    | "video"
    | "text"
    | "archive"
    | "jpg"
    | "png"
    | "mp4"
    | "mov"
    | "avi"
    | "mp3"
    | "wav"
    | "zip"
    | "rar"
    | "gif"
    | "generic";

const iconMap: Record<FileType, JSX.Element> = {
    pdf: <FaFilePdf />,
    docx: <FaFileWord />,
    xls: <FaFileExcel />,
    pptx: <FaFilePowerpoint />,
    image: <FaFileImage />,
    document: <FaFileAlt />,
    audio: <FaFileAudio />,
    video: <FaFileVideo />,
    text: <AiOutlineFileText />,
    archive: <FaFileArchive />,
    jpg: <FaFileImage />,
    png: <FaFileImage />,
    mp4: <FaFileVideo />,
    mov: <FaFileVideo />,
    avi: <FaFileVideo />,
    mp3: <FaFileAudio />,
    wav: <FaFileAudio />,
    zip: <FaFileArchive />,
    rar: <FaFileArchive />,
    gif: <BsFiletypeGif />,
    generic: <AiOutlineFile />,
};

const getFileType = (type: FileType): FileType => {
    if (["jpg", "png", "gif"].includes(type)) return "image";
    if (["mp4", "mov", "avi"].includes(type)) return "video";
    if (["mp3", "wav"].includes(type)) return "audio";
    if (["zip", "rar"].includes(type)) return "archive";
    return type;
};

interface FileIconProps {
    type?: FileType;
    className?: string;
}

const FileIcon: React.FC<FileIconProps> = ({
    type = "generic",
    className = "",
}) => {
    const generalType = getFileType(type);
    const IconComponent = iconMap[generalType];
    return React.cloneElement(IconComponent, { className });
};

export const is_Image = (format: string): boolean => {
    const imageFormats = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    return imageFormats.includes(format.toLowerCase());
};

export default FileIcon;
