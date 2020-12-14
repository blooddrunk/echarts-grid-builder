import isPlainObject from 'lodash/isPlainObject';
import merge from 'lodash/merge';

import { precisionRound, toDisplayString, isNumeric } from '@/utils/math';
import { breakStringWith } from '@/utils/misc';
import defaultChartConfig from '@/assets/chart/default-config.json';

export const getAxisLabelFormatter = (breakpoint = 1) => {
  return (val) => {
    if (!val || breakpoint === 0) {
      return val;
    } else {
      return breakStringWith(val, {
        breakpoint,
      });
    }
  };
};

export const getDimByName = (dimList, name) => {
  if (dimList) {
    const targetDim = dimList.find((item) => {
      if (isPlainObject(item)) {
        return item.displayName === name;
      } else {
        return item === name;
      }
    });

    return targetDim;
  }

  return null;
};

export const getDimKeyByName = (dimList, name) => {
  const targetDim = getDimByName(dimList, name);

  if (targetDim) {
    return targetDim.name ? targetDim.name : targetDim;
  }

  return '';
};

export const getTooltipFormatter = ({ type = 'normal', ...rest } = {}) => {
  if (type === 'pie') {
    return getPieTooltipFormatter(rest);
  } else if (type === 'simple') {
    return getSimpleTooltipFormatter(rest);
  } else {
    return ge2DTooltipFormatter(rest);
  }
};

const getTooltipTitle = (param, titleGetter) => {
  const { name, axisValueLabel } = param;
  let title = name || axisValueLabel;

  if (typeof titleGetter === 'function') {
    title = titleGetter({ title, ...param });
  }

  return title;
};

const getTooltipValue = (
  param,
  { index, displayEmptyValue = 'N/A', precision = 2, valueGetter }
) => {
  const data = {
    displayEmptyValue,
    precision,
    valueGetter,
    ...((param.data && param.data.tooltip) || {}),
  };

  let value = data.valueGetter({ ...param, index });
  if (isNumeric(value)) {
    value = toDisplayString(value);
  } else if (!value) {
    value = data.displayEmptyValue;
  }

  return value;
};

export const getSimpleTooltipFormatter = ({ titleGetter, ...rest }) => {
  return (params) => {
    const title = getTooltipTitle(params[0], titleGetter);

    const value = getTooltipValue(params[0], {
      index: 0,
      ...rest,
    });

    return `${title}：${value}`;
  };
};

export const ge2DTooltipFormatter = ({ titleGetter, ...rest }) => {
  return (params) => {
    if (!Array.isArray(params)) {
      params = [params];
    }

    const tpl = [];
    const title = getTooltipTitle(params[0], titleGetter);
    if (title) {
      tpl.push(`${title}<br/>`);
    }

    params.forEach((param, index) => {
      const { seriesName, marker } = param;

      const value = getTooltipValue(param, {
        index,
        ...rest,
      });

      const row = `${marker}${seriesName}: ${value}<br>`;
      tpl.push(row);
    });

    return tpl.join('');
  };
};

export const getPieTooltipFormatter = ({ showNumber = true, ...rest }) => {
  return (param) => {
    const { name, marker, percent } = param;

    const value = getTooltipValue(param, rest);

    let formatted = `${marker}${name}：`;
    if (showNumber) {
      formatted = `${formatted}${value}(${percent}%)`;
    } else {
      formatted = `${formatted}${percent}%`;
    }

    return formatted;
  };
};

export const normalizeData = (data = [], dataMapper, { exclusive = true } = {}) => {
  if (!dataMapper) {
    throw new Error(`[normalizeData]: 'dataMapper' object is required`);
  }

  return data.map((item) =>
    Object.entries(item).reduce((acc, [key, value]) => {
      if (Object.prototype.hasOwnProperty.call(dataMapper, key)) {
        const target = dataMapper[key];
        if (Array.isArray(target)) {
          const [newKey, valueTransformer] = target;
          acc[newKey] = valueTransformer(value);
        } else {
          acc[target] = value;
        }
      } else if (!exclusive) {
        acc[key] = value;
      }
      return acc;
    }, {})
  );
};

export const normalizePieData = (
  data = [],
  { categoryKey = 'name', valueKey = 'value' } = {},
  itemParser
) => {
  if (!categoryKey || !valueKey) {
    throw new Error(`[normalizPieData]: 'categoryKey' and 'valueKey' must be specified`);
  }

  const total = data.reduce((sum, cur) => sum + cur[valueKey], 0);

  return data.map((item) => {
    const percentage = total !== 0 ? precisionRound((item[valueKey] / total) * 100) : 0;
    let newItem = {
      ...item,
      percentage,
      displayPercentage: `${percentage}%`,
      decimalPercentage: total !== 0 ? precisionRound(item[valueKey] / total) : 0,
    };

    newItem.name = newItem[categoryKey];
    newItem.value = newItem[valueKey];

    if (percentage < 4) {
      newItem = {
        ...newItem,
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },

        emphasis: {
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
        },
      };
    }

    if (typeof itemParser === 'function') {
      newItem = itemParser(newItem);
    }

    return newItem;
  });
};

export const getDefaultSeriesLengthByDataSource = (dataSource) => {
  let totalDim;
  if (!dataSource || !dataSource.length) {
    totalDim = 1;
  } else {
    const dimRow = dataSource[0];
    totalDim = Math.max((dimRow || []).length - 1, 1);
  }

  return totalDim;
};

export const getDefaultSeries = ({ series, dataSource, seriesConfig } = {}) => {
  if (Array.isArray(series)) {
    return series;
  }

  if (typeof series === 'function') {
    return this.series({ seriesConfig, dataSource });
  } else {
    const totalDim = getDefaultSeriesLengthByDataSource(dataSource);
    return Array(totalDim).fill({
      ...seriesConfig,
      type: series,
    });
  }
};

export const getDefaultChartOptions = (...option) => {
  return merge({}, defaultChartConfig.base, ...option);
};

export const getDefaultHistChartOptions = () => {
  return {
    xAxis: {
      axisLabel: {
        rotate: 45,
      },
    },
  };
};

const normalizeChartConfigByKey = (baseKey, key) => {
  const baseConfig = defaultChartConfig[baseKey];
  const extraConfig = defaultChartConfig[key];
  if (!baseConfig) {
    throw new Error(`Failed to retrieve chart config for ${baseKey}`);
  }

  return merge({}, baseConfig, extraConfig);
};

export const getDefaultChartOptionsByType = ({ type, dataSource, series } = {}) => {
  if (!series && type) {
    series = type.slice(0, type.indexOf('-'));
  }

  let config = {};

  switch (type) {
    case 'bar-base':
      config = normalizeChartConfigByKey('bar');
      break;
    case 'line-base':
      config = normalizeChartConfigByKey('line');
      break;
    case 'line-area':
      config = normalizeChartConfigByKey('line', type);
      break;
    default:
      break;
  }

  const computedSeries = getDefaultSeries({ series, dataSource, seriesConfig: config.__series });

  return getDefaultChartOptions({
    ...config,
    series: computedSeries,
  });
};
