const DEFAULT_MAX_DIMENSION = 1600;
const DEFAULT_QUALITY = 82;

type EncoderResponse = { id: number; output?: ArrayBuffer; error?: string };

export type WebpEncoder = {
  encode(image: ImageData, quality?: number): Promise<ArrayBuffer>;
  terminate(): void;
};

export type PreparedImage = {
  file: File;
  converted: boolean;
  originalBytes: number;
  outputBytes: number;
};

function hasBytes(bytes: Uint8Array, offset: number, expected: number[]) {
  return expected.every((value, index) => bytes[offset + index] === value);
}

function containsAscii(bytes: Uint8Array, value: string) {
  const pattern = new TextEncoder().encode(value);
  outer: for (let index = 0; index <= bytes.length - pattern.length; index++) {
    for (let part = 0; part < pattern.length; part++) {
      if (bytes[index + part] !== pattern[part]) continue outer;
    }
    return true;
  }
  return false;
}

function asciiAt(bytes: Uint8Array, offset: number, length: number) {
  return String.fromCharCode(...bytes.slice(offset, offset + length));
}

function assertStaticWebp(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const declaredEnd = view.getUint32(4, true) + 8;
  if (declaredEnd > bytes.length) throw new Error("The WebP file is truncated.");

  let hasImageData = false;
  for (let offset = 12; offset + 8 <= declaredEnd; ) {
    const type = asciiAt(bytes, offset, 4);
    const length = view.getUint32(offset + 4, true);
    const next = offset + 8 + length + (length % 2);
    if (next > declaredEnd) throw new Error("The WebP file has an invalid chunk length.");
    if (type === "ANIM" || type === "ANMF") throw new Error("Animated WebP is not supported.");
    if (type === "VP8 " || type === "VP8L") hasImageData = true;
    offset = next;
  }
  if (!hasImageData) throw new Error("The WebP file contains no image data.");
}

function assertStaticPng(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let foundEnd = false;
  for (let offset = 8; offset + 12 <= bytes.length; ) {
    const length = view.getUint32(offset, false);
    const type = asciiAt(bytes, offset + 4, 4);
    const next = offset + 12 + length;
    if (next > bytes.length) throw new Error("The PNG file has an invalid chunk length.");
    if (type === "acTL") throw new Error("Animated PNG is not supported.");
    if (type === "IEND") {
      foundEnd = true;
      break;
    }
    offset = next;
  }
  if (!foundEnd) throw new Error("The PNG file is truncated.");
}

