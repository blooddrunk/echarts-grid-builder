import Vue from 'vue';

import scroll from './scroll';
import resize from './resize';

const directives = {
  scroll,
  resize,
};

for (const name in directives) {
  Vue.directive(name, directives[name]);
}
