import axios from "axios";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdCheckCircle, MdCloudUpload, MdClose, MdInsertDriveFile } from "react-icons/md";
import { v4 as uuid } from "uuid";
import { Progress } from "./ui/progress"
import { useIsFile } from "../hooks/useIsFile";
import { useThemeStore } from "../stores/useThemeStore";
import { useUploadAndDownloadLock } from "../stores/useUploadAndDownloadLock";
import { toast } from 'sonner'

type UploadProps = {
  setUploadDone: React.Dispatch<React.SetStateAction<boolean>>
}

const Upload = ({ setUploadDone }: UploadProps) => {
  const { checkFile } = useIsFile()
  const {setIsUploadindOrDownloading} = useUploadAndDownloadLock()
  const {theme} = useThemeStore()
  const [chunkSize, setChunk] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const getChunkSize = async () => {
    try {
      const response: any = await axios.get("http://localhost:5000/file/chunk_size");
      setChunk(response.data.chunk_size);
    } catch (e) {
      console.error(e);
      setUploadError("Failed to get chunk size from server");
    }
  };

  useEffect(() => {
    getChunkSize();
  }, []);

  const handleFileUpload = async (file: File) => {
    if (isUploading) return;
    
    setIsUploading(true);
    setIsUploadindOrDownloading(true)
    setUploadError(null);
    
    try {
      const crypto = window.crypto.subtle;
      const size = file.size;
      const sliceSize = 64 * 1024;

      const middle = file.slice(Math.floor(size / 2), Math.floor(size / 2) + sliceSize);
      const buf = await middle.arrayBuffer();
      const hashBuffer = await crypto.digest("SHA-1", buf);

      const hexString = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const fileId = `${size}x${hexString}`;
      console.log("fileId:", fileId);

      await handleFileChange(file, fileId);
    } catch (e) {
      console.error(e);
      setUploadError("Upload failed. Please try again.");
      setIsUploading(false);
      setIsUploadindOrDownloading(false)
    }
  };

  const handleFileChange = async (file: File, fileId: string) => {
    const isFile = await checkFile(fileId)
    if (isFile) {
      setUploadError("File already exists");
      setIsUploading(false)
      setIsUploadindOrDownloading(false)
      return 
    }

    setUploadDone(false);
    let start = 0, index = 0;
    let uploadedBytes = 0;
    const totalSize = file.size;

    try {
      while (start < file.size) {
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append("fileName", file.name);
        formData.append("fileId", fileId);
        formData.append("fileSize", file.size.toString());
        formData.append("unique_chunk_id", uuid());
        formData.append("chunkIndex", index.toString());
        formData.append("splitSize", chunkSize.toString());
        formData.append("chunkSize", chunk.size.toString());
        formData.append("chunk", chunk);

        await axios.post("http://localhost:5000/file/upload", formData, {
          withCredentials: true,
          onUploadProgress: (event: any) => {
            if (event.total) {
              const chunkProgress = event.loaded;
              const overall = uploadedBytes + chunkProgress;
              const percent = Math.round((overall / totalSize) * 100);
              setProgress(percent);
            }
          },
        });

        uploadedBytes += chunk.size;
        start = end;
        index++;
      }

      setProgress(100);
      setTimeout(() => {
        setProgress(0);
        setUploadDone(true);
        setSelectedFile(null);
        setIsUploading(false);
      }, 1000);
      
    } catch (error) {
      setUploadError("Upload failed. Please try again.");
      setProgress(0);
      setIsUploading(false);
    } finally {
      toast.success("Upload process completed.")
      setIsUploadindOrDownloading(false)
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setProgress(0);
    setUploadError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      setSelectedFile(files[0] || null);
      setUploadError(null);
    },
    multiple: false,
  });

  return (
    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
      <div className={`${theme === 'dark' && 'bg-gray-900 border-gray-900'} bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden`}>
        <div className={` ${theme === 'dark' ? 'bg-gray-900 border-gray-900 border-b text-gray-200' : 'bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100 text-gray-900'} p-6 sm:p-8`}>
          <h2 className="text-2xl sm:text-3xl font-bold text-start">
            Upload Your File
          </h2>
          <p className="text-gray-600 text-start mt-2">
            Secure, encrypted file storage with chunked upload
          </p>
        </div>

        <div className={`p-6 sm:p-8 lg:p-12 ${theme === 'dark' && 'bg-gray-800 border-gray-900'}`}>
          <div
            {...getRootProps()}
            className={`${theme === 'dark' && 'bg-gray-800 border-gray-900'} relative border-2 border-dashed rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-blue-400 bg-blue-50 scale-[1.02]'
                : selectedFile
                ? `${theme === "dark" ? "bg-green-900/20 border-green-950": "border-green-300 bg-green-50"}`
                : `${theme === 'dark' && 'hover:bg-gray-900 hover:border-gray-900'} border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100`
            }`}
          >
            <input {...getInputProps()} />

            {!selectedFile ? (
              // Upload State
              <div className="space-y-4 sm:space-y-6">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center mx-auto shadow-lg transition-all duration-300 ${
                  isDragActive 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-blue-500/30 scale-110' 
                    : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/25'
                }`}>
                  <MdCloudUpload size={window.innerWidth < 640 ? 24 : 32} className="text-white" />
                </div>
                
                <div className="space-y-2">
                  <h3 className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} text-lg sm:text-xl lg:text-2xl font-semibold `}>
                    {isDragActive ? 'Drop your file here!' : 'Drop your file here'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    or <span className="text-blue-600 font-medium hover:text-blue-700 transition-colors">browse</span> to choose a file
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                  <div className={`flex flex-col items-center p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                    <span className="font-medium">Max Size</span>
                    <span>Unlimited</span>
                  </div>
                  <div className={`flex flex-col items-center p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                    <span className="font-medium">Security</span>
                    <span>Encrypted</span>
                  </div>
                 <div className={`flex flex-col items-center p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                    <span className="font-medium">Upload</span>
                    <span>Chunked</span>
                  </div>
                </div>
              </div>
            ) : (
              // File Selected State
              <div className="space-y-4 sm:space-y-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-green-500/25 animate-pulse">
                  <MdCheckCircle size={window.innerWidth < 640 ? 24 : 32} className="text-white" />
                </div>
                
                <div className="space-y-3">
                  <h3 className={`text-lg sm:text-xl lg:text-2xl font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                    File Ready to Upload
                  </h3>
                  
                  {/* File Details Card */}
                  <div className={`${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-white border-gray-100"} rounded-2xl p-4 sm:p-6 shadow-sm border  max-w-md mx-auto`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 bg-gradient-to-br ${theme === "dark" ? "from-gray-700 to gray-100" : "from-gray-100 to-gray-200"}  rounded-lg flex items-center justify-center`}>
                          <MdInsertDriveFile size={20} className="text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${theme === "dark" ? "text-gray-100" : "text-gray-900"}  truncate text-sm sm:text-base`} title={selectedFile.name}>
                            {selectedFile.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        className={`w-8 h-8 ${theme === "dark" ? "bg-gradient-to-br from-gray-700 to gray-100 text-white hover:bg-red-800 hover:text-red-100" : "bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600"} rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0`}
                        title="Remove file"
                      >
                        <MdClose size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {progress > 0 && !uploadError && (
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Uploading...</span>
                <span className="font-medium text-gray-900">{progress}%</span>
              </div>
              <Progress 
                value={progress} 
                className={`h-2 sm:h-3 bg-gray-200 transition-all duration-300 ${
                  progress < 30 ? '[&>div]:bg-red-500' : 
                  progress < 70 ? '[&>div]:bg-yellow-500' : 
                  '[&>div]:bg-green-500'
                }`} 
              />
              <p className="text-xs text-gray-500 text-center">
                This may take a few moments for large files
              </p>
            </div>
          )}
           </div>

          {/* Error Message */}
          {uploadError && (
            <div className={`px-6 sm:px-8 lg:px-12 pb-6 sm:pb-8 ${theme === "dark" ? "bg-gray-800 border-0" : "bg-white"}`}>
              <div className={`flex items-center justify-between ${theme  === "dark" ? "bg-red-800/20 border-red-800 " : "bg-red-50 border border-red-200"}  rounded-xl p-4`}>
                <p className="text-red-700 text-sm font-medium">{uploadError}</p>
                <button
                  onClick={() => setUploadError(null)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <MdClose size={16} />
                </button>
              </div>
            </div>
          )}
      
        {/* Upload Button */}
        {selectedFile && !isUploading && (
          <div className={`px-6 sm:px-8 lg:px-12 pb-6 sm:pb-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <button
              onClick={() => handleFileUpload(selectedFile)}
              disabled={isUploading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 sm:py-5 px-8 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-[1.02] disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center space-x-3 text-sm sm:text-base"
            >
              <MdCloudUpload size={20} />
              <span>{isUploading ? 'Uploading...' : 'Start Upload'}</span>
            </button>
          </div>
        )}

        {/* Upload Complete State */}
        {progress === 100 && !uploadError && (
          <div className={`px-6 sm:px-8 lg:px-12 pb-6 sm:pb-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-green-700">
                <MdCheckCircle size={20} />
                <span className="font-medium">Upload Complete!</span>
              </div>
              <p className="text-green-600 text-sm mt-1">
                Your file has been encrypted and stored securely
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;