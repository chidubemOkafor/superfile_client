import axios from "axios"
import {useEffect, useState} from "react"
import { 
    MdDownload, 
    MdInsertDriveFile, 
    MdOutlineDelete,
} from "react-icons/md";
import { formatFileSize } from "../utils/formatFileSize";
import { getStatusColor } from "../utils/colorStatus";
import { getFileTypeBadge, getFileTypeInfo } from "../utils/fileType";
import { getFileExtension } from "../utils/getFileExtention";
import { DeleteDialog } from "./DeleteDialog";
import { useThemeStore } from "../stores/useThemeStore";
import { useToggleActive } from "../stores/useToggleActive";
import { useUploadAndDownloadLock } from "../stores/useUploadAndDownloadLock";
import streamSaver from "streamsaver"
import { toast } from "sonner";

const YourFiles: React.FC<{
  uploadDone: boolean
}> = ({ uploadDone }) => {
    const {theme} = useThemeStore()
    const {active} = useToggleActive()
    const {setIsUploadindOrDownloading} = useUploadAndDownloadLock()
    const [files, setFiles] = useState([])
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [downloading, setDownloading] = useState<string | null>(null)
    
    const getFile = async() => {
        try {
            const response = await axios.get("http://localhost:5000/file/files", {
                withCredentials: true,
            })
            console.log(response)
            setFiles(response.data.files)
        } catch (error) {
            console.error(error)
        }
    }

    const downloadFile = async (fileId: string, fileName: string) => {
        setDownloading(fileId)
        setIsUploadindOrDownloading(true)

        try {
            const response = await fetch(`http://localhost:5000/file/download?fileId=${fileId}`, {
                credentials: "include",
            })

            const contentLength = response.headers.get("content-length")

            if (contentLength) {
                console.log("File size (bytes):", contentLength)
                console.log("File size (MB):", (Number(contentLength) / (1024*1024)).toFixed(2))
            } else {
                console.log("No content-length header provided")
            }

            if (!response.ok || !response.body) {
                throw new Error(`Failed to download: ${response.statusText}`)
            }

            const fileStream = streamSaver.createWriteStream(fileName, {
                size: Number(contentLength)
            })

            const writer = fileStream.getWriter()
            const reader = response.body.getReader()

            const pump = async (): Promise<void> => {
                const { done, value } = await reader.read()
                if (done) {
                    writer.close()
                    return
                }
                await writer.write(value)
                return pump()
            }

            await pump()
        } catch (error) {
            console.error("Download failed:", error)
        } finally {
            toast.success("Download process completed.")
            setIsUploadindOrDownloading(false)
            setDownloading(null)
        }
    }

    const deleteFile = async () => {
        if (!selectedFileId) return
        setIsUploadindOrDownloading(true)
        setDeleting(true)
        try {
            await axios.delete(`http://localhost:5000/file/delete?fileId=${selectedFileId}`, {
                withCredentials: true,
            })
        
            console.log("deleted")
            setFiles(prevFiles => prevFiles.filter((f: any) => f.metadata.file_id !== selectedFileId))
        } catch (error) {
            console.error(error)
        } finally {
            setDeleting(false)
            setIsUploadindOrDownloading(false)
            setDeleteDialogOpen(false)
            setSelectedFileId(null)
        }
    }

    const openDeleteDialog = (fileId: string) => {
        setSelectedFileId(fileId)
        setDeleteDialogOpen(true)
    }

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false)
        setSelectedFileId(null)
    }

    useEffect(() => {
        console.log("toggled")
    }, [active])

    useEffect(() => {
        getFile()
    }, [uploadDone, active])

    return (
        <div className={`${theme === 'dark' && 'bg-gray-900 border-gray-900'} bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden`}>
            <div className={` ${theme === 'dark' ? 'bg-gray-900 border-gray-900 border-b text-gray-200' : 'bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100 text-gray-900'} p-6 sm:p-8`}>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                    Your Files
                </h2>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Manage and download your uploaded files
                </p>
            </div>

            <div className={`p-4 sm:p-6 lg:p-8 ${theme === 'dark' && 'bg-gray-800 border-gray-900'}`}>
                <div className="space-y-3 sm:space-y-4">
                    {files.map((file: any) => {
                        const fileTypeInfo = getFileTypeInfo(file.metadata.file_name);
                        const IconComponent = fileTypeInfo.icon;
                        const isDownloading = downloading === file.metadata.file_id;
                        
                        return (
                            <div 
                                key={file.metadata.file_id} 
                                className={`${theme === "dark" ? "bg-gray-900 border-gray-800 hover:bg-gray-900/80" : "bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300"}  rounded-xl sm:rounded-2xl border transition-all duration-200 p-3 sm:p-4`}
                            >
                                <div className="hidden lg:flex items-center justify-between">
                                    <div className="flex items-center space-x-4 flex-1">
                                        <div className={`
                                            w-12 h-12 bg-gradient-to-br ${fileTypeInfo.bgColor} 
                                            rounded-xl flex items-center justify-center text-white 
                                            shadow-lg ${fileTypeInfo.shadowColor}
                                        `}>
                                            <IconComponent size={22} />
                                        </div>
                                    
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-900"} truncate text-lg`} title={file.metadata.file_name}>
                                                {file.metadata.file_name.length >30 
                                                    ? file.metadata.file_name.slice(0, 27) + "..."
                                                    : file.metadata.file_name
                                                }
                                            </h3>
                                            <div className="flex items-center space-x-3 mt-1">
                                                <p className="text-sm text-gray-500">
                                                    {formatFileSize(file.metadata.file_size)}
                                                </p>
                                                <div className={`w-1 h-1 ${theme === "dark" ? "bg-gray-600 " : "bg-gray-300 "}rounded-full`} />
                                                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getFileTypeBadge(fileTypeInfo.type)}`}>
                                                    {getFileExtension(file.metadata.file_name).toUpperCase() || 'FILE'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm ${getStatusColor(file.metadata.status)}`}>
                                            <span className="capitalize">{file.metadata.status}</span>
                                        </div>
                                        
                                        <div className="flex items-center space-x-1">
                                            <button
                                                onClick={() => downloadFile(file.metadata.file_id, file.metadata.file_name)}
                                                disabled={isDownloading}
                                                className={`w-10 h-10 ${theme === "dark" ? "bg-gradient-to-br from-gray-700 to gray-100 text-white hover:bg-blue-800 hover:text-red-100" : "bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-200 hover:text-blue-600 text-gray-600"} rounded-xl flex items-center justify-center  transition-all duration-200 shadow-sm `}
                                                title="Download file"
                                            >
                                                {isDownloading ? (
                                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <MdDownload size={18} />
                                                )}
                                            </button>

                                            <button
                                                onClick={() => openDeleteDialog(file.metadata.file_id)}
                                                className={`w-10 h-10 ${theme === "dark" ? "bg-gradient-to-br from-gray-700 to gray-100 text-white hover:bg-red-800 hover:text-red-100" : "bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 hover:text-red-600 text-gray-600"}  rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm`}
                                                title="Delete file"
                                            >
                                                <MdOutlineDelete size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:hidden">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                                            <div className={`
                                                w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${fileTypeInfo.bgColor} 
                                                rounded-lg sm:rounded-xl flex items-center justify-center text-white 
                                                shadow-lg ${fileTypeInfo.shadowColor}
                                            `}>
                                                <IconComponent size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-900"} truncate text-sm sm:text-base`} title={file.metadata.file_name}>
                                                    {file.metadata.file_name.length > 25 
                                                        ? file.metadata.file_name.slice(0, 25) + "..."
                                                        : file.metadata.file_name
                                                    }
                                                </h3>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <p className="text-xs sm:text-sm text-gray-500">
                                                        {formatFileSize(file.metadata.file_size)}
                                                    </p>
                                                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                                                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getFileTypeBadge(fileTypeInfo.type)}`}>
                                                        {getFileExtension(file.metadata.file_name).toUpperCase() || 'FILE'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm ${getStatusColor(file.metadata.status)} flex-shrink-0 ml-2`}>
                                            <span className="capitalize">{file.metadata.status}</span>
                                        </div>
                                    </div>

                                    {/* Bottom Row - Action Buttons */}
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => downloadFile(file.metadata.file_id, file.metadata.file_name)}
                                            disabled={isDownloading}
                                            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 ${theme === "dark" ? "bg-gradient-to-br from-gray-700 to gray-100 text-white hover:bg-blue-800 hover:text-red-100" : "bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-200 text-gray-600 hover:text-blue-600"} rounded-lg transition-all duration-200 shadow-sm text-sm`}
                                        >
                                            {isDownloading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                                    <span>Downloading...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <MdDownload size={16} />
                                                    <span className="hidden sm:inline">Download</span>
                                                </>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => openDeleteDialog(file.metadata.file_id)}
                                            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 ${theme === "dark" ? "bg-gradient-to-br from-gray-700 to gray-100 text-white hover:bg-red-800 hover:text-red-100" : "bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-600 hover:text-red-600"} rounded-lg transition-all duration-200 shadow-sm text-sm`}
                                        >
                                            <MdOutlineDelete size={16} />
                                            <span className="hidden sm:inline">Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {files.length === 0 && (
                    <div className="text-center py-8 sm:py-12 lg:py-16">
                        <div className={`${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-gray-100 to-gray-200'} w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg`}>
                            <MdInsertDriveFile size={window.innerWidth < 640 ? 20 : 24} className="text-gray-500" />
                        </div>
                        <h3 className={`text-base sm:text-lg lg:text-xl font-medium mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>No files yet</h3>
                        <p className="text-gray-500 text-sm sm:text-base">Upload your first file to get started</p>
                    </div>
                )}
            </div>

            <DeleteDialog
                open={deleteDialogOpen}
                onOpenChange={closeDeleteDialog}
                onConfirm={deleteFile}
                isDeleting={deleting}
            />
        </div>
    )
}

export default YourFiles
