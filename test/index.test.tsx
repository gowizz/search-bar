import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { cleanup, render } from '@testing-library/react';
import Searchbox from '../src/components/searchbox';
import Searchbar from '../src/components/searchbar';

describe('Exports', () => {
  afterEach(cleanup);

  describe('Searchbox', () => {
    it('mounts without props', async () => {
      const { container } = render(<Searchbox />);
      expect(container.firstChild).toHaveClass('gowiz_searchbar_container');
      expect(container.firstChild.hasChildNodes()).toBe(true);
    });
    describe('Searchbar', () => {
      const onSubmit = jest.fn();
      it('mounts with required props', async () => {
        let { container } = render(<Searchbar onSubmit={onSubmit} API_KEY={'TEST'} />);
        expect(container.firstChild).toHaveClass('gowiz_searchbar_container');
        expect(container.firstChild.hasChildNodes()).toBe(true);
      });
    });
  });
});
