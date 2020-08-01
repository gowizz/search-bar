import React from 'react';

interface IconProps {
  width?: number;
  height?: number;
}

function validate_icon_props(str: string, nr: number): number {
  if (nr < 1) {
    throw new Error(str + " can't be less than 1px");
  }
  //TODO: validate if nr can be fraction
  return nr;
}

const SearchIcon = (props: IconProps) => (
  <svg
    width={props.width ? validate_icon_props('Width', props.width) : 20}
    height={props.height ? validate_icon_props('Height', props.height) : 20}
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    data-testid={'search_icon_svg'}
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
    data-testid={'time_icon_svg'}
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
    data-testid={'cancel_icon_svg'}
  >
    <path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z" />
  </svg>
);

const LeftArrowIcon = (props: IconProps) => (
  <svg
    fill="#0000"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    focusable="false"
    width={props.width ? validate_icon_props('Width', props.width) : 16}
    height={props.height ? validate_icon_props('Height', props.height) : 16}
    data-testid={'leftarrow_icon_svg'}
  >
    <path d="M 3.566406 3 C 3.359375 3.046875 3.1875 3.183594 3.070312 3.378906 C 2.976562 3.535156 2.976562 3.625 2.976562 7.5 C 2.976562 11.171875 2.980469 11.46875 3.054688 11.609375 C 3.179688 11.832031 3.398438 11.96875 3.683594 11.992188 C 3.992188 12.015625 4.257812 11.882812 4.402344 11.625 C 4.5 11.453125 4.5 11.414062 4.5 8.527344 L 4.5 5.601562 L 12.132812 13.226562 C 16.328125 17.417969 19.824219 20.882812 19.90625 20.925781 C 20.242188 21.089844 20.679688 20.976562 20.886719 20.675781 C 21.007812 20.492188 21.039062 20.175781 20.953125 19.9375 C 20.925781 19.859375 17.609375 16.515625 13.25 12.148438 L 5.601562 4.5 L 8.527344 4.5 C 11.414062 4.5 11.453125 4.5 11.625 4.402344 C 11.882812 4.257812 12.015625 3.992188 11.992188 3.675781 C 11.96875 3.382812 11.859375 3.210938 11.621094 3.070312 C 11.464844 2.976562 11.367188 2.976562 7.59375 2.96875 C 5.464844 2.960938 3.65625 2.976562 3.566406 3 Z M 3.566406 3 " />
  </svg>
);

export { validate_icon_props, SearchIcon, TimeIcon, CancelIcon, LeftArrowIcon };
