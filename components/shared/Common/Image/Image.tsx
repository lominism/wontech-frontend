'use client';

import NextImage, { ImageProps } from 'next/image';
import React, { useState } from 'react';

// Extends Next.js ImageProps but makes src optional/nullable so callers can
// safely pass empty strings, null, or undefined — all fall back to fallbackSrc.
interface FxtImageProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
  alt: string;
}

const Image: React.FC<FxtImageProps> = ({
  src,
  fallbackSrc = '/placeholder.png',
  alt,
  ...rest
}) => {
  // Normalize falsy src (empty string, null, undefined) to fallback immediately.
  const resolvedSrc = src || fallbackSrc;

  // Track per-src error state. Using `resolvedSrc` as the key on the wrapper
  // (see below) resets this state automatically when src changes — avoiding
  // the setState-in-effect anti-pattern.
  const [hasError, setHasError] = useState(false);

  return (
    // Keying on resolvedSrc resets the component (including hasError) whenever
    // the image source changes, which is the recommended alternative to
    // useEffect + setState for derived state resets.
    <React.Fragment key={resolvedSrc}>
      <NextImage
        {...rest}
        src={hasError ? fallbackSrc : resolvedSrc}
        alt={alt}
        onError={() => setHasError(true)}
      />
    </React.Fragment>
  );
};

export default Image;