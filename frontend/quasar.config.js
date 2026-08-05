const { configure } = require('quasar/wrappers');

module.exports = configure(function (ctx) {
  return {
    boot: ['axios', 'notify'],
    css: ['app.scss'],
    extras: ['material-icons'],
    build: {
      vueRouterMode: 'hash',
    },
    devServer: {
      port: 9000,
      open: true,
    },
    framework: {
      config: {
        brand: {
          primary: '#1E3A8A',
          secondary: '#3B82F6',
          accent: '#06B6D4',
          positive: '#10B981',
          negative: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6'
        },
        notify: { position: 'center', classes: 'text-center' },
      },
      plugins: ['Notify', 'Dialog', 'Loading'],
    },
    animations: [],
  };
});
