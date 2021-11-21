import React, { FunctionComponent } from 'react';
import { CancelIcon, SearchIcon } from '../assets/icons';

export interface InputProps {
  query?: string;
  placeholder?: string;
  onChange: (str: string) => void;
  onCancel: (e: any) => void;
  showInputSearchIcon?: boolean;
  useAutoFocus?: boolean;
  useDarkTheme?: boolean;
}

export const SearchIconClass: FunctionComponent<{ useDarkTheme?: boolean; showInputSearchIcon: boolean }> = ({
  useDarkTheme = false,
  showInputSearchIcon,
}) => {
  if (showInputSearchIcon) {
    const classname = useDarkTheme ? 'search-icon dark_search-icon' : 'search-icon';
    return (
      <div className={classname}>
        <SearchIcon data-testid="search_icon_svg" />
      </div>
    );
  }
  return null;
};

export const CancelIconClass: FunctionComponent<{
  useDarkTheme?: boolean;
  query: string;
  onCancel: (e: any) => void;
}> = ({ useDarkTheme = false, query, onCancel }) => {
  const cancel_button_is_needed = query != undefined && query.length > 0;
  if (cancel_button_is_needed) {
    const classname = useDarkTheme ? 'cancel-icon dark_cancel-icon' : 'cancel-icon';

    return (
      <div id={'cancel-icon'} tabIndex={2} className={classname} title={'Clear'} onClick={onCancel}>
        <CancelIcon data-testid="cancel_icon_svg" />
      </div>
    );
  }
  return null;
};

export default class Input extends React.PureComponent<InputProps> {
  render() {
    const { showInputSearchIcon = true, onChange, onCancel, useAutoFocus = false, useDarkTheme = false } = this.props;

    let placeholder: string;
    switch (this.props.placeholder) {
      case undefined:
        placeholder = 'Search on Gowiz';
        break;
      case null:
        placeholder = '';
        break;
      default:
        placeholder = this.props.placeholder;
    }
    const query = this.props.query === undefined || this.props.query === null ? '' : this.props.query;
    const title = query.length === 0 ? 'Search on Gowiz' : 'Search ' + query + ' on Gowiz';

    const container_class = useDarkTheme ? 'search-input dark-input' : 'search-input';

    return (
      <>
        <SearchIconClass useDarkTheme={useDarkTheme} showInputSearchIcon={showInputSearchIcon} />
        <div className={container_class}>
          <input
            data-testid={'search-input-input'}
            spellCheck={true}
            defaultValue={query}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            autoComplete="off"
            name="query"
            type="text"
            title={title}
            aria-required="true"
            aria-label="Search query input"
            autoFocus={useAutoFocus}
            tabIndex={1}
          />
        </div>
        <CancelIconClass query={query} onCancel={(e) => onCancel(e)} useDarkTheme={useDarkTheme} />
      </>
    );
  }
}

//TODO: add testing on click and cancel and focus
//TODO: add filtering
//TODO: move searchicon anc cancelicon to seppearate class
