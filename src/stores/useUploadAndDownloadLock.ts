import { create } from "zustand";

interface IUseUploadAndDownloadLock {
    isUploadindOrDownloadin: boolean,
    setIsUploadindOrDownloading: (value: boolean) => void
}

export const useUploadAndDownloadLock = create<IUseUploadAndDownloadLock>((set) => ({
    isUploadindOrDownloadin: false,
    setIsUploadindOrDownloading: (value) => set({
        isUploadindOrDownloadin: value
    })
}))