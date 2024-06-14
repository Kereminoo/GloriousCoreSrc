import React, { useEffect, useState } from 'react';
import { SVGImageType } from './svg-image.types';

export interface SVGImageProps {
  type: SVGImageType;
  width?: string;
  height?: string;
  className?: string;
}

const SVGImage: React.FC<SVGImageProps> = ({ type, width, height, className }) => {
  const [SVGImageComponent, setSVGImageComponent] = useState<React.ElementType | null>(null);

  useEffect(() => {
    const importSVGImageComponent = async () => {
      try {
        const { default: ImportedIcon } = await import(`./image-assets/${type}.tsx`);
        setSVGImageComponent(() => ImportedIcon);
      } catch (error) {
        console.error(`Failed to load icon component: ${type}`, error);
        setSVGImageComponent(null);
      }
    };

    importSVGImageComponent();
  }, [type]);

  if (!SVGImageComponent) return null;

  return <SVGImageComponent 
  width={width} 
  height={height}
  className={className} />;
};

export default SVGImage;
