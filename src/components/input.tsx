import '../assets/input.css';

import React, { Component, FunctionComponent } from 'react';
import { CancelIcon, SearchIcon } from '../assets/icons';

interface InputProps {
  query: string;
  placeholder: string;
  onChange: (e: any) => void;
  onCancel: (e: any) => void;
  showInputSearchIcon?: boolean;
}

// TODO: use props autofocus

export class Input extends Component<InputProps> {
  componentDidUpdate(prevProps: Readonly<InputProps>, prevState: Readonly<{}>, snapshot?: any): void {
    console.count('Input');
  }
  shouldComponentUpdate(nextProps: Readonly<InputProps>, nextState: Readonly<{}>, nextContext: any): boolean {
    if (this.props.query != nextProps.query) {
      return true;
    }
    console.log('Current props');
    console.log(this.props);
    console.log('next props');
    console.log(nextProps);

    return false;
  }

  render() {
    let { query, placeholder, showInputSearchIcon, onChange, onCancel } = this.props;
    //TODO: add prios for title,aria_label

    return (
      <>
        <div className="search_icon">{showInputSearchIcon && <SearchIcon />}</div>
        <div className="search_input">
          <input
            spellCheck={false}
            value={query}
            placeholder={placeholder}
            onChange={onChange}
            autoComplete="off"
            name="query"
            type="text"
            title="Search with Gowiz"
            aria-required="true"
            aria-label="Search query input"
          />
        </div>
        <div className="cancel_icon" title={'Clear'} onClick={onCancel}>
          {query != undefined && query.length > 0 && <CancelIcon />}
        </div>
      </>
    );
  }
}

//TODO: add testing
//TODO: previously search values should be deleted from localstorage
