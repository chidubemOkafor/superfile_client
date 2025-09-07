"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { MdWarning, MdDelete } from "react-icons/md"

interface DeleteDialogProps {
  onConfirm: () => void | Promise<void>
  open: boolean
  onOpenChange: (open: boolean) => void
  isDeleting?: boolean
}

export function DeleteDialog({
  onConfirm,
  open,
  onOpenChange,
  isDeleting = false,
}: DeleteDialogProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <MdWarning className="text-red-600" size={24} />
          </div>
          
          <DialogTitle className="text-center">
            Delete File?
          </DialogTitle>
          <DialogDescription className="text-center">
            This action cannot be undone. The file will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center gap-3 mt-6">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deleting...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <MdDelete size={16} />
                <span>Delete</span>
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}