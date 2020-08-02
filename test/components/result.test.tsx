import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { cleanup, fireEvent, render } from '@testing-library/react';
import Results, { Highlight, InLocalStorage, SecondaryActionClass } from '../../src/components/result';
import * as locs from '../../src/util/storage';

describe('Result', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(cleanup);

  const onClick = jest.fn();
  const onRemove = jest.fn();
  const onSelect = jest.fn();

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

  describe('Result component', () => {
    it('No results values render null', async () => {
      let { container } = render(<Results onClick={onClick} onRemove={onRemove} onSelect={onSelect} />);
      expect(container.firstChild == null).toBe(true);
    });
    it('Localstorage is called when query is null', async () => {
      locs.addSearchTermToLocalStorage('test');
      locs.addSearchTermToLocalStorage('word');
      locs.addSearchTermToLocalStorage('play');
      let { container, getByText } = render(
        <Results useCashing={true} hasSearched={true} onClick={onClick} onRemove={onRemove} onSelect={onSelect} />
      );
      expect(container.childNodes.length).toBe(2);

      const secondChild = container.childNodes[1];
      expect(secondChild.childNodes.length).toBe(3);

      const test = getByText('test');
      const word = getByText('word');
      const play = getByText('play');
      expect(test).toBeInTheDocument();
      expect(word).toBeInTheDocument();
      expect(play).toBeInTheDocument();
    });

    it('No highlighted results are rendered correctly', async () => {
      let { container, getByText } = render(
        <Results
          results={['test', 'word', 'play', 'node', 'math']}
          useCashing={true}
          hasSearched={true}
          onClick={onClick}
          onRemove={onRemove}
          onSelect={onSelect}
        />
      );
      expect(container.childNodes.length).toBe(2);

      const secondChild = container.childNodes[1];
      expect(secondChild.childNodes.length).toBe(5);

      const test = getByText('test');
      const word = getByText('word');
      const play = getByText('play');
      const node = getByText('node');
      const math = getByText('math');
      expect(test).toBeInTheDocument();
      expect(word).toBeInTheDocument();
      expect(play).toBeInTheDocument();
      expect(node).toBeInTheDocument();
      expect(math).toBeInTheDocument();
    });
    it('Highlighted results are rendered correctly', async () => {
      let { container, getByText } = render(
        <Results
          results={['wordplay', 'test', 'math']}
          query={'word'}
          useCashing={true}
          hasSearched={true}
          onClick={onClick}
          onRemove={onRemove}
          onSelect={onSelect}
        />
      );
      expect(container.childNodes.length).toBe(2);

      const secondChild = container.childNodes[1];
      expect(secondChild.childNodes.length).toBe(3);

      const wordComponent = secondChild.childNodes[1];
      const word = getByText('word');
      const play = getByText('play');

      expect(wordComponent.childNodes.length).toBe(3);
      expect(word).toBeInTheDocument();
      expect(play).toBeInTheDocument();

      const testComponent = secondChild.childNodes[1];
      const test = getByText('test');

      expect(testComponent.childNodes.length).toBe(3);
      expect(test).toBeInTheDocument();

      const mathComponent = secondChild.childNodes[1];
      const math = getByText('math');

      expect(mathComponent.childNodes.length).toBe(3);
      expect(math).toBeInTheDocument();
    });
  });
});
