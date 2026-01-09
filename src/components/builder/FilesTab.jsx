// src/components/builder/FilesTab.jsx

import { Button } from "@/components/ui/button";
import { Upload, Trash2, FileText } from "lucide-react";

export default function FilesTab({
  files,
  setFiles,
  uploading,
  handleFilesUpload,
  fileInputRef,
}) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-white tracking-tight">
          Knowledge Files
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Upload documents to train your AI assistant.
        </p>
      </div>

      {/* Upload action */}
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.csv,.txt,.md"
          className="hidden"
          onChange={handleFilesUpload}
        />

        <Button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2"
          disabled={uploading}
        >
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading…" : "Upload Files"}
        </Button>
      </div>

      {/* Files list */}
      {files.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {files.map((file) => (
            <div
              key={file.url}
              className="flex items-center justify-between
                         rounded-xl
                         bg-[#0f0f1a]
                         border border-white/10
                         px-4 py-3
                         shadow-[0_10px_35px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="truncate text-sm text-white">
                  {file.name}
                </span>
              </div>

              <Button
                variant="ghost"
                onClick={() =>
                  setFiles((prev) =>
                    prev.filter((f) => f.url !== file.url)
                  )
                }
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">
          No files uploaded yet.
        </p>
      )}

      {/* Helper text */}
      <p className="text-xs text-gray-400">
        Supported formats: PDF, CSV, TXT, and Markdown.  
        Your AI assistant will automatically learn from the content.
      </p>
    </div>
  );
}
