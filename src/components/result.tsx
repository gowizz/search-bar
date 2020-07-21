import '../assets/results.css';

import React, { Component, FunctionComponent } from 'react';
import { getHighlightParts, getSearchTermsInLocalStorage, searchTermInLocalStorage } from '../util';
import { CancelIcon, SearchIcon, TimeIcon } from '../assets/icons';

interface ResultsProps {
  query: string;
  onSelect: (event: any) => void;
  onRemove: (str: string) => void;
  results: string[];
  showResultsSearchIcon: boolean;
  useCashing: boolean;
  hasSearched: boolean;
  maxResults: number;
}

const InLocalStorage: FunctionComponent<{ props: ResultsProps; result: string }> = ({ props, result }) => {
  if (props.showResultsSearchIcon === false) {
    return <div className="result_icon" />;
  }
  return (
    <div className="result_icon">
      {searchTermInLocalStorage(result) && props.useCashing ? <TimeIcon /> : <SearchIcon />}
    </div>
  );
};

const Highlight: FunctionComponent<{ text: string; query: string }> = ({ text, query }) => {
  const parts: string[] = getHighlightParts(text, query);
  if (parts.length < 2) {
    return <span> {text}</span>;
  }
  return (
    <span>
      {parts.map((part, i) => (
        <span key={i} style={i === 1 ? { fontWeight: 'bold' } : {}}>
          {part}
        </span>
      ))}
    </span>
  );
};

export class Results extends Component<ResultsProps> {
  shouldComponentUpdate(nextProps: Readonly<ResultsProps>, nextState: Readonly<{}>, nextContext: any): boolean {
    const next_results = nextProps.results;
    const this_results = this.props.results;

    if (next_results == this_results) {
      if (this.props.query != nextProps.query) {
        return nextProps.query == '';
      }
      return false;
    }
    console.log(nextProps.results);
    console.log(this.props.results);

    //    console.log("Current props");
    //   console.log(this.props);
    //  console.log("next props");
    // console.log(nextProps);
    return true;
  }

  componentDidUpdate(prevProps: Readonly<ResultsProps>, prevState: Readonly<{}>, snapshot?: any): void {
    console.count('Results updates');
  }

  render() {
    let { query, onSelect, onRemove, showResultsSearchIcon, useCashing, hasSearched, results, maxResults } = this.props;

    let my_results = results;
    if (my_results == null || my_results.length < 1) {
      if (useCashing && (query == null || query.length == 0) && hasSearched) {
        my_results = getSearchTermsInLocalStorage();
      }
      if (my_results == null || my_results.length < 1) {
        return <div />;
      }
    }

    const props = {
      query: query,
      onSelect: onSelect,
      onRemove: onRemove,
      showResultsSearchIcon: showResultsSearchIcon,
      useCashing: useCashing,
      results: my_results,
      maxResults: maxResults,
      hasSearched: hasSearched,
    };

    return (
      <>
        <div className="input_to_results" />
        <ul>
          {my_results.slice(0, maxResults).map((result) => (
            <li
              className={props.query == result ? 'highlight_search_suggestion' : 'search_suggestion'}
              key={result}
              onClick={onSelect}
              value={result}
            >
              <InLocalStorage props={props} result={result} />
              <div className="ellipsis" title={result} onSelect={onSelect}>
                <Highlight query={props.query} text={result} />
              </div>
              <div
                className="remove_icon"
                title={'Remove ' + result + 'from search history'}
                onClick={() => onRemove(result)}
              >
                {searchTermInLocalStorage(result) && <CancelIcon />}
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  }
}

//TODO: add testing
//TODO: previously search values should be deleted from localstorage
//TODO: bug (highlighting should not change when we navigate with arrows)
