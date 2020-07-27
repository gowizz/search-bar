import React, { FunctionComponent } from 'react';
import { CancelIcon, LeftArrowIcon, SearchIcon, TimeIcon } from '../assets/icons';
import { isMobile } from 'react-device-detect';
import { getSearchTermsInLocalStorage, searchTermInLocalStorage } from '../util/storage';
import { getHighlightParts } from '../util/highlight';
import shallowCompare from 'react-addons-shallow-compare';

interface ResultsProps {
  query: string;
  onSelect: (event: any) => void;
  onClick: (str: string) => void;
  onRemove: (str: string) => void;
  results: string[];
  showResultsSearchIcon: boolean;
  useCashing: boolean;
  useDarkTheme: boolean;
  hasSearched: boolean;
  maxResults: number;
}

const InLocalStorage: FunctionComponent<{
  showResultsSearchIcon: boolean;
  useCashing: boolean;
  useDarkTheme?: boolean;
  result: string;
}> = ({ showResultsSearchIcon, useCashing, useDarkTheme = false, result }) => {
  const classname = useDarkTheme ? 'result_icon dark_result_icon' : 'result_icon';
  if (showResultsSearchIcon === false) {
    return <div className={classname} />;
  }
  const icon =
    searchTermInLocalStorage(result) && useCashing ? (
      <TimeIcon data-testid={'time_icon_svg'} />
    ) : (
      <SearchIcon data-testid={'search_icon_svg'} />
    );
  return <div className={classname}>{icon}</div>;
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
const SecondaryActionClass: FunctionComponent<{
  tabIndexStart: number;
  result: string;
  onRemove: (str: string) => void;
  onClick: (str: string) => void;
  useDarkTheme?: boolean;
}> = ({ tabIndexStart, result, onRemove, onClick, useDarkTheme = false }) => {
  const _searchTermInLocalStorage = searchTermInLocalStorage(result);
  const classname = useDarkTheme ? 'secondary_action_icon dark_secondary_action_icon' : 'secondary_action_icon';
  if (_searchTermInLocalStorage) {
    return (
      <div
        tabIndex={tabIndexStart + 1}
        className={classname}
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
  const _is_small_screen = screen.availWidth < 480 || isMobile;
  if (_is_small_screen) {
    return (
      <div
        tabIndex={tabIndexStart + 1}
        className={classname}
        id={'to_searchbar_icon'}
        defaultValue={result}
        aria-readonly={'true'}
        title={'Add ' + result + ' to your searchbar'}
        onClick={() => onClick(result)}
      >
        <LeftArrowIcon />
      </div>
    );
  }
  return <div className="secondary_action_icon" />;
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

  getListElementClass(result: string): string {
    const value_is_equal = this.props.query.valueOf() === result.valueOf();
    if (value_is_equal) {
      if (this.props.useDarkTheme) {
        return 'dark_highlight_search_suggestion';
      }
      return 'highlight_search_suggestion';
    }
    if (this.props.useDarkTheme) {
      return 'dark_search_suggestion';
    }
    return 'search_suggestion';
  }

  render() {
    let {
      query,
      onSelect,
      onRemove,
      onClick,
      showResultsSearchIcon,
      useCashing,
      useDarkTheme,
      hasSearched,
      results,
      maxResults,
    } = this.props;

    let my_results = results;
    if (my_results == null || my_results.length < 1) {
      if (useCashing && (query == null || query.length == 0) && hasSearched) {
        my_results = getSearchTermsInLocalStorage();
      }
      if (my_results == null || my_results.length < 1) {
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
      results: my_results,
      maxResults: maxResults,
      hasSearched: hasSearched,
    };

    const class_name = useDarkTheme ? 'ellipsis dark_ellipsis' : 'ellipsis';

    return (
      <>
        <div className="input_to_results" />
        <ul>
          {my_results.map((result, index) => (
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
