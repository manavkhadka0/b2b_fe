import Image from "next/image";
import { useEffect, useState } from "react";

export const ImageWithFallback = ({ alt, src, ...props }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <Image
      alt={alt}
      onError={() => setError(true)}
      src={error ? "/placeholder.jpg" : src}
      {...props}
    />
  );
};
