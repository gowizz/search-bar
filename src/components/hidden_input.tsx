import React from 'react';
import { generateInputSessionToken } from '../util/storage';

export function HiddenInput() {
  const token = generateInputSessionToken();
  return <input data-testid={'token'} readOnly={true} hidden={true} name={'token'} value={token} />;
}
