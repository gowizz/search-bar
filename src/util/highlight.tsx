import { reformatQueryForSearch } from './string_util';

export function getHighlightParts(text: string, query: string): string[] {
  if (text === undefined || query === undefined) {
    return [];
  }
  if (text.length < 1 || query.length < 1) {
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