function detectFormat(bytes: Uint8Array): "jpeg" | "png" | "webp" | null {
  if (hasBytes(bytes, 0, [0xff, 0xd8, 0xff])) return "jpeg";
  if (hasBytes(bytes, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (bytes.length >= 12 && containsAscii(bytes.slice(0, 4), "RIFF") && containsAscii(bytes.slice(8, 12), "WEBP")) {
    return "webp";
  }
  return null;
}

function verifyDeclaredType(file: File, format: "jpeg" | "png" | "webp") {
  if (!file.type) return;
  const expected = format === "jpeg" ? ["image/jpeg", "image/jpg"] : [`image/${format}`];
  if (!expected.includes(file.type.toLowerCase())) {
    throw new Error(`"${file.name}" does not match its declared file type.`);
  }
}

function isWebp(bytes: Uint8Array) {
  return bytes.length >= 12 && hasBytes(bytes, 0, [0x52, 0x49, 0x46, 0x46]) && hasBytes(bytes, 8, [0x57, 0x45, 0x42, 0x50]);
}

export function fitImageDimensions(width: number, height: number, maxDimension = DEFAULT_MAX_DIMENSION) {
  const scale = Math.min(1, maxDimension / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export function safeImageStem(name: string) {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "product-image"
  );
}

export function createWebpEncoder(): WebpEncoder {
  const worker = new Worker(new URL("../workers/webp.worker.ts", import.meta.url), { type: "module" });
  const pending = new Map<number, { resolve(value: ArrayBuffer): void; reject(reason: Error): void }>();
  let nextId = 1;
  let stoppedError: Error | null = null;

  worker.onmessage = ({ data }: MessageEvent<EncoderResponse>) => {
    const request = pending.get(data.id);
    if (!request) return;
    pending.delete(data.id);
    if (data.output) request.resolve(data.output);
    else request.reject(new Error(data.error ?? "WebP encoding failed."));
  };

  worker.onerror = () => {
    stoppedError = new Error("The WebP encoder stopped unexpectedly.");
    worker.terminate();
    for (const request of pending.values()) request.reject(stoppedError);
    pending.clear();
  };

  worker.onmessageerror = () => {
    stoppedError = new Error("The WebP encoder returned an unreadable response.");
    worker.terminate();
    for (const request of pending.values()) request.reject(stoppedError);
    pending.clear();
  };

  return {
    encode(image, quality = DEFAULT_QUALITY) {
      if (stoppedError) return Promise.reject(stoppedError);
      const id = nextId++;
      const pixels = image.data.buffer.slice(0) as ArrayBuffer;
      return new Promise<ArrayBuffer>((resolve, reject) => {
        pending.set(id, { resolve, reject });
        try {
          worker.postMessage({ id, pixels, width: image.width, height: image.height, quality }, [pixels]);
        } catch (error) {
          pending.delete(id);
          reject(error instanceof Error ? error : new Error("Could not start WebP encoding."));
        }
      });
    },
    terminate() {
      stoppedError = new Error("The WebP encoder was closed.");
      worker.terminate();
      for (const request of pending.values()) request.reject(stoppedError);
      pending.clear();
    },
  };
}

export async function encodeCanvasAsWebp(canvas: HTMLCanvasElement, encoder: WebpEncoder) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("This browser cannot prepare images for upload.");
  const output = await encoder.encode(context.getImageData(0, 0, canvas.width, canvas.height));
  if (!isWebp(new Uint8Array(output))) throw new Error("The image encoder returned an invalid WebP file.");
  return new Blob([output], { type: "image/webp" });
}

async function decodeImage(file: File) {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    return {
      width: bitmap.width,
      height: bitmap.height,
      draw(context: CanvasRenderingContext2D, width: number, height: number) {
        context.drawImage(bitmap, 0, 0, width, height);
      },
      close() {
        bitmap.close();
      },
    };
  } catch {
    const url = URL.createObjectURL(file);
    const image = document.createElement("img");
    image.decoding = "async";
    image.src = url;
    try {
      await image.decode();
    } catch (error) {
      URL.revokeObjectURL(url);
      throw error;
    }
    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
      draw(context: CanvasRenderingContext2D, width: number, height: number) {
        context.drawImage(image, 0, 0, width, height);
      },
      close() {
        URL.revokeObjectURL(url);
      },
    };
  }
}

export async function prepareImageForUpload(file: File, encoder: WebpEncoder): Promise<PreparedImage> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const format = detectFormat(bytes);
  if (!format) throw new Error(`"${file.name}" is not a supported JPG, PNG, or WebP image.`);
  verifyDeclaredType(file, format);

  if (format === "webp") {
    try {
      assertStaticWebp(bytes);
      const decoded = await decodeImage(file);
      decoded.close();
    } catch (error) {
      const detail = error instanceof Error ? error.message : "The file could not be decoded.";
      throw new Error(`"${file.name}" is not a valid static WebP image. ${detail}`);
    }
    return { file, converted: false, originalBytes: file.size, outputBytes: file.size };
  }

  if (format === "png") {
    try {
      assertStaticPng(bytes);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "The file is invalid.";
      throw new Error(`"${file.name}" is not a valid static PNG image. ${detail}`);
    }
  }

  const source = await decodeImage(file);
  const canvas = document.createElement("canvas");
  try {
    const dimensions = fitImageDimensions(source.width, source.height);
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("This browser cannot prepare images for upload.");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    source.draw(context, dimensions.width, dimensions.height);

    const blob = await encodeCanvasAsWebp(canvas, encoder);
    const output = new File([blob], `${safeImageStem(file.name)}.webp`, {
      type: "image/webp",
      lastModified: file.lastModified,
    });
    return { file: output, converted: true, originalBytes: file.size, outputBytes: output.size };
  } finally {
    source.close();
    canvas.width = 0;
    canvas.height = 0;
  }
}
