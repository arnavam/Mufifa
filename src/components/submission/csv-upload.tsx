'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { UploadCloud, File, X, Loader2 } from 'lucide-react'

interface CsvUploadProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
}

export function CsvUpload({ onFileSelect, isUploading = false }: CsvUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      toast.error("Please upload a valid CSV file.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should not exceed 5MB.")
      return
    }
    setSelectedFile(file)
    onFileSelect(file)
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-colors
            ${dragActive ? 'border-accent bg-accent/10' : 'border-border bg-card/50 hover:bg-card/80'}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleChange}
            disabled={isUploading}
          />
          <div className="flex flex-col items-center justify-center pt-5 pb-6 cursor-pointer">
            <UploadCloud className={`w-10 h-10 mb-3 ${dragActive ? 'text-accent' : 'text-muted-foreground'}`} />
            <p className="mb-2 text-sm text-foreground font-semibold">
              <span className="text-accent">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">CSV (MAX. 5MB)</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 border border-accent/30 rounded-lg bg-card/60 backdrop-blur-sm neon-border-green">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/10 rounded-full">
              <File className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-accent" />
            ) : (
              <Button variant="ghost" size="icon" onClick={removeFile} className="text-muted-foreground hover:text-destructive">
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
