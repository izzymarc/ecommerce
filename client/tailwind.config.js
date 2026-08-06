export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        // Slow drift + zoom on hero photography
        kenburns: {
          '0%': { transform: 'scale(1) translate3d(0, 0, 0)' },
          '100%': { transform: 'scale(1.12) translate3d(-1.5%, -1%, 0)' },
        },
        // Fills the active carousel pip over the slide duration
        progress: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        kenburns: 'kenburns 7s ease-out forwards',
        progress: 'progress linear forwards',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
}