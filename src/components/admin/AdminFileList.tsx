"use client";

import { useState } from "react";
import { getSignedFileUrl } from "@/server/admin-mutations";
import { formatBytes } from "@/lib/format-bytes";
import type { StoredFileMeta } from "@/types/enquiry";
import { AlertIcon } from "@/components/enquiry/icons";

export function AdminFileList({ files }: { files: StoredFileMeta[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleView(file: StoredFileMeta) {
    setError(null);
    setLoadingId(file.id);
    const result = await getSignedFileUrl(file.path);
    setLoadingId(null);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    window.open(result.url, "_blank", "noopener,noreferrer");
  }

  if (files.length === 0) {
    return <p className="text-sm text-muted">No files uploaded.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col gap-2">
        {files.map((file) => (
          <li
            key={file.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
          >
            <span className="min-w-0 truncate">
              {file.name}{" "}
              <span className="text-muted">
                ({file.type.replace("image/", "").toUpperCase()}, {formatBytes(file.size)})
              </span>
            </span>
            <button
              type="button"
              onClick={() => handleView(file)}
              disabled={loadingId === file.id}
              className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-accent underline-offset-2 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            >
              {loadingId === file.id ? "Opening…" : "View"}
            </button>
          </li>
        ))}
      </ul>
      {error && (
        <p role="alert" className="flex items-center gap-1.5 text-xs text-danger">
          <AlertIcon className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
