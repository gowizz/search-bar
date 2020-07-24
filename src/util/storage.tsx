import uuid from 'uuid';

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

export function generateInputSessionToken(): string {
  const key = 'input_form_token';
  const token: string = uuid();
  sessionStorage.setItem(key, token);
  return token;
}
export function getInputSessionToken(key: string = 'input_form_token'): string {
  return sessionStorage.getItem(key);
}
export function removeInputSessionToken(key: string = 'input_form_token'): void {
  sessionStorage.removeItem(key);
}
