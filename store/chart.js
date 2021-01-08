export const state = () => ({
  presetChartList: [
    {
      category: '折线图',
      items: [
        { description: '一般折线图', key: 'line-base' },
        { description: '面积图', key: 'line-area' },
        { description: '堆叠面积图', key: 'line-stack' },
      ],
    },

    {
      category: '柱状图',
      items: [{ description: '一般柱状图', key: 'bar-base' }],
    },

    {
      category: '饼图',
      items: [{ description: '一般饼图', key: 'pie-base' }],
    },
  ],
});
