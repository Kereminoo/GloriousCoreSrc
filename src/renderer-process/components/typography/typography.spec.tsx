// @ts-ignore: Unused variable
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Typography from './typography';
import styles from './typography.module.css';
import { TextType } from './typography.types';
import { Color } from '../component.types';

describe('Typography', () => {
  it('renders correctly with type prop', () => {
    const { asFragment } = render(<Typography type={TextType.ParagraphMedium}>Test Text</Typography>);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the correct element for given type', () => {
    render(<Typography type={TextType.ParagraphLarge}>Display Text</Typography>);
    const headingElement = screen.getByText('Display Text');
    expect(headingElement.tagName).toBe('P');
  });

  it('applies the correct class for a type', () => {
    render(<Typography type={TextType.Heading1}>Heading 1</Typography>);
    const headingElement = screen.getByText('Heading 1');
    expect(headingElement).toHaveClass(styles[TextType.Heading1]);
  });

  it('overrides the element type when element prop is provided', () => {
    render(
      <Typography type={TextType.Heading1} element="span">
        Heading as Span
      </Typography>
    );
    const spanElement = screen.getByText('Heading as Span');
    expect(spanElement.tagName).toBe('SPAN');
  });

  it('applies the correct color class', () => {
    render(
      <Typography type={TextType.Heading1} color={Color.Base20}>
        Danger Text
      </Typography>
    );
    const colorElement = screen.getByText('Danger Text');
    expect(colorElement).toHaveStyle(`color: var(${Color.Base20})`);
  });

  it('renders correctly without color prop', () => {
    const { asFragment } = render(<Typography type={TextType.Heading2}>No Color</Typography>);
    expect(asFragment()).toMatchSnapshot();
  });
});
