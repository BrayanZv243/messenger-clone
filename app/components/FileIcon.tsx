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
    FaFileCode,
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
    | "webp"
    | "document"
    | "audio"
    | "video"
    | "text"
    | "txt"
    | "archive"
    | "jpg"
    | "png"
    | "bmp"
    | "mp4"
    | "mov"
    | "avi"
    | "mp3"
    | "wav"
    | "zip"
    | "rar"
    | "gif"
    | "code"
    | "generic";

const codeExtensions = [
    "js",
    "jar",
    "ts",
    "tsx",
    "py",
    "java",
    "cpp",
    "c",
    "cs",
    "rb",
    "go",
    "php",
    "html",
    "css",
    "scss",
    "less",
    "json",
    "xml",
    "yaml",
    "md",
    "sql",
    "sh",
    "swift",
    "m",
    "r",
    "scala",
    "kt",
    "pl",
    "groovy",
    "dockerfile",
    "makefile",
    "hs",
    "clj",
    "ex",
    "erl",
    "lua",
    "f90",
    "vhdl",
    "v",
    "awk",
    "d",
    "fs",
    "sml",
    "nim",
    "pug",
    "ejs",
    "hbs",
    "twig",
    "gql",
    "raku",
    "bicep",
];

const iconMap: Record<FileType, JSX.Element> = {
    pdf: <FaFilePdf />,
    code: <FaFileCode />,
    docx: <FaFileWord />,
    xls: <FaFileExcel />,
    pptx: <FaFilePowerpoint />,
    image: <FaFileImage />,
    webp: <FaFileImage />,
    bmp: <FaFileImage />,
    document: <FaFileAlt />,
    audio: <FaFileAudio />,
    video: <FaFileVideo />,
    text: <AiOutlineFileText />,
    txt: <AiOutlineFileText />,
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
    if (["jpg", "png", "gif", "svg", "jpeg"].includes(type)) return "image";
    if (["mp4", "mov", "avi", "mkv"].includes(type)) return "video";
    if (["mp3", "wav"].includes(type)) return "audio";
    if (["zip", "rar"].includes(type)) return "archive";
    if (codeExtensions.includes(type)) return "code";
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
    const myType = getFileType(type);
    let IconComponent = iconMap[myType];
    if (!IconComponent) IconComponent = iconMap["generic"];
    return React.cloneElement(IconComponent, { className });
};

export const is_Image = (format: string): boolean => {
    const imageFormats = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    return imageFormats.includes(format.toLowerCase());
};

export const truncateFileName = (
    name: string,
    format?: string,
    max: number = 20
): string => {
    if (name.length > max) {
        name = `${name.substring(0, max)}...`;
    }
    if (!format) return name;

    const fullFilename = `${name}.${format}`;

    return fullFilename;
};

export default FileIcon;
