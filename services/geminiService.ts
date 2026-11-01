/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Helper to convert File to a base64 data URL string
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Helper to convert a data URL string to a File object
export const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  if (arr.length < 2) throw new Error('Invalid data URL');
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch || !mimeMatch[1]) throw new Error('Could not parse MIME type from data URL');

  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

/**
 * Generates a composite image using server-side Gemini multi-modal inference.
 */
export const generateCompositeImage = async (
  objectImage: File,
  objectDescription: string,
  environmentImage: File,
  environmentDescription: string,
  dropPosition: { xPercent: number; yPercent: number }
): Promise<{ finalImageUrl: string; debugImageUrl: string; finalPrompt: string }> => {
  const [objectBase64, sceneBase64] = await Promise.all([
    fileToDataUrl(objectImage),
    fileToDataUrl(environmentImage),
  ]);

  const response = await fetch('/api/canvas/composite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      objectImageBase64: objectBase64,
      sceneImageBase64: sceneBase64,
      objectName: objectDescription || objectImage.name,
      dropPosition,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    const errorMsg = data?.error?.message || 'Error al generar la composición en el servidor.';
    throw new Error(errorMsg);
  }

  return {
    finalImageUrl: data.finalImageUrl,
    debugImageUrl: sceneBase64, // Marked or source image
    finalPrompt: data.semanticDescription || `Placed at (${dropPosition.xPercent}%, ${dropPosition.yPercent}%)`,
  };
};

/**
 * Removes background using server-side Gemini image model.
 */
export const removeImageBackground = async (productImage: File): Promise<File> => {
  const imageBase64 = await fileToDataUrl(productImage);

  const response = await fetch('/api/canvas/remove-bg', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64 }),
  });

  const data = await response.json();

  if (!response.ok || !data.ok || !data.imageUrl) {
    const errorMsg = data?.error?.message || 'No se pudo remover el fondo.';
    throw new Error(errorMsg);
  }

  return dataURLtoFile(
    data.imageUrl,
    `bg-removed-${productImage.name.replace(/\.[^/.]+$/, '')}.png`
  );
};

/**
 * Invocación de Visión Cósmica - PHIXO PROYECTO OCTAEDRO
 */
export const generateCosmicOctaedro = async (
  prompt: string,
  aspectRatio: string = '1:1'
): Promise<{ imageUrl: string; requestId: string; durationMs: number }> => {
  const response = await fetch('/api/octaedro/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, aspectRatio }),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data?.error?.message || 'Error invocando la visión cósmica.');
  }

  return {
    imageUrl: data.imageUrl,
    requestId: data.requestId,
    durationMs: data.durationMs,
  };
};

/**
 * Superintelligence Gateway - Chat & Multi-Model Inference
 */
export const callSIGateway = async (
  prompt: string,
  model: string = 'gemini-3.8-flash',
  systemInstruction?: string
): Promise<{
  text: string;
  model: string;
  requestId: string;
  durationMs: number;
  usage?: {
    promptTokenCount: number | null;
    candidatesTokenCount: number | null;
    totalTokenCount: number | null;
  };
}> => {
  const response = await fetch('/api/si-gateway/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model, systemInstruction }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || `Error del gateway (${response.status})`);
  }

  return data;
};

/**
 * NASA Near-Earth Objects (NEO) Real Telemetry Feed
 */
export const fetchNEOTelemetry = async () => {
  const response = await fetch('/api/nasa/neo');
  if (!response.ok) {
    throw new Error('Error al consultar telemetría NEO.');
  }
  return response.json();
};