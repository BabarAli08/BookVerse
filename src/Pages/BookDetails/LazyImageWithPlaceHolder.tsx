// Component/LazyImage.tsx
import { useState } from 'react';

const LazyImageWithPlaceholder = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className="relative">
      {!loaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
      <img 
        src={src} 
        alt={alt} 
        className={className}
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}
      />
    </div>
  );
};

export default LazyImageWithPlaceholder;