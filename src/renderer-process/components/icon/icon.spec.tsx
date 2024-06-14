// @ts-ignore: Unused variable
import React from 'react';
import { render } from '@testing-library/react';
import Icon from './icon';
import { IconSize, IconType } from './icon.types';
import { act } from 'react-dom/test-utils';
import { Color } from '../component.types';

describe('Icon', () => {
  it('renders correctly with default size and color', async () => {
    let asFragment;
    await act(async () => {
      const result = render(<Icon type={IconType.BatteryMedium} />);
      asFragment = result.asFragment;
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly with custom size', async () => {
    let asFragment;
    await act(async () => {
      const result = render(<Icon type={IconType.BatteryMedium} size={IconSize.Small} />);
      asFragment = result.asFragment;
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly with custom color', async () => {
    let asFragment;
    await act(async () => {
      const result = render(<Icon type={IconType.BatteryMedium} color={Color.Base20} />);
      asFragment = result.asFragment;
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
