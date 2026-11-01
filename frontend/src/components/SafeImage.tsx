import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { mediaUrl } from '../services/api';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  alt: string;
}

const SafeImageContent: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc = '/images/ease-home-v2.png',
  alt,
  className = '',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);

  const handleError = () => {
    if (hasError || imgSrc === fallbackSrc) { setFallbackFailed(true); return; }
    if (!hasError) {
      setHasError(true);
      if (fallbackSrc && imgSrc !== fallbackSrc) {
        setImgSrc(fallbackSrc);
      }
    }
  };

  if (fallbackFailed) {
    return (
      <div role="img" aria-label={alt} className={`flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-400 ${className}`}>
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

export const SafeImage: React.FC<SafeImageProps> = (props) => <SafeImageContent key={`${props.src || ''}|${props.fallbackSrc || ''}`} {...props} src={mediaUrl(props.src)} />;
