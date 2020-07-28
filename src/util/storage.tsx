import { uuid } from 'uuidv4';

interface localstorageObject {
  timestamp: number;
  query: string;
}

export function searchTermInLocalStorage(name: string): boolean {
  const keyword = 'gowiz_search_suggestion';
  if (keyword in localStorage) {
    let object: localstorageObject[] = [];
    const value_from_localstorage = localStorage.getItem(keyword);
    if (value_from_localstorage != null) {
      object = JSON.parse(value_from_localstorage);
    }

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

  const value_from_localstorage = localStorage.getItem(keyword);
  if (value_from_localstorage == null) {
    return [];
  }
  let current_values: localstorageObject[] = JSON.parse(value_from_localstorage);
  const current_timestamp = new Date().getTime();
  if (current_values == null || current_values.length < 1) {
    return [];
  }

  let original_current_values_len = current_values.length;

  let to_remove_index: number[] = [];
  for (let i = 0; i < current_values.length; i++) {
    if (current_values[i].timestamp < current_timestamp) {
      to_remove_index.push(i);
    }
  }
  current_values = current_values.filter(function (_value, index) {
    return to_remove_index.indexOf(index) == -1;
  });

  if (current_values.length != original_current_values_len) {
    localStorage.setItem(keyword, JSON.stringify(current_values));
  }
  current_values.sort(function (first, second) {
    return second.timestamp - first.timestamp;
  });
  let search_terms: string[] = [];
  for (let i = 0; i < current_values.length; i++) {
    search_terms.push(current_values[i].query);
  }
  return search_terms;
}

export function removeSearchTermFromLocalStorage(name: string): void {
  const keyword = 'gowiz_search_suggestion';
  const value_from_localstorage = localStorage.getItem(keyword);
  if (value_from_localstorage == null) {
    return;
  }
  let current_values: localstorageObject[] = JSON.parse(value_from_localstorage);
  let update_was_made = false;

  if (current_values == null || current_values.length < 1) {
    current_values = [];
  }
  let to_remove_index: number[] = [];

  for (let i = 0; i < current_values.length; i++) {
    if (current_values[i].query === name) {
      update_was_made = true;
      to_remove_index.push(i);
      break;
    }
  }
  current_values = current_values.filter(function (_value, index) {
    return to_remove_index.indexOf(index) == -1;
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
  const value_from_localstorage = localStorage.getItem(keyword);
  let current_values: localstorageObject[] = [];
  if (value_from_localstorage != null) {
    current_values = JSON.parse(value_from_localstorage);
  }

  let expiry_timestamp = new Date(new Date().getTime() + performance.now() + 2592000000).getTime();
  let obj = { query: name, timestamp: expiry_timestamp };
  let update_was_made = false;

  for (let i = 0; i < current_values.length; i++) {
    if (current_values[i].query === name) {
      current_values[i] = obj;
      update_was_made = true;
      break;
    }
  }
  if (current_values.length == 0 || !update_was_made) {
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
  return sessionStorage.getItem(key) as string;
}
export function removeInputSessionToken(key: string = 'input_form_token'): void {
  sessionStorage.removeItem(key);
}
