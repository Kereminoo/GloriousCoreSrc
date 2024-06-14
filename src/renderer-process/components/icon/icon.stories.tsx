import { Meta, StoryObj } from '@storybook/react';
import Icon from './icon';
import { IconSize, IconType, iconColorsOptions } from './icon.types';
import { Color } from '../component.types';

const argTypes = {
  type: {
    control: {
      type: 'select',
    },
    options: Object.values(IconType),
    description: 'The type of icon to display.',
  },
  color: {
    control: {
      type: 'select',
    },
    options: iconColorsOptions,
    description: 'Optional color setting of the icon.',
    defaultValue: {
      summary: 'Color.Base50',
    },
  },
  size: {
    control: {
      type: 'select',
    },
    options: Object.values(IconSize),
    description: 'Optional size setting of the icon.',
    defaultValue: {
      summary: 'IconSize.Small',
    },
  },
};

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes,
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    type: IconType.valueEMic,
    color: Color.Base20,
    size: IconSize.Medium,
  },
};

interface IconListProps {
  size?: IconSize;
}

const IconList: React.FC<IconListProps> = ({ size }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
      {Object.values(IconType).map(type => (
        <div key={type} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Icon type={type} size={size} color={Color.Base20} />
          <span style={{ marginTop: '10px' }}>{type}</span>
        </div>
      ))}
    </div>
  );
};

export const All: StoryObj<typeof Icon> = {
  render: args => <IconList {...args} />,
};

All.args = {
  size: IconSize.Medium,
};
