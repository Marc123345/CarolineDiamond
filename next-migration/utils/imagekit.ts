export const IMAGEKIT_BASE_URL = 'https://ik.imagekit.io/qcvroy8xpd';

export interface ImageKitTransformation {
  width?: number | 'auto';
  height?: number;
  aspectRatio?: string;
  quality?: number | 'auto';
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  dpr?: number | 'auto';
  focus?: 'auto' | 'face' | 'center';
  crop?: 'maintain_ratio' | 'force' | 'at_least' | 'at_max';
  blur?: number;
}

export interface ResponsiveImageConfig {
  path: string;
  alt: string;
  transformation?: ImageKitTransformation;
  widths?: number[];
  sizes?: string;
  loading?: 'lazy' | 'eager';
  className?: string;
}

export function buildImageKitUrl(
  path: string,
  transformation?: ImageKitTransformation
): string {
  if (!path) return '';

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  if (!transformation) {
    return `${IMAGEKIT_BASE_URL}/${cleanPath}`;
  }

  const params: string[] = [];

  if (transformation.width) params.push(`w-${transformation.width}`);
  if (transformation.height) params.push(`h-${transformation.height}`);
  if (transformation.aspectRatio) params.push(`ar-${transformation.aspectRatio}`);
  if (transformation.quality) params.push(`q-${transformation.quality}`);
  if (transformation.format) params.push(`f-${transformation.format}`);
  if (transformation.dpr) params.push(`dpr-${transformation.dpr}`);
  if (transformation.focus) params.push(`fo-${transformation.focus}`);
  if (transformation.crop) params.push(`c-${transformation.crop}`);
  if (transformation.blur) params.push(`bl-${transformation.blur}`);

  const transformString = params.length > 0 ? `tr=${params.join(',')}` : '';

  return `${IMAGEKIT_BASE_URL}/${cleanPath}${transformString ? `?${transformString}` : ''}`;
}

export function buildResponsiveSrcSet(
  path: string,
  widths: number[],
  transformation?: Omit<ImageKitTransformation, 'width'>
): string {
  return widths
    .map(width => {
      const url = buildImageKitUrl(path, { ...transformation, width });
      return `${url} ${width}w`;
    })
    .join(', ');
}

export const defaultMobileTransformation: ImageKitTransformation = {
  format: 'auto',
  quality: 'auto',
  dpr: 'auto',
  focus: 'auto',
};

export const defaultDesktopTransformation: ImageKitTransformation = {
  format: 'auto',
  quality: 'auto',
  dpr: 'auto',
};

export const defaultResponsiveWidths = [320, 480, 640, 960, 1280, 1920];

export const defaultSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

export function getLQIPUrl(path: string): string {
  return buildImageKitUrl(path, {
    width: 20,
    quality: 20,
    blur: 10,
    format: 'auto',
  });
}
