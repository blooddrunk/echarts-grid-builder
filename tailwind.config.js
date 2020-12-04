module.exports = {
  prefix: 'tw-',
  important: true,
  darkMode: 'class',

  theme: {
    extend: {
      borderWidth: {
        thin: 'thin',
      },

      screens: {
        dark: { raw: '(prefers-color-scheme: dark)' },
        light: { raw: '(prefers-color-scheme: light)' },
      },

      colors: {
        inherit: 'inherit',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        tertiary: 'var(--color-tertiary)',
        light: 'var(--color-light)',
        medium: 'var(--color-medium)',
        dark: 'var(--color-dark)',
      },

      backgroundColor: (theme) => ({
        main: theme('colors.gray.100'),
      }),

      boxShadow: (theme) => ({
        accent: `
          0 0 1px 3px ${theme('colors.purple.600')},
          0 0 1px 5px ${theme('colors.purple.400')}, 
          0 0 1px 7px ${theme('colors.purple.200')}
        `,
      }),

      spacing: {
        72: '18rem',
        84: '21rem',
        96: '24rem',
      },
    },
  },

  variants: {},
  plugins: [],
};
