import { Message, Notification } from 'element-ui';
import Vue from 'vue';

import { getPlaceholderForNonValue } from '@/utils/misc';

import ElementTable from '@/components/UI/ElementTable.vue';
import SimpleSelect from '@/components/UI/SimpleSelect.vue';
import SimpleRadioGroup from '@/components/UI/SimpleRadioGroup';
import ComplexSwitch from '@/components/UI/ComplexSwitch.vue';

export default ({ $config }, inject) => {
  Vue.prototype.$getPlaceholder = getPlaceholderForNonValue;

  Vue.component('ElementTable', ElementTable);
  Vue.component('SimpleRadioGroup', SimpleRadioGroup);
  Vue.component('SimpleSelect', SimpleSelect);
  Vue.component('ComplexSwitch', ComplexSwitch);

  inject('apiRoot', $config.apiRoot);
  inject('apiPrefix', $config.apiPrefix);
  inject('routerRoot', $config.routerRoot);

  inject('message', Message);
  inject('notify', Notification);
  inject('errorReporter', Message.error);
};
