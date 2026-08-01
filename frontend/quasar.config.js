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
        notify: { position: 'center', classes: 'text-center' },
      },
      plugins: ['Notify', 'Dialog', 'Loading'],
    },
    animations: [],
  };
});
