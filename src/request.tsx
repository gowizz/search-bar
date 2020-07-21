import { reformatQueryForSearch } from './util';

export function goToGowiz(query: string): void {
  //TODO: we should validate if the restiricted ULRS are correct
  //TODO: test if windo location was called

  query = reformatQueryForSearch(query);

  const base_URL = 'https://gowiz.eu/search/';
  if (query.length > 0) {
    window.location.replace(base_URL + query);
  }
}
