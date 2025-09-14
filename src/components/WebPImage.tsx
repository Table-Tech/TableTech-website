import React from 'react';

interface WebPImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}

export const WebPImage: React.FC<WebPImageProps> = ({
  src,
  alt,
  className,
  loading = 'lazy',
  width,
  height,
  style,
}) => {
  // Generate WebP path from original path
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

  // For backgrounds or images that don't support picture element
  const supportsWebP = typeof window !== 'undefined' &&
    document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;

  if (!src.match(/\.(jpg|jpeg|png)$/i)) {
    // If not an image we can convert, return as is
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        width={width}
        height={height}
        style={style}
      />
    );
  }

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        width={width}
        height={height}
        style={style}
      />
    </picture>
  );
};

// Hook for background images
export const useWebPBackground = (originalSrc: string): string => {
  const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');

  if (typeof window === 'undefined') return originalSrc;

  const supportsWebP = document.createElement('canvas')
    .toDataURL('image/webp')
    .indexOf('data:image/webp') === 0;

  return supportsWebP && originalSrc.match(/\.(jpg|jpeg|png)$/i) ? webpSrc : originalSrc;
};