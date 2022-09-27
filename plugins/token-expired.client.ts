import type { Plugin } from '@nuxt/types';
import { useUiNotification } from '~/composables';

const plugin: Plugin = ({ app }) => {
  app.$vsf.$occ.client.interceptors.response.use((response) => {
    if (response.headers) {
      const tokenExpired = response.headers['token-expired'];
      if (tokenExpired === 'true') {
        const { send: sendNotification } = useUiNotification();
        sendNotification({
          id: Symbol('token-expired_error'),
          message: app.i18n.t('Your authentication session has expired. Please log in again.').toString(),
          type: 'danger',
          icon: 'warning',
          persist: false,
          action: {
            text: '',
            onClick: (): void => { }
          },
          dismiss: (): void => { }
        });

        app.$vsf.$occ.api.initializeGuestToken().then(() => {
          window.location.reload(true);
        });
        return false;
      }
    }
    return response;
  });
};

export default plugin;
