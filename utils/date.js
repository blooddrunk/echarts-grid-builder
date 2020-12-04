import { format, parse, parseISO, isDate, toDate } from 'date-fns';

export const formatDate = (dateStr, formatStr = 'yyyy-MM-dd', parseFormat = 'yyyy-MM-dd') => {
  let date = dateStr;
  if (typeof dateStr === 'string') {
    date = parse(dateStr, parseFormat, new Date());
  } else {
    date = toDate(dateStr);
    if (!isDate(date)) {
      throw new Error(`${dateStr}: must be type of String or Date`);
    }
  }

  return format(date, formatStr);
};

export const rangeToQuery = (
  dateRange,
  { startKey = 'start', endKey = 'end', formatter = (dateStr) => formatDate(dateStr) } = {}
) => {
  if (!dateRange) {
    return {};
  }

  const [start, end] = dateRange;
  return {
    [startKey]: start && formatter(start),
    [endKey]: end && formatter(end),
  };
};

export const fillMissingDate = (
  data = [],
  {
    start,
    end,
    dateKey = 'unit',
    unit = 'date',
    dateFormat = 'yyyy-MM-dd',
    displayFormat = 'yyyy-MM-dd',
    callback,
  } = {}
) => {
  if (!start || !end) {
    return [];
  }

  const dataMap = {};
  const now = new Date();

  data.forEach((item) => {
    const rawDataStr = item[dateKey];
    const date = parse(rawDataStr, dateFormat, now);

    const dateStr = format(date, displayFormat);
    dataMap[dateStr] = {
      ...item,
      [dateKey]: dateStr,
    };
  });

  const startDate = isDate(start) ? toDate(start) : parseISO(start);
  const endDate = isDate(end) ? toDate(end) : parseISO(end);

  const currentDate = startDate;
  currentDate.setHours(0, 0, 0, 0);

  const endTime = endDate.getTime();

  const newData = [];
  while (currentDate.getTime() <= endTime) {
    const currentDateStr = format(currentDate, displayFormat);

    if (Object.prototype.hasOwnProperty.call(dataMap, currentDateStr)) {
      newData.push(dataMap[currentDateStr]);
    } else {
      const newItem = {
        [dateKey]: currentDateStr,
      };
      newData.push(typeof callback === 'function' ? callback(newItem) : newItem);
    }

    if (unit === 'month') {
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else if (unit === 'year') {
      currentDate.setFullYear(currentDate.getFullYear() + 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    currentDate.setHours(0, 0, 0, 0);
  }

  return newData;
};
