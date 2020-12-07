const noopData = () => ({});

export const mergeData = (Component, newData) => {
  const ComponentData = Component.$options.data || noopData;

  Component.$options.data = () => {
    const data = ComponentData.call(this);
    if (typeof newData === 'function') {
      newData = newData(data);
    }

    console.log(newData);

    return {
      ...data,
      ...newData,
    };
  };
};
