import React from 'react';
import styles from './typography.module.css';
import { AllowedElements, TextColor, TextType } from './typography.types';
import classNames from 'classnames';
import { Color } from '../component.types';

const typeToElementMapping: { [key in TextType]: AllowedElements } = {
  [TextType.Heading1]: 'h1',
  [TextType.Heading2]: 'h2',
  [TextType.ParagraphLargeBold]: 'p',
  [TextType.ParagraphLarge]: 'p',
  [TextType.ParagraphMediumBold]: 'p',
  [TextType.ParagraphMedium]: 'p',
  [TextType.ParagraphSmallBold]: 'p',
  [TextType.ParagraphSmall]: 'p',
  [TextType.ParagraphXSmallBold]: 'p',
  [TextType.ParagraphXSmall]: 'p',
  [TextType.ButtonLarge]: 'span',
  [TextType.ButtonMedium]: 'span',
  [TextType.ButtonSmall]: 'span',
  [TextType.LinkTextLarge]: 'span',
  [TextType.LinkTextMedium]: 'span',
  [TextType.LinkTextSmall]: 'span',
};

interface TypographyProps {
  children: React.ReactNode;
  type: TextType;
  className?: string;
  element?: AllowedElements;
  color?: TextColor;
  underline?: boolean;
  id?: string;
}

const Typography: React.FC<TypographyProps> = ({
  children,
  type,
  className,
  element = 'p',
  color = Color.Base30,
  underline = false,
  id,
}) => {
  const Element = element || typeToElementMapping[type];
  return (
    <Element
      {...(id && { id })}
      className={classNames(styles[type], className, { [styles.underline]: underline })}
      style={{ color: `var(${color})` }}
    >
      {children}
    </Element>
  );
};

export default Typography;
