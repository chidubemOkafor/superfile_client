import {  
    MdOutlineImage,
    MdVideoFile,
    MdAudioFile,
    MdPictureAsPdf,
    MdDescription,
    MdArchive,
    MdCode,
    MdTableChart,
    MdInsertDriveFile
} from "react-icons/md";
import { getFileExtension } from "../utils/getFileExtention";

export const getFileTypeInfo = (fileName: string) => {
    const extension = getFileExtension(fileName);
    
    // Image files
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(extension)) {
        return {
            icon: MdOutlineImage,
            bgColor: 'from-purple-500 to-pink-600',
            shadowColor: 'shadow-purple-500/25',
            type: 'image'
        };
    }
    
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', '3gp'].includes(extension)) {
        return {
            icon: MdVideoFile,
            bgColor: 'from-red-500 to-orange-600',
            shadowColor: 'shadow-red-500/25',
            type: 'video'
        };
    }
    
    if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'].includes(extension)) {
        return {
            icon: MdAudioFile,
            bgColor: 'from-green-500 to-emerald-600',
            shadowColor: 'shadow-green-500/25',
            type: 'audio'
        };
    }
    
    if (extension === 'pdf') {
        return {
            icon: MdPictureAsPdf,
            bgColor: 'from-red-600 to-red-700',
            shadowColor: 'shadow-red-600/25',
            type: 'pdf'
        };
    }

    if (['doc', 'docx', 'txt', 'rtf', 'odt'].includes(extension)) {
        return {
            icon: MdDescription,
            bgColor: 'from-blue-600 to-blue-700',
            shadowColor: 'shadow-blue-600/25',
            type: 'document'
        };
    }
    
    if (['xls', 'xlsx', 'csv', 'ods'].includes(extension)) {
        return {
            icon: MdTableChart,
            bgColor: 'from-green-600 to-green-700',
            shadowColor: 'shadow-green-600/25',
            type: 'spreadsheet'
        };
    }
    
    if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(extension)) {
        return {
            icon: MdArchive,
            bgColor: 'from-yellow-500 to-orange-600',
            shadowColor: 'shadow-yellow-500/25',
            type: 'archive'
        };
    }
    
    if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'scss', 'json', 'xml', 'py', 'java', 'cpp', 'c', 'php', 'rb', 'go', 'rs'].includes(extension)) {
        return {
            icon: MdCode,
            bgColor: 'from-slate-600 to-slate-700',
            shadowColor: 'shadow-slate-600/25',
            type: 'code'
        };
    }
    
    return {
        icon: MdInsertDriveFile,
        bgColor: 'from-gray-500 to-gray-600',
        shadowColor: 'shadow-gray-500/25',
        type: 'unknown'
    };
};


export const getFileTypeBadge = (fileType: string) => {
    switch (fileType) {
        case 'image':
            return 'bg-purple-100 text-purple-700 border border-purple-200';
        case 'video':
            return 'bg-red-100 text-red-700 border border-red-200';
        case 'audio':
            return 'bg-green-100 text-green-700 border border-green-200';
        case 'pdf':
            return 'bg-red-100 text-red-800 border border-red-200';
        case 'document':
            return 'bg-blue-100 text-blue-700 border border-blue-200';
        case 'spreadsheet':
            return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
        case 'archive':
            return 'bg-orange-100 text-orange-700 border border-orange-200';
        case 'code':
            return 'bg-slate-100 text-slate-700 border border-slate-200';
        default:
            return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
};