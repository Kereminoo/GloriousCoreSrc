import React from 'react';
import { IconProps } from '../icon';

const IconMock: React.FC<IconProps> = ({ type, color, size }) => (
  <div>
    {size} sized {type} icon in {color} color
  </div>
);

export default IconMock;
