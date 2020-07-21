import '../assets/input.css';

import React, { FunctionComponent } from 'react';
import { CancelIcon, SearchIcon } from '../assets/icons';

interface InputProps {
  query: string;
  placeholder: string;
  onChange: (e: any) => void;
  onCancel: (e: any) => void;
  showInputSearchIcon?: boolean;
}

// TODO: use props autofocus

export const Input: FunctionComponent<InputProps> = ({
  query,
  placeholder,
  showInputSearchIcon,
  onChange,
  onCancel,
}) => {
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
        />
      </div>
      <div className="cancel_icon" title={'Clear'} onClick={onCancel}>
        {query != undefined && query.length > 0 && <CancelIcon />}
      </div>
    </>
  );
};

//TODO: add testing
//TODO: previously search values should be deleted from localstorage
