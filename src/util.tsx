import * as process from 'process';

export function searchTermInLocalStorage(name: string): boolean {
  const keyword = 'gowiz_search_suggestion_' + name;
  if (keyword in localStorage) {
    const object = JSON.parse(localStorage.getItem(keyword));
    if (new Date(object.timestamp).getTime() > new Date().getTime()) {
      return true;
    }
    removeSearchTermFromLocalStorage(name);
  }
  return false;
}

export function getSearchTermsInLocalStorage(): string[] {
  //TODO: we should remove values that have been expired
  const ls = { ...localStorage };

  let items = Object.keys(ls).map(function (key) {
    return [key, ls[key]];
  });

  items.sort(function (first, second) {
    return JSON.parse(second[1]).timestamp - JSON.parse(first[1]).timestamp;
  });

  let search_terms = [];

  for (let index in items) {
    const array = items[index];
    if (array[0].includes('gowiz_search_suggestion_')) {
      search_terms.push(array[0].split('gowiz_search_suggestion_')[1]);
      //TODO: we should check if values has expired and then remove it
    }
  }
  return search_terms;
}
export function removeSearchTermFromLocalStorage(name: string): void {
  const keyword = 'gowiz_search_suggestion_' + name;
  localStorage.removeItem(keyword);
}

export function addSearchTermToLocalStorage(name: string): void {
  const keyword = 'gowiz_search_suggestion_' + name;
  const expiry_timestamp = new Date(new Date().getTime() + performance.now() + 2592000000).getTime(); // + 30 days
  const object = { timestamp: expiry_timestamp };
  localStorage.setItem(keyword, JSON.stringify(object));
}

export function reformatQueryForSearch(query: string): string {
  query = query.trim();
  return query;
}
/*
export function reformatQueryForSearch(query: string): string {
  query = query.trim();

  if (query.length > 128) {
    query = query.substring(0, 128);
  }

  const nr_of_words_in_query = query
    .trim()
    .split(' ')
    .filter(function (n) {
      return n !== '';
    }).length;
  if (nr_of_words_in_query > 50) {
    query = query.split(' ').splice(0, 50).join(' ');
  }

  query = query.replace('%20', '');
  return query;
}

 */

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
