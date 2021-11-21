import React, { FunctionComponent } from 'react';

import { isMobile } from 'react-device-detect';
import { getSearchTermsInLocalStorage, searchTermInLocalStorage } from '../util/storage';
import { getHighlightParts } from '../util/highlight';
import shallowCompare from 'react-addons-shallow-compare';
import { CancelIcon, LeftArrowIcon, SearchIcon, TimeIcon } from '../assets/icons';

export interface ResultsProps {
  query?: string;
  onSelect: (event: any) => void;
  onClick: (str: string) => void;
  onRemove: (str: string) => void;
  results?: string[];
  showResultsSearchIcon?: boolean;
  useCashing?: boolean;
  useDarkTheme?: boolean;
  hasSearched?: boolean;
  maxResults?: number;
}

export const InLocalStorage: FunctionComponent<{
  showResultsSearchIcon: boolean;
  useCashing: boolean;
  useDarkTheme?: boolean;
  result: string;
}> = ({ showResultsSearchIcon, useCashing, useDarkTheme = false, result }) => {
  const classname = useDarkTheme ? 'result-icon dark-result-icon' : 'result-icon';
  if (!showResultsSearchIcon) {
    return <div className={classname} />;
  }
  const icon = searchTermInLocalStorage(result) && useCashing ? <TimeIcon /> : <SearchIcon />;
  return <div className={classname}>{icon}</div>;
};

export const Highlight: FunctionComponent<{ text: string; query: string }> = ({ text, query }) => {
  const parts: string[] = getHighlightParts(text, query);
  if (parts.length < 2) {
    return <span>{text}</span>;
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

export const SecondaryActionClass: FunctionComponent<{
  tabIndexStart: number;
  result: string;
  onRemove: (str: string) => void;
  onClick: (str: string) => void;
  useDarkTheme?: boolean;
  isSmallScreen: boolean;
}> = ({ tabIndexStart, result, onRemove, onClick, useDarkTheme = false, isSmallScreen }) => {
  const _searchTermInLocalStorage = searchTermInLocalStorage(result);
  const classname = useDarkTheme ? 'secondary-action-icon dark-secondary-action-icon' : 'secondary-action-icon';
  if (_searchTermInLocalStorage) {
    return (
      <div
        tabIndex={tabIndexStart + 1}
        className={classname}
        defaultValue={result}
        aria-readonly={'true'}
        title={'Remove ' + result + ' from search history'}
        onClick={() => onRemove(result)}
      >
        <CancelIcon />
      </div>
    );
  }
  if (isSmallScreen) {
    return (
      <div
        tabIndex={tabIndexStart + 1}
        className={classname}
        defaultValue={result}
        aria-readonly={'true'}
        title={'Add ' + result + ' to your searchbar'}
        onClick={() => onClick(result)}
      >
        <LeftArrowIcon />
      </div>
    );
  }
  return <div className={classname} />;
};

export default class Results extends React.Component<ResultsProps> {
  shouldComponentUpdate(nextProps: Readonly<ResultsProps>, nextState: Readonly<{}>): boolean {
    const queryIsNotLongEnough = nextProps.query == undefined || nextProps.query.length == 0;

    if (queryIsNotLongEnough) {
      return true;
    } else if (this.props.query !== nextProps.query) {
      return true;
    } else if (nextProps.results != this.props.results) {
      return true;
    }

    return shallowCompare(this, nextProps, nextState);
  }
  forceUpdateMe() {
    this.forceUpdate();
  }

  getListElementClass(result: string): string {
    const value_is_equal = this.props.query === result;
    if (value_is_equal) {
      return this.props.useDarkTheme ? 'dark-highlight_search-suggestion' : 'highlight-search-suggestion';
    }
    return this.props.useDarkTheme ? 'dark-search-suggestion' : 'search-suggestion';
  }

  render() {
    let {
      query = '',
      onSelect,
      onRemove,
      onClick,
      showResultsSearchIcon = true,
      useCashing = true,
      useDarkTheme = false,
      hasSearched = false,
      results = [],
      maxResults = 10,
    } = this.props;

    let myResults = results;
    let myResultsLength = myResults == null ? 0 : myResults.length;
    let queryLength = query == null ? 0 : query.length;

    if (myResultsLength < 1) {
      if (useCashing && queryLength == 0 && hasSearched) {
        myResults = getSearchTermsInLocalStorage();
        myResultsLength = myResults.length;
      }
      if (myResultsLength < 1) {
        return null;
      }
    }

    const props = {
      query: query,
      onSelect: onSelect,
      onRemove: onRemove,
      onClick: onClick,
      showResultsSearchIcon: showResultsSearchIcon,
      useCashing: useCashing,
      results: myResults,
      maxResults: maxResults,
      hasSearched: hasSearched,
    };

    const class_name = useDarkTheme ? 'ellipsis dark-ellipsis' : 'ellipsis';

    const isSmallScreen = screen.availWidth < 480 || isMobile;

    return (
      <>
        <div className="input-to-results" />
        <ul>
          {myResults.map((result, index) => (
            <li
              className={this.getListElementClass(result)}
              key={result}
              tabIndex={2 + index}
              onClick={(e) => onSelect(e)}
              onSelect={() => onSelect(result)}
            >
              <InLocalStorage
                useDarkTheme={useDarkTheme}
                result={result}
                showResultsSearchIcon={props.showResultsSearchIcon}
                useCashing={props.useCashing}
              />
              <div className={class_name} title={'Search for ' + result + ' on Gowiz'}>
                <Highlight query={props.query} text={result} />
              </div>
              <SecondaryActionClass
                useDarkTheme={useDarkTheme}
                tabIndexStart={2 + index}
                result={result}
                onRemove={(e) => onRemove(e)}
                onClick={onClick}
                isSmallScreen={isSmallScreen}
              />
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
//TODO: highlighting shoun't change when navigating with awwos. only typing changes this
