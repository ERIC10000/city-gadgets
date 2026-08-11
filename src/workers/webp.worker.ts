import encode from "@jsquash/webp/encode";

type EncodeRequest = {
  id: number;
  pixels: ArrayBuffer;
  width: number;
  height: number;
  quality: number;
};

type WorkerScope = {
  onmessage: ((event: MessageEvent<EncodeRequest>) => void) | null;
  postMessage(message: unknown, transfer?: Transferable[]): void;
};

const workerScope = self as unknown as WorkerScope;

workerScope.onmessage = async ({ data }) => {
  try {
    const image = new ImageData(new Uint8ClampedArray(data.pixels), data.width, data.height);
    const output = await encode(image, {
      quality: data.quality,
      alpha_quality: 100,
      method: 4,
    });
    workerScope.postMessage({ id: data.id, output }, [output]);
  } catch (error) {
    workerScope.postMessage({
      id: data.id,
      error: error instanceof Error ? error.message : "WebP encoding failed.",
    });
  }
};
