import React from 'react';
import { render } from '@testing-library/react';
import { HiddenInput } from '../../src/components/hidden_input';
import { getInputSessionToken } from '../../src/util/storage';

describe('HiddenInput', () => {
  it('Session token in set correctly', async () => {
    const { queryByTestId } = render(<HiddenInput />);
    const inputNode = queryByTestId('token');
    const token = inputNode.getAttribute('value');
    const name = inputNode.getAttribute('name');
    expect(name).toBe('token');
    expect(token.length).toBe(36);
    expect(token).toBe(getInputSessionToken());
  });
});
