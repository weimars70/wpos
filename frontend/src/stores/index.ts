// @ts-ignore
import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';

/*
 * When adding custom properties to stores, you should also
 * extend the `PiniaCustomProperties` interface via declaration merging.
 * See https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
 */
declare module 'pinia' {
  export interface PiniaCustomProperties {
    // add your custom properties here, if any
  }
}

export default store((/* { ssrContext } */) => {
  const pinia = createPinia();

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  return pinia;
});
