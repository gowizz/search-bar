import { domain_to_host, format_index, string_contains_html_tags, url_is_valid } from './string_util';
import { SearchbarOptions, SearchboxOptions } from '../models/model';

function query_is_valid(query: string): void {
  const max_url_length = 2048;
  const base_URL = 'https://gowiz.eu/search/';
  const request_url = base_URL + encodeURIComponent(query);

  if (request_url.length > max_url_length) {
    throw new Error('The entered query is too long');
  }

  if (string_contains_html_tags(query)) {
    throw new Error(query + ' is not a valid query as it contains HTML tags');
  }
}

function placeholder_is_valid(placeholder: string): void {
  const encoded_component = encodeURIComponent(placeholder);
  if (encoded_component.length > 150) {
    throw new Error('Entered placeholder it too long. Maximum placeholder size is 150 characters');
  } else if (string_contains_html_tags(placeholder)) {
    throw new Error(placeholder + ' is not a valid placeholder as it contains HTML tags');
  }
}

function search_suggestions_are_valid(searchSuggestions: string[]): void {
  if (searchSuggestions.length > 25) {
    throw new Error(
      'The maximum number of search suggestions can be 25. Currently ' +
        searchSuggestions.length +
        ' search suggestions have been given'
    );
  }

  let search_suggestions_count: { [el: string]: number } = {};

  for (let i = 0; i < searchSuggestions.length; i++) {
    const el = searchSuggestions[i];

    if (el) {
      const result: boolean = search_suggestions_count[el] !== undefined;
      if (result) {
        throw new Error('All search suggestions need to be unique. The first duplicate search suggestion is ' + el);
      }
      search_suggestions_count[el] = 1;
      if (string_contains_html_tags(el)) {
        throw new Error(el + ' is not a valid search suggestion as it contains HTML tags');
      }
      if (el.length > 150) {
        const error_index = i + 1;

        throw new Error(
          'The ' +
            format_index(error_index) +
            ' search suggestion is too long. The maximum search suggestion size is 150 characters'
        );
      }
    } else {
      const error_index = i + 1;
      throw new Error(
        'Search suggestion can not be empty. The ' + format_index(error_index) + ' search suggestion is empty'
      );
    }
  }
}

function search_domains_are_valid(searchDomains: string[]): void {
  if (searchDomains.length > 10) {
    throw new Error(
      'The maximum number of domains search can be restricted to is 10. Currently ' +
        searchDomains.length +
        ' search domains have been entered'
    );
  }

  let search_domains_count: { [el: string]: number } = {};
  for (let i = 0; i < searchDomains.length; i++) {
    let el = searchDomains[i];

    if (el) {
      if (el != el.trim()) {
        const error_index = i + 1;
        throw new Error('The ' + format_index(error_index) + ' search domain should be trimmed');
      }
      el = domain_to_host(el);
      const result = search_domains_count[el] !== undefined;

      if (result) {
        throw new Error(
          'All search domains need to be unique. The first duplicate search domain is ' + searchDomains[i]
        );
      }
      search_domains_count[el] = 1;

      if (!url_is_valid(el)) {
        throw new Error(el + ' is not a valid search domain');
      }
    } else {
      const error_index = i + 1;
      throw new Error('The ' + format_index(error_index) + ' search domain is empty');
    }
  }
}

function max_results_is_valid(maxResults: number): void {
  if (maxResults < 0) {
    throw new Error('Maximum results size can not be negative');
  } else if (maxResults > 25) {
    throw new Error(
      'Maximum results size can not be more than 25. Currently entered max results size is ' + maxResults
    );
  }
}

function max_results_and_searchsuggestions(maxResults: number, searchSuggestions: string[]): void {
  if (searchSuggestions.length > 0 && maxResults == 0) {
    throw new Error('Maximum results size can not be zero if search suggestions are provided');
  }
}

export function searchbox_has_valid_props(props: SearchboxOptions): void {
  const {
    query = '',
    searchSuggestions = [],
    searchDomains = [],
    placeholder = 'Search on Gowiz',
    maxResults = 10,
  } = props;

  query_is_valid(query);

  search_suggestions_are_valid(searchSuggestions);

  search_domains_are_valid(searchDomains);

  placeholder_is_valid(placeholder);

  max_results_is_valid(maxResults);

  max_results_and_searchsuggestions(maxResults, searchSuggestions);
}

function api_key_is_valid(key: string): void {
  if (key === null) {
    throw new Error('API_KEY can not be null');
  }

  if (key === undefined) {
    throw new Error('API_KEY can not be undefined');
  }

  if (key.length == 0) {
    throw new Error('API_KEY can not be empty');
  }

  if (key !== key.trim()) {
    throw new Error('API_KEY needs to be trimmed');
  }

  const nr_of_words = key.split(' ').length;

  if (nr_of_words > 1) {
    throw new Error('API_KEY can not be multiple words');
  }
}

export function searchbar_has_valid_props(props: SearchbarOptions) {
  const {
    API_KEY,
    query = '',
    placeholder = 'Search on Gowiz',
    maxResults = 10,
    searchSuggestions = [],
    searchDomains = [],
  } = props;

  api_key_is_valid(API_KEY);

  const searchbox_props = {
    query: query,
    searchSuggestions: searchSuggestions,
    searchDomains: searchDomains,
    placeholder: placeholder,
    maxResults: maxResults,
  };

  return searchbox_has_valid_props(searchbox_props);
}
