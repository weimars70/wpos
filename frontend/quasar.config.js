const { configure } = require('quasar/wrappers');

module.exports = configure(function (ctx) {
  return {
    boot: ['axios'],
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
        notify: { position: 'top-right' },
      },
      plugins: ['Notify', 'Dialog', 'Loading'],
    },
    animations: [],
  };
});
