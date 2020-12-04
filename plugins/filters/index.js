import Vue from 'vue';

import date from './date';
import placeholder from './placeholder';
import precision from './precision';
import number from './number';
import largeNumber from './large-number';
import percent from './percent';

const filters = {
  date,
  placeholder,
  precision,
  number,
  largeNumber,
  percent,
};

Object.entries(filters).forEach(([name, fn]) => {
  Vue.filter(name, fn);
});
