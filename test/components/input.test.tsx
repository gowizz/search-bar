import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import Input from '../../src/components/input';
import { cleanup, fireEvent, render } from '@testing-library/react';

describe('Input', () => {
  const onCancel = jest.fn();
  const onChange = jest.fn();
  afterEach(cleanup);

  describe('Default props', () => {
    it('Input has search icon', async () => {
      let { container } = render(<Input onChange={onChange} onCancel={onCancel} />);
      expect(container.firstChild).toHaveClass('search_icon');
      expect(container.firstChild.hasChildNodes()).toBe(true);
      expect(container.childNodes.length).toBe(2);

      const svg = container.firstChild.childNodes[0];
      expect(svg.nodeName).toBe('svg');
    });

    it('Input does not have cancel button', async () => {
      let { container } = render(<Input onChange={onChange} onCancel={onCancel} />);
      expect(container.childNodes.length).toBe(2);
    });

    it('Default props are set correctly', async () => {
      let { container, queryByTestId } = render(<Input onChange={onChange} onCancel={onCancel} />);
      expect(container.childNodes.length).toBe(2);

      const input_class = container.childNodes[1];

      expect(input_class).toHaveClass('search_input');
      expect(input_class.childNodes.length).toBe(1);

      const input = queryByTestId('search_input_input');

      const spellcheck = input.getAttribute('spellcheck');
      const placeholder = input.getAttribute('placeholder');
      const autocomplete = input.getAttribute('autocomplete');
      const name = input.getAttribute('name');
      const type = input.getAttribute('type');
      const title = input.getAttribute('title');
      const aria_required = input.getAttribute('aria-required');
      const aria_label = input.getAttribute('aria-label');
      const tabindex = input.getAttribute('tabindex');
      const value = input.getAttribute('value');

      expect(input.getAttributeNames().length).toBe(11);
      expect(spellcheck).toBe('true');
      expect(placeholder).toBe('Search on Gowiz');
      expect(autocomplete).toBe('off');
      expect(name).toBe('query');
      expect(type).toBe('text');
      expect(title).toBe('Search on Gowiz');
      expect(aria_required).toBe('true');
      expect(aria_label).toBe('Search query input');
      expect(tabindex).toBe('1');
      expect(value).toBe('');
    });
  });

  describe('Custom props', () => {
    it('Input renders without search icon', async () => {
      let { container } = render(<Input showInputSearchIcon={false} onChange={onChange} onCancel={onCancel} />);

      expect(container.childNodes.length).toBe(1);
      expect(container.firstChild).toHaveClass('search_input');
      expect(container.firstChild.hasChildNodes()).toBe(true);

      const input = container.firstChild.childNodes[0];
      expect(input.nodeName).toBe('INPUT');
    });
  });

  describe('Query', () => {
    it('Input query can be set', async () => {
      let { container, queryByTestId } = render(<Input query={'test'} onChange={onChange} onCancel={onCancel} />);
      expect(container.childNodes.length).toBe(3);

      const input_class = container.childNodes[1];

      expect(input_class).toHaveClass('search_input');
      expect(input_class.childNodes.length).toBe(1);

      const input = queryByTestId('search_input_input');

      const value = input.getAttribute('value');
      expect(value).toBe('test');
    });

    it('Input query changes title', async () => {
      let { queryByTestId } = render(<Input query={'test'} onChange={onChange} onCancel={onCancel} />);
      const input = queryByTestId('search_input_input');
      const title = input.getAttribute('title');

      expect(title).toBe('Search test on Gowiz');
    });

    it('Undefined query is handled correctly', async () => {
      let { container, queryByTestId } = render(<Input query={undefined} onChange={onChange} onCancel={onCancel} />);
      expect(container.childNodes.length).toBe(2);

      const input_class = container.childNodes[1];

      expect(input_class).toHaveClass('search_input');
      expect(input_class.childNodes.length).toBe(1);

      const input = queryByTestId('search_input_input');

      const value = input.getAttribute('value');
      const title = input.getAttribute('title');

      expect(value).toBe('');
      expect(title).toBe('Search on Gowiz');
    });

    it('Null query is handled correctly', async () => {
      let { container, queryByTestId } = render(<Input query={null} onChange={onChange} onCancel={onCancel} />);
      expect(container.childNodes.length).toBe(2);

      const input_class = container.childNodes[1];

      expect(input_class).toHaveClass('search_input');
      expect(input_class.childNodes.length).toBe(1);

      const input = queryByTestId('search_input_input');

      const value = input.getAttribute('value');
      const title = input.getAttribute('title');

      expect(value).toBe('');
      expect(title).toBe('Search on Gowiz');
    });

    it('Empty query is handled correctly', async () => {
      let { container, queryByTestId } = render(<Input query={''} onChange={onChange} onCancel={onCancel} />);
      expect(container.childNodes.length).toBe(2);

      const input_class = container.childNodes[1];

      expect(input_class).toHaveClass('search_input');
      expect(input_class.childNodes.length).toBe(1);

      const input = queryByTestId('search_input_input');

      const value = input.getAttribute('value');
      const title = input.getAttribute('title');

      expect(value).toBe('');
      expect(title).toBe('Search on Gowiz');
    });

    it('First space bar in query is treated correctly', async () => {
      let { container, queryByTestId } = render(<Input query={'          '} onChange={onChange} onCancel={onCancel} />);
      expect(container.childNodes.length).toBe(2);

      const input_class = container.childNodes[1];

      expect(input_class).toHaveClass('search_input');
      expect(input_class.childNodes.length).toBe(1);

      const input = queryByTestId('search_input_input');

      const value = input.getAttribute('value');
      const title = input.getAttribute('title');

      expect(value).toBe('');
      expect(title).toBe('Search on Gowiz');
    });
  });

  describe('Placeholder', () => {
    it('Placeholder query can be set', async () => {
      let { container, queryByTestId } = render(
        <Input placeholder={'Search...'} onChange={onChange} onCancel={onCancel} />
      );
      expect(container.childNodes.length).toBe(2);

      const input_class = container.childNodes[1];

      expect(input_class).toHaveClass('search_input');
      expect(input_class.childNodes.length).toBe(1);

      const input = queryByTestId('search_input_input');

      const value = input.getAttribute('placeholder');
      expect(value).toBe('Search...');
    });

    it('Placeholder does not changes title', async () => {
      let { queryByTestId } = render(<Input placeholder={'Search...'} onChange={onChange} onCancel={onCancel} />);
      const input = queryByTestId('search_input_input');
      const title = input.getAttribute('title');

      expect(title).toBe('Search on Gowiz');
    });

    it('Undefined placeholder is handled correctly', async () => {
      let { container, queryByTestId } = render(
        <Input query={'test'} placeholder={undefined} onChange={onChange} onCancel={onCancel} />
      );
      expect(container.childNodes.length).toBe(3);

      const input_class = container.childNodes[1];

      expect(input_class).toHaveClass('search_input');
      expect(input_class.childNodes.length).toBe(1);

      const input = queryByTestId('search_input_input');

      const placeholder = input.getAttribute('placeholder');

      expect(placeholder).toBe('Search on Gowiz');
    });

    it('Null placeholder is handled correctly', async () => {
      let { container, queryByTestId } = render(
        <Input query={'test'} placeholder={null} onChange={onChange} onCancel={onCancel} />
      );
      expect(container.childNodes.length).toBe(3);

      const input_class = container.childNodes[1];

      expect(input_class).toHaveClass('search_input');
      expect(input_class.childNodes.length).toBe(1);

      const input = queryByTestId('search_input_input');

      const value = input.getAttribute('value');
      const title = input.getAttribute('title');
      const placeholder = input.getAttribute('placeholder');

      expect(value).toBe('test');
      expect(title).toBe('Search test on Gowiz');
      expect(placeholder).toBe('');
    });

    it('Empty placeholder is handled correctly', async () => {
      let { container, queryByTestId } = render(
        <Input query={''} placeholder={undefined} onChange={onChange} onCancel={onCancel} />
      );
      expect(container.childNodes.length).toBe(2);

      const input_class = container.childNodes[1];

      expect(input_class).toHaveClass('search_input');
      expect(input_class.childNodes.length).toBe(1);

      const input = queryByTestId('search_input_input');

      const placeholder = input.getAttribute('placeholder');

      expect(placeholder).toBe('Search on Gowiz');
    });

    it('Placeholder does not change space bar', async () => {
      let { container, queryByTestId } = render(
        <Input placeholder={' Search...  '} onChange={onChange} onCancel={onCancel} />
      );
      expect(container.childNodes.length).toBe(2);

      const input_class = container.childNodes[1];

      expect(input_class).toHaveClass('search_input');
      expect(input_class.childNodes.length).toBe(1);

      const input = queryByTestId('search_input_input');

      const placeholder = input.getAttribute('placeholder');

      expect(placeholder).toBe(' Search...  ');
    });
  });

  describe('Cancel', () => {
    it('Cancel function can be called', async () => {
      let { container } = render(<Input query={'test'} onChange={onChange} onCancel={onCancel} />);
      expect(container.childNodes.length).toBe(3);

      const cancel = container.childNodes[2];

      fireEvent.click(cancel);
      expect(onCancel).toBeCalled();
      expect(onCancel).toBeCalledTimes(1);
    });
  });
});
