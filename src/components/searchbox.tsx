import React from 'react';

import { addSearchTermToLocalStorage, removeSearchTermFromLocalStorage } from '../util/storage';
import { goToGowiz } from '../util/request';

import { HiddenInput } from './hidden_input';

import Input from './input';
import Results from './result';
import { SearchboxOptions } from '../models/model';
import { searchbox_has_valid_props } from '../util/component_validation';

interface SearchboxState {
  query: string;
  results: string[];
  useAutoComplete: boolean;
  highlight_query_index: number;
  hasSearched: boolean;
}

export default class Searchbox extends React.PureComponent<SearchboxOptions, SearchboxState> {
  private readonly result_ref: React.RefObject<Results>;

  constructor(props: SearchboxOptions) {
    searchbox_has_valid_props(props);
    super(props);
    this.state = {
      query: this.props.query ? this.props.query : '',
      results: this.initialResults(),
      useAutoComplete:
        this.props.useAutoComplete === null || this.props.useAutoComplete === undefined
          ? true
          : this.props.useAutoComplete,
      highlight_query_index: -1,
      hasSearched: false,
    };

    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnCancel = this.handleOnCancel.bind(this);
    this.handleOnKey = this.handleOnKey.bind(this);

    this.handleSearchSuggestionRemove = this.handleSearchSuggestionRemove.bind(this);

    this.handleOnToSearchBarClick = this.handleOnToSearchBarClick.bind(this);

    this.result_ref = React.createRef();
  }

  initialResults(): string[] {
    const searchSuggestions =
      this.props.searchSuggestions === null || this.props.searchSuggestions === undefined
        ? []
        : this.props.searchSuggestions;

    const maxResults =
      this.props.maxResults === null || this.props.maxResults === undefined
        ? searchSuggestions.length
        : this.props.maxResults;
    return searchSuggestions.slice(0, maxResults);
  }

  handleOnSubmit(event: any): void {
    event.preventDefault();

    const inputs: HTMLElement | null = document.getElementById('gowiz_searchbox_form');
    if (inputs === null) {
      return;
    }
    const query = inputs['query']['value'];
    const token = inputs['token']['value'];

    const should_send_request = query != null && query.length > 0 && token != null;

    if (should_send_request) {
      if (this.state.highlight_query_index != -1) {
        this.setState({ highlight_query_index: -1 });
      }
      addSearchTermToLocalStorage(query);
      goToGowiz(query, token, this.props.searchDomains);
    }
  }

  handleOnChange(event: any): void {
    event.preventDefault();

    const { hasSearched } = this.state;
    const new_query = event.target.value;

    if (!hasSearched) {
      this.setState({
        query: new_query,
        hasSearched: true,
      });
    } else {
      this.setState({
        query: new_query,
      });
    }
  }

  handleOnCancel(event: any): void {
    event.preventDefault();
    const { highlight_query_index } = this.state;

    if (highlight_query_index != -1) {
      this.setState({ query: '', useAutoComplete: false, highlight_query_index: -1 });
    } else {
      this.setState({ query: '', useAutoComplete: false });
    }
  }

  handleOnSelect(event: any) {
    const inputs = document.getElementById('gowiz_searchbox_form');
    if (inputs === null) {
      return;
    }

    const token = inputs['token']['value'];
    const query = event.target.textContent;

    const should_send_request = query != null && query.length > 0 && token != null;

    if (should_send_request) {
      this.setState({ query: query });
      addSearchTermToLocalStorage(query);
      goToGowiz(query, token, this.props.searchDomains);
    }
  }

  handleOnKey(event) {
    if (['Enter'].includes(event.key)) {
      event.preventDefault();

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

      const arrow_changes_state = this.state.results.length > 0 && this.state.hasSearched;
      if (arrow_changes_state) {
        const max_nr = this.state.results.length - 1;
        const change = event.key === 'ArrowUp' ? -1 : 1;

        let current_nr = this.state.highlight_query_index + change;
        current_nr = current_nr <= -1 || current_nr >= max_nr ? -1 : current_nr;

        const next_query =
          current_nr === -1 ? (this.props.query ? this.props.query : '') : this.state.results[current_nr];

        this.setState({
          highlight_query_index: current_nr,
          query: next_query,
        });
      }
    } else if (['Escape'].includes(event.key)) {
      event.preventDefault();

      const should_trigger_state_change = this.state.results.length > 0 && this.state.useAutoComplete;

      if (should_trigger_state_change) {
        this.setState({ useAutoComplete: false });
      }
    }
  }

  handleSearchSuggestionRemove(str: string) {
    removeSearchTermFromLocalStorage(str);
    const result_component = this.result_ref.current;
    if (result_component != null) {
      result_component.forceUpdateMe();
    }
  }

  handleOnToSearchBarClick(str: string) {
    this.setState({
      query: str,
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleOnKey, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleOnKey, false);
  }

  render() {
    const {
      placeholder = 'Search on Gowiz',
      useCaching = true,
      showInputSearchIcon = true,
      showResultsSearchIcon = true,
      useAutoFocus = false,
      useDarkTheme = false,
      maxResults = 10,
    } = this.props;
    const { results, query, hasSearched, useAutoComplete } = this.state;

    const results_should_render =
      results !== undefined && results.length > 0 && hasSearched && useAutoComplete && query.length > 0;

    const container_class = useDarkTheme ? 'gowiz_searchbar_container dark_container' : 'gowiz_searchbar_container';

    const results_class = useDarkTheme
      ? 'gowiz_searchbar_results dark_gowiz_searchbar_results'
      : 'gowiz_searchbar_results';

    return (
      <div className={container_class}>
        <form onSubmit={(e) => this.handleOnSubmit(e)} id={'gowiz_searchbox_form'}>
          <div className="gowiz_searchbar_input">
            <Input
              query={query}
              placeholder={placeholder}
              useAutoFocus={useAutoFocus}
              onChange={this.handleOnChange}
              onCancel={this.handleOnCancel}
              showInputSearchIcon={showInputSearchIcon}
              useDarkTheme={useDarkTheme}
            />
          </div>
          {results_should_render && (
            <div className={results_class}>
              <Results
                ref={this.result_ref}
                onSelect={this.handleOnSelect}
                onRemove={this.handleSearchSuggestionRemove}
                onClick={this.handleOnToSearchBarClick}
                maxResults={maxResults}
                results={results}
                showResultsSearchIcon={showResultsSearchIcon}
                useCashing={useCaching}
                query={query}
                hasSearched={hasSearched}
                useDarkTheme={useDarkTheme}
              />
            </div>
          )}
          <HiddenInput />
        </form>
      </div>
    );
  }
}

//TODO: we should only fetch suggestions whn user has typed the search query or if it's the initial one. not fetching when clicking using arrows
// TODO: fetch new autocomplete suggestions
//TODO: gary background can only be present on a single element. if mouse is on an element the it's highlighted
//TODO: handle click outside of the search bar are
//TODO: double click on input should show last 10 historic searches is autofocus is not enabled
//TODO: if props does not use autocomplete, then results are adjusted using fuse search
