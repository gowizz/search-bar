import React from 'react';

import { removeSearchTermFromLocalStorage } from '../util/storage';

import { HiddenInput } from './hidden_input';

import Input from './input';
import Results from './result';
import { searchcontainer_has_valid_props } from '../util/component_validation';

export interface SearchContainerOptions {
  onSubmit: (event: any) => void;
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

interface SearchContainerState {
  query: string;
  results: string[];
  useAutoComplete: boolean;
  highlight_query_index: number;
  hasSearched: boolean;
}

export default class SearchContainer extends React.PureComponent<SearchContainerOptions, SearchContainerState> {
  private readonly result_ref: React.RefObject<Results>;

  constructor(props: SearchContainerOptions) {
    searchcontainer_has_valid_props(props);
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
      this.setState({ query: '', highlight_query_index: -1 });
    } else {
      this.setState({ query: '' });
    }
  }

  handleOnKey(event) {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();

        switch (event.target.id) {
          case 'cancel_icon':
            this.handleOnCancel(event);
            break;
          case 'remove_icon':
            const title = event.target.title; // TODO: change this if you introduce transaltions
            const query = title.split(' ')[1];
            this.handleSearchSuggestionRemove(query);
            break;
          default:
            this.props.onSubmit(event);
            break;
        }
        break;
      case 'ArrowUp':
      case 'ArrowDown': {
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
        break;
      }
      case 'Escape':
        event.preventDefault();

        const should_trigger_state_change = this.state.results.length > 0 && this.state.useAutoComplete;

        if (should_trigger_state_change) {
          this.setState({ useAutoComplete: false });
        }
        break;
      default:
        return;
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
      onSubmit,
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
        <form onSubmit={(e) => onSubmit(e)} id={'gowiz_searchbox_form'}>
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
                onSelect={this.props.onSubmit}
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
