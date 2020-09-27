import React from 'react';

import SearchContainer from './searchcontainer';
import { getQueryAndToken } from '../util/searchcontainer_util';
import { goToGowiz } from '../util/request';

export interface SearchboxOptions {
  query?: string;
  placeholder?: string;
  useCaching?: boolean;
  showInputSearchIcon?: boolean;
  showResultsSearchIcon?: boolean;
  useAutoComplete?: boolean;
  useDarkTheme?: boolean;
  useAutoFocus?: boolean;
  maxResults?: number;
  searchSuggestions?: string[];
  searchDomains?: string[];
}

export default class Searchbox extends React.PureComponent<SearchboxOptions> {
  constructor(props) {
    super(props);

    this.handleOnSubmit = this.handleOnSubmit.bind(this);
  }

  handleOnSubmit(event: any): void {
    event.preventDefault();

    const useCaching = this.props.useCaching != null || this.props.useCaching != undefined;

    const res = getQueryAndToken(useCaching);
    const should_send_request = res.query != null && res.query.length > 0 && res.token != null;

    if (should_send_request) {
      goToGowiz(res.query, res.token, this.props.searchDomains);
    }
  }

  render() {
    const {
      query = '',
      placeholder = 'Search on Gowiz',
      useCaching = true,
      showInputSearchIcon = true,
      showResultsSearchIcon = true,
      useAutoFocus = false,
      useDarkTheme = false,
      maxResults = 10,
      useAutoComplete = true,
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
