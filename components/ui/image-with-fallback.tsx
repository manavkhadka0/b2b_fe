"use client";

import { useEffect, useState } from "react";

export const ImageWithFallback = ({ alt, src, ...props }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <img
      alt={alt}
      onError={() => setError(true)}
      src={error ? "/placeholder.jpg" : src}
      {...props}
    />
  );
};
