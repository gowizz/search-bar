import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import Input from '../src/components/input';
import { cleanup, render } from '@testing-library/react';

describe('Input', async () => {
  const onCancel = jest.fn();
  const onChange = jest.fn();
  afterEach(cleanup);

  describe('Default props', async () => {
    it('Input has search icon', async () => {
      let { container } = render(<Input onChange={onChange} onCancel={onCancel} />);
      expect(container.firstChild).toHaveClass('search_icon');
      expect(container.firstChild.hasChildNodes()).toBe(true);
      expect(container.childNodes.length).toBe(2);

      const svg = container.firstChild.childNodes[0];

      expect(svg.nodeName).toBe('svg');
    });
  });
  describe('Custom props', async () => {
    it('Input dose not have search icon', async () => {
      let { container } = render(<Input showInputSearchIcon={false} onChange={onChange} onCancel={onCancel} />);

      expect(container.childNodes.length).toBe(1);
      expect(container.firstChild).toHaveClass('search_input');
      expect(container.firstChild.hasChildNodes()).toBe(true);

      const input = container.firstChild.childNodes[0];

      expect(input.nodeName).toBe('INPUT');
    });
  });
});
