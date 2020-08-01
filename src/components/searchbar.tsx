import React from 'react';
import SearchContainer from './searchcontainer';
import { api_key_is_valid } from '../util/component_validation';
import { getSearchResults } from '../util/request';
import { getQueryAndToken } from '../util/searchcontainer_util';

export interface SearchbarOptions {
  onSubmit: (response) => void;
  API_KEY: string;
  query?: string;
  placeholder?: string;
  useCaching?: boolean;
  useDarkTheme?: boolean;
  showInputSearchIcon?: boolean;
  showResultsSearchIcon?: boolean;
  useAutoComplete?: boolean;
  useAutoFocus?: boolean;
  maxResults?: number;
  searchSuggestions?: string[];
  searchDomains?: string[];
}

export default class Searchbar extends React.Component<SearchbarOptions> {
  constructor(props) {
    super(props);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
  }

  handleOnSubmit(event: any): void {
    event.preventDefault();

    const inputs: HTMLElement | null = document.getElementById('gowiz_searchbox_form');
    if (inputs === null) {
      return;
    }

    const useCaching =
      this.props.useCaching != null || this.props.useCaching != undefined ? true : this.props.useCaching;

    const res = getQueryAndToken(useCaching);
    const query = res.query;
    const token = res.token;

    const should_send_request = query != null && query.length > 0 && token != null;

    if (should_send_request) {
      const API_KEY = this.props.API_KEY;

      const search_results = getSearchResults(token, query, API_KEY);

      this.props.onSubmit(search_results);
    }
  }

  render() {
    api_key_is_valid(this.props.API_KEY);

    const {
      query = '',
      placeholder = 'Search on Gowiz',
      useCaching = true,
      showInputSearchIcon = true,
      showResultsSearchIcon = true,
      useAutoFocus = false,
      useDarkTheme = false,
      maxResults = 10,
      useAutoComplete,
      searchSuggestions,
      searchDomains,
    } = this.props;

    return (
      <SearchContainer
        onSubmit={this.handleOnSubmit}
        query={query}
        placeholder={placeholder}
        useCaching={useCaching}
        showInputSearchIcon={showInputSearchIcon}
        showResultsSearchIcon={showResultsSearchIcon}
        useAutoComplete={useAutoComplete}
        useDarkTheme={useDarkTheme}
        useAutoFocus={useAutoFocus}
        maxResults={maxResults}
        searchSuggestions={searchSuggestions}
        searchDomains={searchDomains}
      />
    );
  }
}
