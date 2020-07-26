import React, { FunctionComponent } from 'react';
import { generateInputSessionToken } from '../util/storage';

export const HiddenInput: FunctionComponent<{}> = ({}) => {
  const token = generateInputSessionToken();
  return (
    <React.Fragment>
      <input data-testid={'token'} readOnly={true} hidden={true} name={'token'} value={token} />
    </React.Fragment>
  );
};
