import { Options } from '../index';
import { string_contains_html_tags, url_is_valid } from './string_util';

function format_index(index: number): string {
  if (index === 1) {
    return index + 'st';
  } else if (index == 2) {
    return index + 'nd';
  } else if (index == 3) {
    return index + 'rd';
  }
  return index + 'th';
}

export function index_has_valid_props(props: Options): void {
  const {
    query = '',
    searchSuggestions = [],
    searchDomains = [],
    placeholder = 'Search on Gowiz',
    maxResults = 10,
  } = props;

  if (query) {
    const max_url_length = 2048;
    const base_URL = 'https://gowiz.eu/search/';
    const request_url = base_URL + encodeURIComponent(query);
    if (request_url.length > max_url_length) {
      const dif = decodeURIComponent(query).length + base_URL.length - max_url_length;
      throw new Error('The entered query is too big. Reduce the length by ' + dif + ' characters.');
    }
    const query_is_valid_type = typeof query === 'string' || typeof query === 'number';
    if (query_is_valid_type === false) {
      throw new Error("The query is not suitable, because query can't be type " + typeof query);
    }
  }

  if (searchSuggestions) {
    if (searchSuggestions.length > 25) {
      throw new Error(
        'The maximum number of search suggestions is 25. Currently entered search suggestion list size is ' +
          searchSuggestions.length
      );
    }

    let search_suggestions_count = {};

    for (let i = 0; i < searchSuggestions.length; i++) {
      const search_suggestion_is_valid_type =
        typeof searchSuggestions[i] === 'string' || typeof searchSuggestions[i] === 'number';
      if (search_suggestion_is_valid_type === false) {
        const error_index = i + 1;

        throw new Error(
          'The ' +
            format_index(error_index) +
            ' search suggestion ' +
            searchSuggestions[i].toString() +
            " is not suitable, because search suggestion can't be type " +
            typeof searchSuggestions[i]
        );
      }

      if (searchSuggestions[i]) {
        const result = search_suggestions_count[searchSuggestions[i]];
        if (result) {
          throw new Error(
            'All search suggestions need to be unique. The first duplicate search suggestion is ' + searchSuggestions[i]
          );
        }
        search_suggestions_count[searchSuggestions[i]] = 1;
        if (string_contains_html_tags(searchSuggestions[i])) {
          throw new Error(searchSuggestions[i] + ' is not a valid search suggestion as it contains HTML tags');
        }
        if (searchSuggestions[i].length > 150) {
          const error_index = i + 1;

          throw new Error(
            'The ' + format_index(error_index) + ' is too long. The maximum search suggestion size 150 characters'
          );
        }
      } else {
        const error_index = i + 1;

        throw new Error('The ' + format_index(error_index) + ' search suggestion is empty');
      }
    }
  }

  if (searchDomains) {
    if (searchDomains.length > 10) {
      throw new Error(
        'The maximum number of domains search can be restricted to is 10. Currently entered search domains list size is' +
          searchDomains.length
      );
    }
    let search_domains_count = {};
    for (let i = 0; i < searchDomains.length; i++) {
      if (searchDomains[i]) {
        const result = search_domains_count[searchDomains[i]] === undefined;

        if (result) {
          throw new Error(
            'All search domains need to be unique. The first duplicate search domain is ' + searchDomains[i]
          );
        }
        search_domains_count[searchDomains[i]] = 1;
        if (url_is_valid(searchDomains[i]) === false) {
          throw new Error(searchDomains[i] + ' is not a valid search domain.');
        }
      } else {
        const error_index = i + 1;
        throw new Error('The ' + error_index + '. search domain is empty');
      }
    }
  }

  if (placeholder) {
    if (placeholder.length > 150) {
      throw new Error(
        'The maximum size of the search bar placeholder can be 150 characters. Currently entered placeholder size is ' +
          placeholder.length +
          ' characters'
      );
    }
  }

  if (maxResults) {
    if (maxResults < 0) {
      throw new Error("Maximum results size can't be negative");
    } else if (maxResults == 0) {
      throw new Error("Maximum results size can't be zero");
    } else if (maxResults > 25) {
      throw new Error(
        "Maximum results size can't be more than 25. Currently entered max results size is " + maxResults
      );
    }
  }
}
