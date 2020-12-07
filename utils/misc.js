import isNil from 'lodash/isNil';
import Vue from 'vue';

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

export const deepSet = (object, path, value, setter = Vue.set) => {
  // make sure we have a path and a valid object
  if (!path) return;
  if (!object || typeof object !== 'object') return;

  // make sure the path is an array
  if (!Array.isArray(path)) path = [path];

  // maintain a reference to the relevant attribute
  let target = object;

  // get the last index
  const lastIndex = path.length - 1;

  // iterate through keys in the path
  for (let index = 0; index <= lastIndex; index++) {
    // get the key
    const key = path[index];

    // set the value at target[key]
    if (index === lastIndex) setter(target, key, value);
    else {
      // overwrite any non-object attributes
      if (!target[key] || typeof target[key] !== 'object') setter(target, key, {});

      setter(target, key, Object.assign(target[key], {}));

      // reference the next relevant attribute
      target = target[key];
    }
  }

  // just in case
  return object;
};
