import React from 'react';

interface IconProps {
  width?: number;
  height?: number;
}

function validate_icon_props(str: string, nr: number): number {
  if (nr < 1) {
    throw new Error(str + " can't be less than 1px");
  }
  return nr;
}

const SearchIcon = (props: IconProps) => (
  <svg
    width={props.width ? validate_icon_props('Width', props.width) : 20}
    height={props.height ? validate_icon_props('Height', props.height) : 20}
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const TimeIcon = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    focusable="false"
    width={props.width ? validate_icon_props('Width', props.width) : 20}
    height={props.height ? validate_icon_props('Height', props.height) : 20}
  >
    <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 6 L 11 12.414062 L 15.292969 16.707031 L 16.707031 15.292969 L 13 11.585938 L 13 6 L 11 6 z" />
  </svg>
);

const CancelIcon = (props: IconProps) => (
  <svg
    fill="#ffff"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    focusable="false"
    width={props.width ? validate_icon_props('Width', props.width) : 16}
    height={props.height ? validate_icon_props('Height', props.height) : 16}
  >
    <path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z" />
  </svg>
);

export { SearchIcon, TimeIcon, CancelIcon };
