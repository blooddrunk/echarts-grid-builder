import { addListener, removeListener } from 'resize-detector';

export default {
  inserted(el, { value: callback, modifiers }) {
    if (modifiers.window) {
      addListener(window, callback);
    } else {
      addListener(el, callback);
    }

    el._onResize = callback;

    if (modifiers.immediate) {
      callback();
    }
  },

  unbind(el, { modifiers }) {
    if (!el._onResize) return;

    if (modifiers.window) {
      removeListener(window, el._onResize);
    } else {
      removeListener(el, el._onResize);
    }

    delete el._onResize;
  },
};
