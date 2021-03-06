const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  prefix: 'tw-',
  important: true,
  darkMode: 'class',

  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
      },

      colors: {
        cyan: colors.cyan,
        teal: colors.teal,
        orange: colors.orange,

        inherit: 'inherit',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        tertiary: 'var(--color-tertiary)',
        light: 'var(--color-light)',
        medium: 'var(--color-medium)',
        dark: 'var(--color-dark)',
      },

      spacing: {
        84: '21rem',
        88: '22rem',
      },

      backgroundColor: (theme) => ({
        main: theme('colors.gray.100'),
      }),

      borderWidth: {
        thin: 'thin',
      },

      boxShadow: (theme) => ({
        accent: `
          0 0 1px 3px ${theme('colors.blue.600')},
          0 0 1px 5px ${theme('colors.blue.400')}, 
          0 0 1px 7px ${theme('colors.blue.200')}
        `,
      }),

      fontFamily: {
        sans: ['Microsoft YaHei', '微软雅黑', ...defaultTheme.fontFamily.sans],
      },
    },
  },

  variants: {},
  plugins: [],
};
