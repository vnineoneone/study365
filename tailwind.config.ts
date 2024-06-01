/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/flowbite-react/lib/**/*.js"
  ],
  theme: {
    extend: {
      boxShadow: {
        header_teacher: '0 3px 10px 0 rgba(0, 0, 0, 0.03)',
        sidebar_teacher: '18px 0 35px 0 rgba(0, 0, 0, 0.02);',
        progress_bar_course: "0px 12px 23px 0px rgba(62, 73, 84, 0.04)"
      },
      colors: {
        panel_bg: '#fbfbfd',
        success: '#e7f4f0',
        info: '#ebf7ff',
        primary: '#43d477',
        secondary: '#1f3b64',
        warning: '#ffab00',
        danger: '#f63c3c',
        light: '#f9f9f9',
        dark: '#343434',
        gray300: '#ececec',
        gray200: '#f1f1f1',
        gray100: '#f9f9f9',
        primary_hover: '#1FB354',
        primary_border: '#43d477',
        primary_border_hover: '#2aba5e',
        primary_btn_shadow: '0 3px 6px 0 rgb(64 213 125 / 30%)',
        primary_btn_shadow_hover: '0 3px 8px 0 rgb(64 213 125 / 30%)',
        primary_btn_color: '#ffffff',
        primary_btn_color_hover: '#ffffff',
        secondary_hover: '#162a47',
        secondary_border: '#162a47',
        secondary_border_hover: '#13243d',
        secondary_btn_shadow: '0 3px 6px 0 rgb(64 213 125 / 30%)',
        secondary_btn_shadow_hover: '0 3px 8px 0 rgb(64 213 125 / 30%)',
        secondary_btn_color: '#ffffff',
        secondary_btn_color_hover: '#ffffff',
      },
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};