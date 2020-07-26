import React, { FunctionComponent } from 'react';
import { CancelIcon, SearchIcon, TimeIcon } from '../assets/icons';
import shallowCompare from 'react-addons-shallow-compare';
import { getSearchTermsInLocalStorage, searchTermInLocalStorage } from '../util/storage';
import { getHighlightParts } from '../util/highlight';

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
const RemoveIconClass: FunctionComponent<{
  tabIndexStart: number;
  result: string;
  onRemove: (str: string) => void;
}> = ({ tabIndexStart, result, onRemove }) => {
  const _searchTermInLocalStorage = searchTermInLocalStorage(result);
  if (_searchTermInLocalStorage) {
    return (
      <div
        tabIndex={tabIndexStart + 1}
        className="remove_icon"
        id={'remove_icon'}
        defaultValue={result}
        aria-readonly={'true'}
        title={'Remove ' + result + ' from search history'}
        onClick={() => onRemove(result)}
      >
        <CancelIcon />
      </div>
    );
  }
  return <div className="remove_icon" />;
};

export default class Results extends React.Component<ResultsProps> {
  shouldComponentUpdate(nextProps: Readonly<ResultsProps>, nextState: Readonly<{}>, nextContext: any): boolean {
    if (this.props.query !== nextProps.query) {
      return true;
    } else if (nextProps.results != this.props.results) {
      return true;
    } else if (nextProps.query.length == 0) {
      return true;
    }
    return shallowCompare(this, nextProps, nextState);
  }

  forceUpdateMe() {
    this.forceUpdate();
  }

  render() {
    let { query, onSelect, onRemove, showResultsSearchIcon, useCashing, hasSearched, results, maxResults } = this.props;

    let my_results = results;
    if (my_results == null || my_results.length < 1) {
      if (useCashing && (query == null || query.length == 0) && hasSearched) {
        my_results = getSearchTermsInLocalStorage();
      }
      if (my_results == null || my_results.length < 1) {
        return null;
      }
    }

    const index = my_results.indexOf(query);
    if (index > -1) {
      my_results.splice(index, 1);
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
          {my_results.map((result, index) => (
            <li
              className={
                props.query.valueOf() === result.valueOf() ? 'highlight_search_suggestion' : 'search_suggestion'
              }
              key={result}
              tabIndex={2 + index}
              onClick={(e) => onSelect(e)}
              onSelect={() => onSelect(result)}
            >
              <InLocalStorage props={props} result={result} />
              <div className="ellipsis" title={'Search for ' + result + ' on Gowiz'}>
                <Highlight query={props.query} text={result} />
              </div>
              <RemoveIconClass tabIndexStart={2 + index} result={result} onRemove={(e) => onRemove(e)} />
            </li>
          ))}
        </ul>
      </>
    );
  }
}
//TODO: imeplemnt translations
//TODO: add testing
//TODO: bug (highlighting should not change when we navigate with arrows)
