import React, { useEffect, useState } from 'react';
import { IconColor, IconSize, IconType } from './icon.types';
import { Color } from '../component.types';

export interface IconProps {
  type: IconType;
  color?: IconColor;
  size?: IconSize;
  width?: string;
  height?: string;
  secondaryColor?: IconColor;
  hoverColor?: IconColor;
  className?: string;
}

const sizeToVariable = {
  [IconSize.XSmall]: '12px',
  [IconSize.Smaller]: '16px',
  [IconSize.Small]: '18px',
  [IconSize.Medium]: '24px',
  [IconSize.Large]: '32px',
  [IconSize.Larger]: '40px',
  [IconSize.ExtraLarge]: '64px',
};

export function scaleUniqueDimensionsToSize(size: IconSize)
{
  // todo;
}

const Icon: React.FC<IconProps> = ({ type, color = Color.Base50, size = IconSize.Small, width, height, secondaryColor, hoverColor, className }) => {
  const [IconComponent, setIconComponent] = useState<React.ElementType | null>(null);

  useEffect(() => {
    const importIconComponent = async () => {
      try {
        const { default: ImportedIcon } = await import(`./icon-assets/${type}.tsx`);
        setIconComponent(() => ImportedIcon);
      } catch (error) {
        console.error(`Failed to load icon component: ${type}`, error);
        setIconComponent(null);
      }
    };

    importIconComponent();
  }, [type]);

  if (!IconComponent) return null;

  return <IconComponent 
  color={color} 
  size={(width == undefined && height == undefined) ? sizeToVariable[size] : undefined} 
  width={width} 
  height={height}
  hoverColor={hoverColor}
  secondaryColor={secondaryColor}
  className={className} />;
};

export default Icon;
