import './assets/search_bar.css';
import shallowCompare from 'react-addons-shallow-compare';
import React from 'react';

import Results from './components/result';
import Input from './components/input';
import { addSearchTermToLocalStorage, removeSearchTermFromLocalStorage } from './util/storage';
import { goToGowiz } from './util/request';
import { index_has_valid_props } from './util/component_validation';
import { HiddenInput } from './components/hidden_input';

export interface Options {
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

export class Searchbox extends React.Component<Options, SearchBarState> {
  private readonly result_ref: React.RefObject<Results>;

  constructor(props: Options) {
    index_has_valid_props(props);

    super(props);
    this.state = {
      current_query: this.props.query ? this.props.query : '',
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

    this.result_ref = React.createRef();
  }

  handleOnSubmit(event: any): void {
    event.preventDefault();

    const inputs = document.getElementById('gowiz_searchbox_form');
    const query = inputs['query']['value'];
    const token = inputs['token']['value'];

    const should_send_request = query != null && query.length > 0 && token != null;

    if (should_send_request) {
      addSearchTermToLocalStorage(query);
      goToGowiz(query, token, this.props.searchDomains);
    }
  }

  handleOnChange(event: any): void {
    event.preventDefault();

    const { hasSearched, useAutoComplete } = this.state;

    const user_has_no_searched_and_we_use_autocomplete = hasSearched === false && useAutoComplete === true;
    const user_has_no_searched_and_we_do_not_use_autocomplete = hasSearched === false && useAutoComplete === false;

    const user_has_searched_and_we_use_autocomplete = hasSearched === true && useAutoComplete === true;
    const user_has_searched_and_we_do_not_use_autocomplete = hasSearched === true && useAutoComplete === false;

    if (user_has_no_searched_and_we_use_autocomplete) {
      this.setState({ current_query: event.target.value, hasSearched: true });
    } else if (user_has_no_searched_and_we_do_not_use_autocomplete) {
      this.setState({ current_query: event.target.value, hasSearched: true });
    } else if (user_has_searched_and_we_use_autocomplete) {
      this.setState({ current_query: event.target.value });
    } else if (user_has_searched_and_we_do_not_use_autocomplete) {
      this.setState({ current_query: event.target.value });
    }
  }

  handleOnCancel(event: any): void {
    event.preventDefault();
    this.setState({ current_query: '', useAutoComplete: false });
  }

  handleOnSelect(event: any) {
    const inputs = document.getElementById('gowiz_searchbox_form');

    const token = inputs['token']['value'];
    const query = event.target.textContent;

    const should_send_request = query != null && query.length > 0 && token != null;

    if (should_send_request) {
      this.setState({ current_query: query });
      addSearchTermToLocalStorage(query);
      goToGowiz(query, token, this.props.searchDomains);
    }
  }

  handleOnKey(event) {
    if (['Enter'].includes(event.key)) {
      event.preventDefault();
      console.log(event.target.id);
      if (event.target.id == 'cancel_icon') {
        this.handleOnCancel(event);
      } else if (event.target.id == 'remove_icon') {
        const title = event.target.title; // TODO: change this if you introduce transaltions
        const query = title.split(' ')[1];
        this.handleSearchSuggestionRemove(query);
      } else {
        this.handleOnSubmit(event);
      }
    } else if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();

      if (this.state.results.length > 0) {
        const max_nr = this.state.results.length - 1;
        const change = event.key === 'ArrowUp' ? -1 : 1;

        let current_nr = this.state.highlight_query_index + change;
        current_nr = current_nr < -1 || current_nr > max_nr ? -1 : current_nr;

        const next_query = current_nr === -1 ? this.props.query : this.state.results[current_nr];

        this.setState({
          highlight_query_index: current_nr,
          current_query: next_query,
        });
      }
    } else if (['Escape'].includes(event.key)) {
      event.preventDefault();

      const should_trigger_state_change = this.state.results.length > 0;
      if (should_trigger_state_change) {
        if (this.state.useAutoComplete === true) {
          this.setState({ useAutoComplete: false });
        }
      }
    }
  }

  handleSearchSuggestionRemove(str: string) {
    removeSearchTermFromLocalStorage(str);
    this.result_ref.current.forceUpdateMe();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleOnKey, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleOnKey, false);
  }

  shouldComponentUpdate(nextProps: Readonly<Options>, nextState: Readonly<SearchBarState>, nextContext: any): boolean {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const {
      searchSuggestions: [],
      placeholder = 'Search on Gowiz',
      useCaching = true,
      showInputSearchIcon = true,
      showResultsSearchIcon = true,
      useAutoFocus = false,
      maxResults = 10,
    } = this.props;
    const { results, current_query, hasSearched } = this.state;

    const results_should_render = results != undefined && results.length > 0 && hasSearched;

    return (
      <div className="gowiz_searchbar_container">
        <form onSubmit={(e) => this.handleOnSubmit(e)} id={'gowiz_searchbox_form'}>
          <div className="gowiz_searchbar_input">
            <Input
              query={current_query}
              placeholder={placeholder}
              useAutoFocus={useAutoFocus}
              onChange={this.handleOnChange}
              onCancel={this.handleOnCancel}
              showInputSearchIcon={showInputSearchIcon}
            />
          </div>
          {results_should_render && (
            <div className="gowiz_searchbar_results">
              <Results
                ref={this.result_ref}
                onSelect={this.handleOnSelect}
                onRemove={this.handleSearchSuggestionRemove}
                maxResults={maxResults}
                results={results}
                showResultsSearchIcon={showResultsSearchIcon}
                useCashing={useCaching}
                query={current_query}
                hasSearched={hasSearched}
              />
            </div>
          )}
          <HiddenInput />
        </form>
      </div>
    );
  }
}

export class SearchBar extends React.Component<Options, SearchBarState> {
  render() {
    return <h1>The implementation of this component is not yet complete</h1>;
  }
}

//TODO: we should only fetch suggestions whn user has typed the search query or if it's the initial one. not fetching when clicking using arrows
// TODO: fetch new autocomplete suggestions
//TODO: gary background can only be present on a single element. if mouse is on an element the it's highlighted
//TODO: handle click outside of the search bar are
//TODO: use props validation
//TODO: double click on input should show last 10 historic searches is autofocus is not enabled
//TODO: if props does not use autocomplete, then results are adjusted using fuse search
