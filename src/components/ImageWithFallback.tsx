"use client";
import { useState } from "react";
import Image from "next/image";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleError = () => {
    setHasError(true);
    // Set a placeholder image
    setImgSrc("/placeholder-product.png");
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {hasError ? (
        <p className="bg-gray-200 rounded-md text-gray-500 text-xs text-center p-1">
          Imagem não disponível
        </p>
      ) : (
        <Image
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          className="object-cover rounded-md"
          onError={handleError}
        />
      )}
    </div>
  );
};

export default ImageWithFallback;
