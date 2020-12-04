import isNil from 'lodash/isNil';

import { isNumeric } from './math';

export const breakStringWith = (str, { breakpoint, breakBy = '\n' } = {}) => {
  if (!str || breakpoint <= 0) {
    return str;
  }

  if (typeof breakpoint === 'function') {
    breakpoint = breakpoint(str);
  }

  return str.replace(new RegExp(`(.{${breakpoint}})`, 'g'), `$1${breakBy}`);
};

export const getPlaceholderForNonValue = (value, { placeholder = '--', nonValue } = {}) => {
  if (isNil(value) || nonValue === value || (Array.isArray(value) && value.length === 0)) {
    return placeholder;
  }

  return value;
};

export const convertToUnit = (str, unit = 'px') => {
  if (str == null || str === '') {
    return undefined;
  } else if (isNumeric(str)) {
    return `${Number(str)}${unit}`;
  } else {
    return String(str);
  }
};
