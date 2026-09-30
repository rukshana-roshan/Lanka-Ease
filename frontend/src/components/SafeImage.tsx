import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  alt: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
  alt,
  className = '',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  if (hasError && !fallbackSrc) {
    return (
      <div className={`flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-400 ${className}`}>
        <ImageOff className="w-6 h-6" />
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      {...props}
    />
  );
};
