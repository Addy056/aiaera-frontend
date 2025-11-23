// src/components/builder/FilesTab.jsx

import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";

export default function FilesTab({
  files,
  setFiles,
  uploading,
  handleFilesUpload,
  fileInputRef,
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Files</h2>

      {/* Upload Section */}
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
        >
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload Files"}
        </Button>
      </div>

      {/* Files List */}
      <div className="grid sm:grid-cols-2 gap-3">
        {files.length > 0 ? (
          files.map((file) => (
            <div
              key={file.url}
              className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-4 py-3 shadow-lg"
            >
              <div className="truncate text-sm text-white">{file.name}</div>

              <Button
                variant="ghost"
                className="text-red-300 hover:text-red-200"
                onClick={() =>
                  setFiles((prev) => prev.filter((f) => f.url !== file.url))
                }
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No files uploaded yet.</p>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-2">
        You can upload PDF, CSV, TXT, and Markdown files.  
        Your AI assistant will automatically learn from them.
      </p>
    </div>
  );
}
