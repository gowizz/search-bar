import React from 'react';
import { SearchbarOptions } from '../models/model';

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
