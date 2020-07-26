import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { HiddenInput } from '../src/components/hidden_input';
import { getInputSessionToken } from '../src/util/storage';

describe('HiddenInput', () => {
  it('Renders the hidden input', () => {
    const { queryByTestId } = render(<HiddenInput />);
    const inputNode = queryByTestId('token');
    expect(inputNode).toBeInTheDocument();
  });
  it('Session token in set correctly', () => {
    const { queryByTestId } = render(<HiddenInput />);
    const inputNode = queryByTestId('token');
    expect(inputNode).toBeInTheDocument();
    const token = inputNode.getAttribute('value');
    expect(token.length).toBe(36);
    expect(token).toBe(getInputSessionToken());
  });
});
