import '../assets/results.css';

import React, { FunctionComponent } from 'react';
import { getHighlightParts, getSearchTermsInLocalStorage, searchTermInLocalStorage } from '../util';
import { CancelIcon, SearchIcon, TimeIcon } from '../assets/icons';

interface ResultsProps {
  query: string;
  onSelect: (event: any) => void;
  onRemove: (event: any) => void;
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

export const Results: FunctionComponent<ResultsProps> = ({
  query,
  onSelect,
  onRemove,
  showResultsSearchIcon,
  useCashing,
  hasSearched,
  results,
  maxResults,
}) => {
  alert("'saS");
  alert(results);
  if (results == null || results.length < 1) {
    //TODO: we should not show this if the user has never search for anything
    if (useCashing && (query == null || query.length == 0) && hasSearched) {
      results = getSearchTermsInLocalStorage();
    }
    if (results == null || results.length < 1) {
      return <div />;
    }
  }
  const props = {
    query: query,
    onSelect: onSelect,
    onRemove: onRemove,
    showResultsSearchIcon: showResultsSearchIcon,
    useCashing: useCashing,
    results: results,
    maxResults: maxResults,
    hasSearched: hasSearched,
  };

  return (
    <>
      <div className="input_to_results" />
      <ul>
        {results.slice(0, maxResults).map((result) => (
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
            <div className="remove_icon" title={'Remove ' + result + ' search history'} onClick={onRemove}>
              {searchTermInLocalStorage(result) && <CancelIcon />}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

//TODO: add testing
//TODO: previously search values should be deleted from localstorage
//TODO: bug (highlighting should not change when we navigate with arrows)
