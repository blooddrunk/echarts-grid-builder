import Vue from 'vue';
import ECharts from 'vue-echarts';

import 'echarts/lib/component/dataset';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';

import china from 'echarts/map/json/china.json';
import primary from './theme/primary';
import secondary from './theme/secondary';

Vue.component('ECharts', ECharts);
ECharts.registerTheme('primary', primary);
ECharts.registerTheme('secondary', secondary);
ECharts.registerMap('china', china);
