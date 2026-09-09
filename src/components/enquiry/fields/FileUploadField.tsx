"use client";

import { useRef, type ReactNode } from "react";
import { FieldShell } from "./FieldShell";
import { UploadIcon } from "../icons";
import { Button } from "@/components/Button";
import { formatBytes } from "@/lib/format-bytes";
import { FILE_UPLOAD_FALLBACK_NOTE } from "@/data/enquiry-schema";
import type { UploadedFileMeta } from "@/types/enquiry";

interface FileUploadFieldProps {
  id: string;
  label: ReactNode;
  required?: boolean;
  helpText?: string;
  error?: string;
  files: UploadedFileMeta[];
  onChange: (files: UploadedFileMeta[]) => void;
  /**
   * Called with the full, current list of raw File blobs (same order/ids
   * as `files`) whenever the selection changes. The metadata in `files`
   * is what lives in EnquiryData (JSON-serialisable); the actual bytes
   * are kept here and in the parent's blob map only, for upload at
   * submission time.
   */
  onRawFilesChange: (files: File[]) => void;
}

export function FileUploadField({
  id,
  label,
  required,
  helpText,
  error,
  files,
  onChange,
  onRawFilesChange,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const rawFilesById = useRef<Map<string, File>>(new Map());

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const additions: UploadedFileMeta[] = Array.from(list).map((file) => {
      const fileId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${file.name}-${file.size}-${Date.now()}`;
      rawFilesById.current.set(fileId, file);
      return { id: fileId, name: file.name, size: file.size, type: file.type };
    });
    const nextFiles = [...files, ...additions];
    onChange(nextFiles);
    onRawFilesChange(nextFiles.map((meta) => rawFilesById.current.get(meta.id)!));
  }

  function removeFile(fileId: string) {
    rawFilesById.current.delete(fileId);
    const nextFiles = files.filter((file) => file.id !== fileId);
    onChange(nextFiles);
    onRawFilesChange(nextFiles.map((meta) => rawFilesById.current.get(meta.id)!));
  }

  return (
    <FieldShell label={label} required={required} helpText={helpText} error={error} htmlFor={id}>
      {({ describedBy }) => (
        <div className="flex flex-col gap-3">
          <div
            className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-card-border bg-card px-6 py-8 text-center transition-colors duration-150 hover:border-foreground/30"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              addFiles(event.dataTransfer.files);
            }}
          >
            <UploadIcon className="h-6 w-6 text-muted" />
            <p className="text-sm text-muted">Drag files here, or</p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
            >
              Choose files
            </Button>
            <input
              ref={inputRef}
              id={id}
              name={id}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="sr-only"
              aria-describedby={describedBy}
              onChange={(event) => {
                addFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </div>

          {files.length > 0 && (
            <ul className="flex flex-col gap-2">
              {files.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-card-border bg-card px-3 py-2 text-sm"
                >
                  <span className="truncate">
                    {file.name}{" "}
                    <span className="text-muted">({formatBytes(file.size)})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="shrink-0 rounded-md px-2 py-1 text-muted transition-colors duration-150 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Remove ${file.name}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="text-xs text-muted">{FILE_UPLOAD_FALLBACK_NOTE}</p>
        </div>
      )}
    </FieldShell>
  );
}
