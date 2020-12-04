import Vue from 'vue';
import { configure, localize, ValidationProvider, ValidationObserver } from 'vee-validate';
import zhCN from 'vee-validate/dist/locale/zh_CN.json';

import './extend';

configure({
  classes: {
    valid: 'is-success',
    invalid: 'is-error',
  },
});

localize('zh_CN', zhCN);

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
