/**
 * Image processing utilities for client-side uploads.
 * Downsamples and compresses images into lightweight Base64 Data URLs
 * to ensure fast rendering and safe localStorage persistence without exceeding quotas.
 */

export interface ProcessedImageResult {
  dataUrl: string;
  originalFileName: string;
  fileSizeKb: number;
  width: number;
  height: number;
}

export async function processAndCompressImage(
  file: File,
  maxDimension: number = 720,
  quality: number = 0.85
): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Please select an image file (JPEG, PNG, WebP).'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read the selected image file.'));

    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to parse image data.'));

      img.onload = () => {
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas 2D context is not available.'));
        }

        // Fill background with subtle neutral in case of transparent PNG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const approximateSizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

        resolve({
          dataUrl,
          originalFileName: file.name,
          fileSizeKb: approximateSizeKb,
          width,
          height
        });
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
