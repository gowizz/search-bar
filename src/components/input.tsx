import React, { FunctionComponent } from 'react';
import { CancelIcon, SearchIcon } from '../assets/icons';
import shallowCompare from 'react-addons-shallow-compare';
import '../assets/input.css';

interface InputProps {
  query?: string;
  placeholder?: string;
  onChange: (e: any) => void;
  onCancel: (e: any) => void;
  showInputSearchIcon?: boolean;
  useAutoFocus?: boolean;
}

const SearchIconClass: FunctionComponent<{ showInputSearchIcon: boolean }> = ({ showInputSearchIcon }) => {
  if (showInputSearchIcon) {
    return <div className="search_icon">{showInputSearchIcon && <SearchIcon />}</div>;
  }
  return null;
};

const CancelIconClass: FunctionComponent<{ query: string; onCancel: (e: any) => void }> = ({ query, onCancel }) => {
  const cancel_button_is_needed = query != undefined && query.length > 0;
  if (cancel_button_is_needed) {
    return (
      <div className="cancel_icon" title={'Clear'} onClick={onCancel}>
        {query != undefined && query.length > 0 && <CancelIcon />}
      </div>
    );
  }
  return null;
};

export default class Input extends React.Component<InputProps> {
  shouldComponentUpdate(nextProps: Readonly<InputProps>, nextState: Readonly<{}>, nextContext: any): boolean {
    if (this.props.query != nextProps.query) {
      return true;
    }
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const {
      query = '',
      placeholder = 'Search on Gowiz',
      showInputSearchIcon = true,
      onChange,
      onCancel,
      useAutoFocus = true,
    } = this.props;

    return (
      <>
        <SearchIconClass showInputSearchIcon={showInputSearchIcon} />
        <div className="search_input">
          <input
            spellCheck={true}
            value={query}
            placeholder={placeholder}
            onChange={(e) => onChange(e)}
            autoComplete="off"
            name="query"
            type="text"
            title="Search with Gowiz"
            aria-required="true"
            aria-label="Search query input"
            autoFocus={useAutoFocus}
          />
        </div>
        <CancelIconClass query={query} onCancel={(e) => onCancel(e)} />
      </>
    );
  }
}

//TODO: add testing
