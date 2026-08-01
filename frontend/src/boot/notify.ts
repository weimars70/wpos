import { boot } from 'quasar/wrappers';
import { Notify } from 'quasar';

export default boot(() => {
  Notify.setDefaults({
    position: 'center',
    classes: 'q-notify-centered text-center',
    timeout: 2500,
  });
});
