module.exports = {
  corePlugins: {},
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--color)',
        'black': '#141414',
        'gray-8c8c8c': '#8c8c8c',
        'gray-e8e8e8': '#e8e8e8',
        'gray-999': '#999999',
        'gray-E7E7E7': '#E7E7E7',
        'gray-FAFAFA': '#FAFAFA'
      },
    },
  },
}
