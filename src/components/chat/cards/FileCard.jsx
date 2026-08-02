import {
  Download,
  FileText,
  FileSpreadsheet,
  FileArchive,
  FileImage,
  File,
} from "lucide-react";

import { useTheme } from "../common/ThemeProvider";

/*
========================================
GET FILE ICON
========================================
*/

function getFileIcon(type = "") {
  const value = type.toLowerCase();

  if (value.includes("pdf")) return FileText;

  if (
    value.includes("sheet") ||
    value.includes("excel") ||
    value.includes("csv") ||
    value.includes("xlsx")
  ) {
    return FileSpreadsheet;
  }

  if (
    value.includes("zip") ||
    value.includes("rar")
  ) {
    return FileArchive;
  }

  if (
    value.includes("image") ||
    value.includes("png") ||
    value.includes("jpg") ||
    value.includes("jpeg")
  ) {
    return FileImage;
  }

  return File;
}

/*
========================================
FILE CARD
========================================
*/

export default function FileCard({
  fileName = "Attachment",
  fileType = "",
  fileSize = "",
  downloadUrl = "",
}) {
  const theme = useTheme();

  const Icon =
    getFileIcon(fileType);

  return (
    <div
      className="
        w-full

        rounded-3xl

        border

        bg-white

        p-5

        shadow-sm
      "
      style={{
        borderColor: theme.border,
      }}
    >
      <div className="flex items-center gap-4">

        <div
          className="
            flex

            h-12
            w-12

            items-center
            justify-center

            rounded-2xl
          "
          style={{
            background:
              theme.primarySoft,
          }}
        >
          <Icon
            size={22}
            color={theme.primary}
          />
        </div>

        <div className="min-w-0 flex-1">

          <h3
            className="
              truncate

              text-sm

              font-semibold
            "
            style={{
              color: theme.text,
            }}
          >
            {fileName}
          </h3>

          <p
            className="
              mt-1

              text-xs
            "
            style={{
              color: theme.muted,
            }}
          >
            {[fileType, fileSize]
              .filter(Boolean)
              .join(" • ")}
          </p>

        </div>

      </div>

      {downloadUrl && (

        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            mt-5

            inline-flex

            w-full

            items-center
            justify-center
            gap-2

            rounded-2xl

            px-4
            py-3

            font-medium

            transition-all
            duration-200
          "
          style={{
            background:
              theme.primary,
            color: "#FFFFFF",
          }}
        >
          <Download size={18} />

          <span>
            Download File
          </span>

        </a>

      )}

    </div>
  );
}