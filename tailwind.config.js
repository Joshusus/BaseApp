import { fontFamily as _fontFamily } from 'tailwindcss/defaultTheme';
// eslint-disable-next-line import/no-extraneous-dependencies
import forms from '@tailwindcss/forms';

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    }, 
    // TODO doesn't seem to be supported in TW4
    // extend: {
    //   colors: {
    //     jjtest: '#227788',
    //   },
    // }
  },
  plugins: [forms({ strategy: 'class' })],
};
