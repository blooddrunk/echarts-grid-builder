import Vue from 'vue';

import { dom, library } from '@fortawesome/fontawesome-svg-core';
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText,
} from '@fortawesome/vue-fontawesome';
import {
  faSun,
  faMoon,
  faExclamationTriangle,
  faImage,
  faTimes,
  faExpand,
  faCompress,
  faChartArea,
  faSave,
  faTable,
  faArrowRight,
  faDownload,
  faPen,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';

dom.watch();

library.add(
  faSun,
  faMoon,
  faExclamationTriangle,
  faImage,
  faTimes,
  faExpand,
  faCompress,
  faChartArea,
  faSave,
  faTable,
  faArrowRight,
  faDownload,
  faPen,
  faFilePdf
);

Vue.component('FontAwesomeIcon', FontAwesomeIcon);
Vue.component('FontAwesomeLayers', FontAwesomeLayers);
Vue.component('FontAwesomeLayersText', FontAwesomeLayersText);
