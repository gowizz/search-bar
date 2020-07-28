import { domain_to_host, reformat_url, url_is_valid } from './string_util';
import { addSearchTermToLocalStorage, getInputSessionToken, removeInputSessionToken } from './storage';
import { SearchResult } from '../models/model';

export function goToGowiz(user_query: string, token: string, pre_defined_domains: string[] = []): void {
  const session_token_from_storage = getInputSessionToken();

  if (session_token_from_storage != token) {
    removeInputSessionToken();
    return;
  }
  removeInputSessionToken();

  const max_url_length = 2048;
  const base_URL = 'https://gowiz.eu/search/';

  let search_query: string;

  let query_components = user_query.split(' ');
  let all_domains = pre_defined_domains;

  query_components = query_components.filter(function (el) {
    //TODO: we should only use site:
    //site: +1
    if (el === 'site:' || el === 'Site:') {
      return null;
    } else if (el.length > 6) {
      const el_includes_site = el.includes('site:'); // TODO: oneliner
      const el_includes_Site = el.includes('Site:'); //

      if (el_includes_site || el_includes_Site) {
        const parts = el_includes_site ? el.split('site:') : el.split('Site:');
        all_domains.unshift(parts[1]);
        return null;
      }
    }
    return el;
  });
  query_components = query_components.filter(function (el) {
    return el != null;
  });

  search_query = query_components.join(' ');
  if (all_domains.length > 0) {
    all_domains = all_domains.map((d) => domain_to_host(d));
    all_domains = all_domains.filter((v, i, a) => a.indexOf(v) === i);
    all_domains = all_domains.filter(function (el) {
      if (url_is_valid(el)) {
        return el;
      }
      return null;
    });

    all_domains = all_domains.filter(function (el) {
      return el != null;
    });
    if (all_domains.length > 0) {
      search_query += ' site:' + all_domains.toString();
    }
  }

  const request_url = reformat_url(base_URL, search_query);
  const request_url_is_valid = request_url.length <= max_url_length && request_url != base_URL;

  if (request_url_is_valid) {
    window.location.replace(request_url);
  }
}

export interface SearchParams {
  query: string;
  token: string;
}

export function getQueryAndToken(useCaching: boolean): SearchParams {
  const inputs: HTMLElement | null = document.getElementById('gowiz_searchbox_form');
  if (inputs === null) {
    return {
      query: '',
      token: '',
    };
  }
  const query = inputs['query']['value'];
  const token = inputs['token']['value'];

  if (useCaching) {
    addSearchTermToLocalStorage(query);
  }

  return {
    query: query,
    token: token,
  };
}

export function getSearchResults(sessionToken: string, query: string, API_KEY: string): SearchResult[] {
  //TODO: implement
  console.log('Sending search request to the api with token:' + sessionToken + ' query' + query + 'API_KEY' + API_KEY);
  return [];
}
