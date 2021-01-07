import Vue from 'vue';
import ECharts from 'vue-echarts';

import 'echarts/lib/component/dataset';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';

export default async ({ store }) => {
  Vue.component('ECharts', ECharts);

  const themeList = await Promise.all(
    store.state.ui.availableThemes.map((theme) =>
      import(`./theme/${theme}.js`).then((module) => module.default)
    )
  );

  const themeConfigList = [];
  themeList.forEach((theme, index) => {
    const themeId = store.state.ui.availableThemes[index];
    ECharts.registerTheme(themeId, theme);
    themeConfigList.push({
      id: themeId,
      config: theme,
    });
  });

  store.commit('ui/setThemeList', themeConfigList);

  ECharts.registerMap('china', await import('echarts/map/json/china.json'));
};
