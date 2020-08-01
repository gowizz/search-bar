import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { Highlight, InLocalStorage, SecondaryActionClass } from '../../src/components/result';
import * as locs from '../../src/util/storage';

describe('Result', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(cleanup);

  const onClick = jest.fn();
  const onRemove = jest.fn();

  describe('Action buttons', () => {
    it('In local storage is not present when needed to', async () => {
      let { container } = render(<InLocalStorage result={'test'} showResultsSearchIcon={false} useCashing={false} />);
      expect(container.firstChild).toHaveClass('result_icon');
      expect(container.firstChild.hasChildNodes()).toBe(false);
    });
    it('By default search icon is shown', async () => {
      let { container, getByTestId } = render(
        <InLocalStorage result={'test'} showResultsSearchIcon={true} useCashing={false} />
      );
      expect(container.firstChild).toHaveClass('result_icon');
      const element = getByTestId('search_icon_svg');
      expect(element == null).toBe(false);
    });
    it('When result in local storage different icon is shown', async () => {
      locs.addSearchTermToLocalStorage('test');
      let { container, getByTestId } = render(
        <InLocalStorage result={'test'} showResultsSearchIcon={true} useCashing={true} />
      );
      expect(container.firstChild).toHaveClass('result_icon');

      const element = getByTestId('time_icon_svg');
      expect(element == null).toBe(false);
    });
    it('Default secondary action is empty', async () => {
      let { container } = render(
        <SecondaryActionClass
          onClick={onClick}
          onRemove={onRemove}
          result={'test'}
          tabIndexStart={2}
          isSmallScreen={false}
        />
      );
      expect(container.firstChild).toHaveClass('secondary_action_icon');
      expect(container.firstChild.hasChildNodes()).toBe(false);

      fireEvent.click(container);
      expect(onClick).toBeCalledTimes(0);
      expect(onRemove).toBeCalledTimes(0);
    });
    it('Small screens have the left arrow icon', async () => {
      let { container, getByTestId } = render(
        <SecondaryActionClass
          onClick={onClick}
          onRemove={onRemove}
          result={'test'}
          tabIndexStart={2}
          isSmallScreen={true}
        />
      );
      expect(container.firstChild).toHaveClass('secondary_action_icon');
      const element = getByTestId('leftarrow_icon_svg');
      expect(element == null).toBe(false);

      fireEvent.click(element);
      expect(onClick).toBeCalled();
      expect(onClick).toBeCalledTimes(1);
    });
    it('Results in localstorage have the remove icon', async () => {
      locs.addSearchTermToLocalStorage('test');
      let { container, getByTestId } = render(
        <SecondaryActionClass
          onClick={onClick}
          onRemove={onRemove}
          result={'test'}
          tabIndexStart={2}
          isSmallScreen={true}
        />
      );
      expect(container.firstChild).toHaveClass('secondary_action_icon');
      const element = getByTestId('cancel_icon_svg');
      expect(element == null).toBe(false);

      fireEvent.click(element);
      expect(onRemove).toBeCalled();
      expect(onRemove).toBeCalledTimes(1);
    });
  });

  describe('Highlight', () => {
    it('No highlightation is handled correctly', async () => {
      let { container, getByText } = render(<Highlight text={'test'} query={'word'} />);
      expect(container.childNodes.length).toBe(1);
      const highlight = getByText('test');
      expect(highlight === null).toBe(false);
    });
    it('A highlight is handled correctly', async () => {
      let { container, getByText } = render(<Highlight text={'wordplay'} query={'word'} />);
      expect(container.firstChild.childNodes.length).toBe(2);
      const highlight_word = getByText('word');
      expect(highlight_word === null).toBe(false);
      const highlight_play = getByText('play');
      expect(highlight_play === null).toBe(false);
    });
  });
});
