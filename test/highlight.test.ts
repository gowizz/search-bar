import * as highlight from '../src/util/highlight';

beforeEach(() => {
  localStorage.clear();
});

describe('Highlighting', () => {
  it('empty values', () => {
    let highlights = highlight.getHighlightParts('', '');
    expect(highlights.length).toBe(0);
    highlights = highlight.getHighlightParts(undefined, '');
    expect(highlights.length).toBe(0);
    /*                               */
    highlights = highlight.getHighlightParts('test', '');
    expect(highlights.length).toBe(0);
    /*                               */
    highlights = highlight.getHighlightParts('', 'test');
    expect(highlights.length).toBe(0);
  });
  it('equal queries', () => {
    let highlights = highlight.getHighlightParts('test', 'test');
    expect(highlights.length).toBe(0);
    /*                               */
    highlights = highlight.getHighlightParts('test', 'Test');
    expect(highlights.length).toBe(0);
    /*                               */
    highlights = highlight.getHighlightParts('test', ' test');
    expect(highlights.length).toBe(0);
  });
  it('basic highlighting', () => {
    let highlights = highlight.getHighlightParts('gowiz', 'g');
    expect(highlights.length).toBe(2);
    expect(highlights).toStrictEqual(['g', 'owiz']);
    /*                                 */
    highlights = highlight.getHighlightParts('gowiz', ' g');
    expect(highlights.length).toBe(2);
    expect(highlights).toStrictEqual(['g', 'owiz']);
  });
});
