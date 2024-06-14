import { Color } from '../component.types';

export type AllowedElements = 'h1' | 'h2' | 'h3' | 'p' | 'span';

export const textColorsOptions: (Color | undefined)[] = [
  Color.Base90,
  Color.Base30,
  Color.Base20,
  Color.Base10,
  undefined,
];

export enum TextType {
  Heading1 = 'heading1',
  Heading2 = 'heading2',
  ParagraphLargeBold = 'paragraphlargebold',
  ParagraphLarge = 'paragraphlarge',
  ParagraphMediumBold = 'paragraphmediumbold',
  ParagraphMedium = 'paragraphmedium',
  ParagraphSmallBold = 'paragraphsmallbold',
  ParagraphSmall = 'paragraphsmall',
  ParagraphXSmallBold = 'paragraphxsmallbold',
  ParagraphXSmall = 'paragraphxsmall',
  ButtonLarge = 'buttonlarge',
  ButtonMedium = 'buttonmedium',
  ButtonSmall = 'buttonsmall',
  LinkTextLarge = 'linktextlarge',
  LinkTextMedium = 'linktextmedium',
  LinkTextSmall = 'linktextsmall',
}

export type TextColor =
  | Color.Base100
  | Color.Base90
  | Color.Base60
  | Color.Base50
  | Color.Base40
  | Color.Base30
  | Color.Base20
  | Color.Base10
  | Color.Glorange60
  | Color.Glorange50
  | Color.Glorange20
  | Color.RedDark60
  | Color.GreenDark60;
