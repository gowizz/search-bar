import React from 'react';
import { fireEvent, cleanup, render } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';
import { CancelIconClass, SearchIconClass } from '../src/components/input';
import { validate_icon_props } from '../src/assets/icons';

describe(' Icons', () => {
  const onCancel = jest.fn();
  afterEach(cleanup);
  it('Search icon is present when stated', async () => {
    let { container } = render(<SearchIconClass showInputSearchIcon={true} />);
    expect(container.firstChild).toHaveClass('search_icon');
    expect(container.firstChild.hasChildNodes()).toBe(true);
    expect(container.childNodes.length).toBe(1);
    const svg = container.firstChild.childNodes[0];
    expect(svg.nodeName).toBe('svg');
  });

  it('Search icon is not present when stated', async () => {
    let { container } = render(<SearchIconClass showInputSearchIcon={false} />);
    expect(container.firstChild).toBe(null);
  });

  it('Cancel icon is present when query is present', async () => {
    let { container } = render(<CancelIconClass query={'test'} onCancel={onCancel} />);
    expect(container.firstChild).toHaveClass('cancel_icon');

    const id = container.firstElementChild.getAttribute('id');
    const title = container.firstElementChild.getAttribute('title');
    const tabIndex = container.firstElementChild.getAttribute('tabIndex');

    expect(id).toBe('cancel_icon');
    expect(title).toBe('Clear');
    expect(tabIndex).toBe('2');
    expect(container.firstChild.hasChildNodes()).toBe(true);
    expect(container.childNodes.length).toBe(1);

    const svg = container.firstChild.childNodes[0];

    expect(svg.nodeName).toBe('svg');

    fireEvent.click(container.firstChild);
    expect(onCancel).toBeCalled();
  });
  it('Cancel icon is not present when query is empty', async () => {
    let { container } = render(<CancelIconClass query={''} onCancel={onCancel} />);
    expect(container.firstChild).toBe(null);
  });

  it('Icon props validation works', async () => {
    expect(validate_icon_props('test', 10)).toBe(10);
    expect(() => {
      validate_icon_props('test', -1);
    }).toThrow("test can't be less than 1px");
    expect(() => {
      validate_icon_props('test', 0);
    }).toThrow("test can't be less than 1px");
  });
});
