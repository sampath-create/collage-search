module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        paper: '#f7f4ef',
        'paper-muted': '#f1ede7',
        graphite: '#2f2f2f'
      },
      fontFamily: {
        title: ['"Special Elite"', 'serif'],
        body: ['"Patrick Hand"', 'cursive']
      },
      boxShadow: {
        sketch: '6px 6px 0 #111111',
        sketchSm: '4px 4px 0 #111111'
      }
    }
  },
  plugins: []
};
