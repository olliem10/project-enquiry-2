/**
 * Server-side upload validation for the logo/photo fields. Never trusts the
 * browser-supplied File.type — every file's magic bytes are checked
 * against the actual format before it's accepted.
 */

export const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB
export const MAX_FILES_PER_FIELD = 5;

interface ImageSignature {
  mimeType: string;
  extension: string;
  matches: (bytes: Uint8Array) => boolean;
}

const IMAGE_SIGNATURES: ImageSignature[] = [
  {
    mimeType: "image/png",
    extension: "png",
    matches: (b) =>
      b.length >= 8 &&
      b[0] === 0x89 &&
      b[1] === 0x50 &&
      b[2] === 0x4e &&
      b[3] === 0x47 &&
      b[4] === 0x0d &&
      b[5] === 0x0a &&
      b[6] === 0x1a &&
      b[7] === 0x0a,
  },
  {
    mimeType: "image/jpeg",
    extension: "jpg",
    matches: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    mimeType: "image/gif",
    extension: "gif",
    matches: (b) =>
      b.length >= 6 &&
      b[0] === 0x47 &&
      b[1] === 0x49 &&
      b[2] === 0x46 &&
      b[3] === 0x38 &&
      (b[4] === 0x37 || b[4] === 0x39) &&
      b[5] === 0x61,
  },
  {
    mimeType: "image/webp",
    extension: "webp",
    matches: (b) =>
      b.length >= 12 &&
      b[0] === 0x52 &&
      b[1] === 0x49 &&
      b[2] === 0x46 &&
      b[3] === 0x46 &&
      b[8] === 0x57 &&
      b[9] === 0x45 &&
      b[10] === 0x42 &&
      b[11] === 0x50,
  },
];

export interface ValidatedFile {
  bytes: Uint8Array;
  mimeType: string;
  /** Random, extension-correct name safe to use as a storage object key. */
  storageName: string;
  /** Original filename, stripped of control characters — display only, never used as a path. */
  originalName: string;
  size: number;
}

export interface FileValidationError {
  message: string;
}

export async function validateUploadedImage(
  file: File,
): Promise<ValidatedFile | FileValidationError> {
  const displayName = sanitizeDisplayName(file.name);

  if (file.size === 0) {
    return { message: `"${displayName}" is empty.` };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { message: `"${displayName}" is larger than 8MB.` };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const signature = IMAGE_SIGNATURES.find((candidate) => candidate.matches(bytes));
  if (!signature) {
    return {
      message: `"${displayName}" isn't a supported image type. Please use JPEG, PNG, GIF, or WEBP.`,
    };
  }

  return {
    bytes,
    mimeType: signature.mimeType,
    storageName: `${randomToken()}.${signature.extension}`,
    originalName: displayName,
    size: file.size,
  };
}

export function isValidationError(
  result: ValidatedFile | FileValidationError,
): result is FileValidationError {
  return "message" in result;
}

/** Strips control characters and caps length. Display only — never used as a path segment. */
function sanitizeDisplayName(name: string): string {
  let cleaned = "";
  for (const char of name) {
    const code = char.codePointAt(0) ?? 0;
    const isControlChar = code < 0x20 || code === 0x7f;
    if (!isControlChar) cleaned += char;
  }
  cleaned = cleaned.trim();
  return cleaned.length > 120 ? cleaned.slice(0, 120) : cleaned || "file";
}

function randomToken(): string {
  return crypto.randomUUID().split("-").join("").slice(0, 12);
}
