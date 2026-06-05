'use client';

import React from 'react';
import Image from 'next/image';

interface ProtectedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  /**
   * Watermark display. The previous build referenced an SVG watermark file
   * that doesn't exist in the new brand assets; we now overlay the brand
   * logo (logo.webp) instead. Defaults to false to keep the gallery clean.
   */
  showWatermark?: boolean;
  sizes?: string;
}

const ProtectedImage: React.FC<ProtectedImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  showWatermark = false,
  sizes,
}) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className={`relative select-none ${fill ? 'w-full h-full' : 'inline-block'} ${className}`}
      onContextMenu={handleContextMenu}
    >
      <div className={`relative ${fill ? 'w-full h-full' : 'w-auto h-auto'}`}>
        <Image
          src={src}
          alt={alt}
          width={!fill ? (width || 1200) : undefined}
          height={!fill ? (height || 800) : undefined}
          fill={fill}
          priority={priority}
          className={`${fill ? 'object-contain' : 'w-full h-auto block'}`}
          draggable={false}
          sizes={sizes}
        />

        {showWatermark && (
          <div className="absolute bottom-[6%] left-0 right-0 flex justify-center z-10 pointer-events-none">
            <div
              className="relative w-[28%] max-w-[160px] opacity-[0.55]"
              style={{ mixBlendMode: 'screen' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.webp"
                alt=""
                className="w-full h-auto"
                draggable={false}
              />
            </div>
          </div>
        )}

        <div
          className="absolute inset-0 z-20 pointer-events-auto bg-transparent"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default ProtectedImage;
