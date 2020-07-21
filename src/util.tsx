export function searchTermInLocalStorage(name: string): boolean {
  const keyword = 'gowiz_search_suggestion';
  if (keyword in localStorage) {
    const object = JSON.parse(localStorage.getItem(keyword));
    for (let i = 0; i < object.length; i++) {
      if (object[i].query === name) {
        return new Date(object[i].timestamp).getTime() > new Date().getTime();
      }
    }
  }
  return false;
}

export function getSearchTermsInLocalStorage(): string[] {
  const keyword = 'gowiz_search_suggestion';
  let current_values = JSON.parse(localStorage.getItem(keyword));
  const current_timestamp = new Date().getTime();
  if (current_values == null || current_values.length < 1) {
    return [];
  }

  let original_current_values_len = current_values.length;

  for (let i = 0; i < current_values.length; i++) {
    if (current_values[i].timestamp < current_timestamp) {
      current_values[i] = null;
    }
  }
  current_values = current_values.filter(function (el) {
    return el != null;
  });
  if (current_values.length != original_current_values_len) {
    localStorage.setItem(keyword, JSON.stringify(current_values));
  }
  current_values.sort(function (first, second) {
    return second.timestamp - first.timestamp;
  });
  let search_terms = [];
  for (let i = 0; i < current_values.length; i++) {
    search_terms.push(current_values[i].query);
  }
  return search_terms;
}
export function removeSearchTermFromLocalStorage(name: string): void {
  const keyword = 'gowiz_search_suggestion';
  let current_values = JSON.parse(localStorage.getItem(keyword));
  let update_was_made = false;

  if (current_values == null || current_values.length < 1) {
    current_values = [];
  }
  for (let i = 0; i < current_values.length; i++) {
    if (current_values[i].query === name) {
      current_values[i] = null;
      update_was_made = true;
      break;
    }
  }
  current_values = current_values.filter(function (el) {
    return el != null;
  });
  if (update_was_made) {
    if (current_values.length == 0) {
      localStorage.removeItem(keyword);
    } else {
      localStorage.setItem(keyword, JSON.stringify(current_values));
    }
  }
}

export function addSearchTermToLocalStorage(name: string): void {
  const keyword = 'gowiz_search_suggestion';
  let current_values = JSON.parse(localStorage.getItem(keyword));
  let expiry_timestamp = new Date(new Date().getTime() + performance.now() + 2592000000).getTime();
  let obj = { query: name, timestamp: expiry_timestamp };
  let update_was_made = false;
  if (current_values == null || current_values.length < 1) {
    current_values = [];
  }
  for (let i = 0; i < current_values.length; i++) {
    if (current_values[i].query === name) {
      current_values[i] = obj;
      update_was_made = true;
      break;
    }
  }
  if (current_values.length == 0 || update_was_made === false) {
    current_values.push(obj);
  }
  localStorage.setItem(keyword, JSON.stringify(current_values));
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
