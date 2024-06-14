import { Meta, StoryObj } from '@storybook/react';
import Typography from './typography';
import { TextType, textColorsOptions } from './typography.types';
import React from 'react';
import { Color } from '../component.types';

const argTypes = {
  children: {
    description: 'The text content.',
  },
  type: {
    control: {
      type: 'select',
    },
    options: Object.values(TextType),
    description: 'The type of text to determine style and HTML element used.',
  },
  className: {
    description: 'The optional class to add to the element.',
  },
  element: {
    control: {
      type: 'select',
    },
    options: ['h1', 'h2', 'h3', 'p', 'span', undefined],
    description: 'The optional setting to change HTML element used.',
    defaultValue: {
      summary: 'different for each type',
    },
  },
  color: {
    control: {
      type: 'select',
    },
    options: textColorsOptions,
    description: 'The optional color settings for the text.',
    defaultValue: {
      summary: 'Color.Base30',
    },
  },
};

const meta: Meta<typeof Typography> = {
  title: 'Design System/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes,
};

export default meta;

type Story = StoryObj<typeof Typography>;

export const Default: Story = {
  args: {
    type: TextType.Heading1,
    children: 'This is a sample text',
    color: Color.Base30,
  },
};

export const AllText: Story = args => {
  return (
    <>
      {Object.values(TextType).map(type => (
        <React.Fragment key={type}>
          <Typography type={type as TextType} color={args.color}>
            {type}
          </Typography>
          <br />
        </React.Fragment>
      ))}
    </>
  );
};

AllText.args = {
  color: Color.Base30,
};
