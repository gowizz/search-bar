import { reformatQueryForSearch } from './string_util';

export function getHighlightParts(text: string, query: string): string[] {
  const textLength = text === null || text === undefined ? 0 : text.length;
  const queryLength = query === null || query === undefined ? 0 : query.length;

  if (queryLength < 1) {
    if (textLength > 0) {
      return [text];
    }
    return [];
  }
  if (textLength < 0) {
    return [];
  }

  text = reformatQueryForSearch(text);
  query = reformatQueryForSearch(query);

  if (text.toLocaleLowerCase() === query.toLocaleLowerCase()) {
    return [];
  }
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.filter(function (e) {
    return e;
  });
}
