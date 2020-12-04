import { Message, Notification } from 'element-ui';
import Vue from 'vue';

import { getPlaceholderForNonValue } from '@/utils/misc';

import ElementTable from '@/components/UI/ElementTable.vue';

export default ({ $config }, inject) => {
  Vue.prototype.$getPlaceholder = getPlaceholderForNonValue;

  Vue.component('ElementTable', ElementTable);

  inject('apiRoot', $config.apiRoot);
  inject('apiPrefix', $config.apiPrefix);
  inject('routerRoot', $config.routerRoot);

  inject('message', Message);
  inject('notify', Notification);
  inject('errorReporter', Message.error);
};
