export const jsonToFormData = (params) => {
  if (!params) {
    return null;
  }

  const formData = new FormData();

  Object.keys(params).forEach((key) => {
    if (Array.isArray(params[key])) {
      params[key].forEach((_, index) => {
        formData.append(`${key}[]`, params[key][index]);
      });
    } else {
      formData.append(key, params[key]);
    }
  });

  return formData;
};

export const jsonToUrlParams = (data) =>
  Object.entries(data).reduce((params, [key, value]) => {
    params.append(key, value);
    return params;
  }, new URLSearchParams());

export const getDisplayNameByValue = (value, list = [], fallback = '') => {
  const target = list.find((item) => item.value === value);
  return target ? target.label : fallback;
};

export const getDisplayNameByValueList = (valueList, list = [], fallback = '') => {
  const foundList = list
    .filter((item) => valueList.includes(item.value))
    .map((foundItem) => foundItem.label || fallback);
  return foundList;
};
