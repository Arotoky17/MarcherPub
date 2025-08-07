module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        waveMotion: 'waveMotion 6s ease-in-out infinite',
      },
      keyframes: {
        waveMotion: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(4px)' },
        },
      },
    },
  },
  plugins: [],
}
