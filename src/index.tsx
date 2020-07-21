import './assets/searchbar.css';

import React from 'react';

import { goToGowiz } from './request';
import { addSearchTermToLocalStorage, removeSearchTermFromLocalStorage } from './util';
import { Input } from './components/input';
import { Results } from './components/result';

export interface Options {
  query?: string;
  placeholder?: string;
  useCaching?: boolean;
  showInputSearchIcon?: boolean;
  showResultsSearchIcon?: boolean;
  useAutoComplete?: boolean;
  maxResults?: number;
  searchSuggestions?: string[];
}
//TODO: add props autofocus. DO you want the input to use outofocus?
//TODO: each search sugeestions should be no no longer than 150 chars

interface SearchBarState {
  current_query: string;
  results: string[];
  useAutoComplete: boolean;
  highlight_query_index: number;
  highlight_query: '';
  hasSearched: boolean;
}

export class ToGowizSearchBar extends React.PureComponent<Options, SearchBarState> {
  constructor(props: Options) {
    super(props);
    this.state = {
      current_query: this.props.query,
      results: this.props.searchSuggestions,
      useAutoComplete: this.props.useAutoComplete !== false,
      highlight_query_index: -1,
      highlight_query: '',
      hasSearched: false,
    };

    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnCancel = this.handleOnCancel.bind(this);
    this.handleOnKey = this.handleOnKey.bind(this);

    this.handleSearchSuggestionRemove = this.handleSearchSuggestionRemove.bind(this);
  }

  handleOnSubmit(event: any): void {
    event.preventDefault();
    let query = this.state.current_query;
    if (query != null && query.length > 0) {
      this.setState({ current_query: query });
      addSearchTermToLocalStorage(query);
      goToGowiz(query);
    }
  }
  handleOnChange(event: any): void {
    //TODO: we should only getch suggestions whn user has typed the search query or if it's the inital one. not fetching when clicking using arrows
    event.preventDefault();
    // TODO: fetch new auotocomeplete suggestions

    if (this.state.hasSearched === false) {
      if (this.state.useAutoComplete === true) {
        this.setState({ current_query: event.target.value, hasSearched: true });
      } else {
        this.setState({ current_query: event.target.value, hasSearched: true });
      }
    } else {
      if (this.state.useAutoComplete === true) {
        this.setState({ current_query: event.target.value });
      } else {
        this.setState({ current_query: event.target.value });
      }
    }
  }
  handleOnCancel(event: any): void {
    event.preventDefault();
    this.setState({ current_query: '', useAutoComplete: false });
  }

  handleOnSelect(event: any) {
    event.preventDefault();
    let query = event.target.textContent;
    if (query != null && query.length > 0) {
      addSearchTermToLocalStorage(query);
      goToGowiz(query);
    }
  }

  handleOnKey(event) {
    if (['Enter', 'ArrowRight', 'Tab'].includes(event.key)) {
      event.preventDefault();
      if (event.key === 'Enter') {
        this.handleOnSubmit(event);
      }
    } else if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      const max_nr = this.state.results.length - 1;
      const change = event.key === 'ArrowUp' ? -1 : 1;

      let current_nr = this.state.highlight_query_index + change;
      current_nr = current_nr < -1 || current_nr > max_nr ? -1 : current_nr;

      const next_query = current_nr === -1 ? this.props.query : this.state.results[current_nr];

      this.setState({
        highlight_query_index: current_nr,
        current_query: next_query,
      });
    } else if (event.key === 'Escape') {
      event.preventDefault();
      if (this.state.useAutoComplete === true) {
        this.setState({ useAutoComplete: false });
      }
    }
  }
  handleSearchSuggestionRemove(str: string) {
    removeSearchTermFromLocalStorage(str);
  }

  componentDidUpdate(prevProps: Readonly<Options>, prevState: Readonly<SearchBarState>, snapshot?: any): void {
    console.count('Index');
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleOnKey, false);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleOnKey, false);
  }

  //TODO: gary backround can only be present on a single element. if mouse is on an element the it's highlighted
  //TODO: implement should compoennts update
  //TODO: handle click outside of the searchbar are

  render() {
    const {
      searchSuggestions: [],
      placeholder = 'Search on Gowiz',
      useCaching = true,
      showInputSearchIcon = true,
      showResultsSearchIcon = true,
      maxResults = 10,
    } = this.props;
    const { results, current_query, useAutoComplete, hasSearched } = this.state;

    return (
      <div className="gowiz_searchbar_container">
        <form onSubmit={this.handleOnSubmit}>
          <div className="gowiz_searchbar_input">
            <Input
              query={current_query}
              placeholder={placeholder}
              onChange={this.handleOnChange}
              onCancel={this.handleOnCancel}
              showInputSearchIcon={showInputSearchIcon}
            />
          </div>
          <div className="gowiz_searchbar_results">
            {useAutoComplete && (
              <Results
                onSelect={this.handleOnSelect}
                onRemove={this.handleSearchSuggestionRemove}
                maxResults={maxResults}
                results={results}
                showResultsSearchIcon={showResultsSearchIcon}
                useCashing={useCaching}
                query={current_query}
                hasSearched={hasSearched}
              />
            )}
          </div>
        </form>
      </div>
    );
  }
}
