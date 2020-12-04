import { extend } from 'vee-validate';
import { required, min, max } from 'vee-validate/dist/rules';

extend('required', {
  ...required,
  message: '{_field_}必填',
});
extend('min', min);
extend('max', max);

extend('confirm_password', {
  params: ['target'],
  validate(value, { target }) {
    return !target || value === target;
  },
  message: '两次密码输入不一致',
});

extend('password', {
  validate(value) {
    const c1 = /\d/.test(value);
    const c2 = /[a-z]/.test(value);
    const c3 = /[A-Z]/.test(value);
    const c4 = /[~`!@#$%^&*()_+=<>/?\\|;:.,"{}[]/.test(value);
    const c5 = /[^\da-zA-Z~`!@#$%^&*()_+=<>/?\\|;:.,"{}[\]]/.test(value);
    return !c5 && [c1, c2, c3, c4].filter((c) => c).length >= 3;
  },
  message: '密码应包括8-20个字符，由大写字母、小写字母、数字、特殊符号中的三种及以上组成',
});

extend('mobile', {
  validate(value) {
    return value && /^1\d{10}$/.test(value);
  },
  message: '{_field_}不是有效的手机号码',
});

extend('variable_name', {
  validate(value) {
    return /[\u4E00-\u9FA5A-zA-Z0-9_-]/.test(value);
  },
  message: '{_field_}仅支持中文、英文大小写字符、数字、下划线、短划线',
});
