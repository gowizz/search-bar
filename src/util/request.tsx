import { domain_to_host, reformat_url, url_is_valid } from './string_util';
import { getInputSessionToken, removeInputSessionToken } from './storage';
import { SearchRequest, SearchRequestResponse } from '../models/model';

const axios = require('axios');

export interface SearchParams {
  query: string;
  token: string;
}

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

  //TODO: move this logic to searchcontainer util

  query_components = query_components.filter(function (el) {
    if (el === 'site:') {
      return null;
    } else if (el.length > 6) {
      const el_includes_site = el.includes('site:');
      if (el_includes_site) {
        const parts = el.split('site:');
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

// @ts-ignore
export function getSearchResults(token: string, query: string, API_KEY: string): SearchRequest {
  const session_token_from_storage = getInputSessionToken();

  if (session_token_from_storage != token) {
    removeInputSessionToken();
    return {
      status: SearchRequestResponse.FAILURE,
      duration: 10,
      data: [],
    };
  }
  removeInputSessionToken();

  //TODO: implement

  return {
    status: SearchRequestResponse.SUCCESS,
    duration: 1300,
    data: [
      {
        title: 'Example domain',
        url: 'https://example.org',
        meta: 'Example Domain. This domain is for use in illustrative examples in documents. ...',
        favicon: 'https://example.org/favicon.ico',
      },
      {
        title: 'Example domain 2',
        url: 'https://example.com',
        meta: 'Example Domain. This domain is for use in illustrative examples in documents. ...',
        favicon: 'https://example.org/favicon.ico',
      },
      {
        title: 'Example domain 3',
        url: 'https://example.io',
        meta: 'Example Domain. This domain is for use in illustrative examples in documents. ...',
        favicon: 'https://example.org/favicon.ico',
      },
    ],
  };
}

export const fetch_GET = async (url: string, timout_in_seconds: number) => {
  const conf = {
    timeout: timout_in_seconds * 1000,
  };
  return await axios
    .get(url, conf)
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      return [];
    });
};
