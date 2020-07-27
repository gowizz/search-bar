import React from 'react';
import { Searchresult } from '../models/searchresult';

export interface SearchbarOptions {
  onSubmit: (results: Searchresult[]) => void;
  API_KEY: string;
  query?: string;
  placeholder?: string;
  useCaching?: boolean;
  showInputSearchIcon?: boolean;
  showResultsSearchIcon?: boolean;
  useAutoComplete?: boolean;
  useAutoFocus?: boolean;
  maxResults?: number;
  searchSuggestions?: string[];
  searchDomains?: string[];
}

interface SearchBarState {
  current_query: string;
  results: string[];
  useAutoComplete: boolean;
  highlight_query_index: number;
  highlight_query: '';
  hasSearched: boolean;
}

export default class SearchBar extends React.Component<SearchbarOptions, SearchBarState> {
  render() {
    return <h1>The implementation of this component is not yet complete</h1>;
  }
}
