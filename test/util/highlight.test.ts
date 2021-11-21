import * as highlight from '../../src/util/highlight';



describe('Highlighting', () => {

  it('empty values', async () => {
    let highlights = highlight.getHighlightParts('', '');
    expect(highlights.length).toBe(0);
    highlights = highlight.getHighlightParts(undefined, '');
    expect(highlights.length).toBe(0);
    /*                               */
    highlights = highlight.getHighlightParts('test', '');
    expect(highlights.length).toBe(1);
    expect(highlights).toStrictEqual(['test']);
    /*                               */
    highlights = highlight.getHighlightParts('', 'test');
    expect(highlights.length).toBe(0);
    highlights = highlight.getHighlightParts('test', null);
    expect(highlights.length).toBe(1);
    expect(highlights).toStrictEqual(['test']);
  });
  it('equal queries', async () => {
    let highlights = highlight.getHighlightParts('test', 'test');
    expect(highlights.length).toBe(0);
    /*                               */
    highlights = highlight.getHighlightParts('test', 'Test');
    expect(highlights.length).toBe(0);
    /*                               */
    highlights = highlight.getHighlightParts('test', ' test');
    expect(highlights.length).toBe(0);
  });
  it('basic highlighting', async () => {
    let highlights = highlight.getHighlightParts('gowiz', 'g');
    expect(highlights.length).toBe(2);
    expect(highlights).toStrictEqual(['g', 'owiz']);
    /*                                 */
    highlights = highlight.getHighlightParts('gowiz', ' g');
    expect(highlights.length).toBe(2);
    expect(highlights).toStrictEqual(['g', 'owiz']);
  });
});
