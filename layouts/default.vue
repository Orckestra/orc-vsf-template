<template>
  <div>
    <OfflineWarning />
    <LazyHydrate when-visible>
      <TopBar class="desktop-only" />
    </LazyHydrate>

    <AppHeader />

    <div id="layout">
      <nuxt :key="route.fullPath"/>

      <BottomNavigation />
      <CartSidebar />
      <WishlistSidebar />
      <LoginModal />
      <Notification />
    </div>
    <LazyHydrate when-visible>
      <AppFooter />
    </LazyHydrate>
  </div>
</template>

<script>
import AppHeader from '~/components/AppHeader.vue';
import BottomNavigation from '~/components/BottomNavigation.vue';
import AppFooter from '~/components/AppFooter.vue';
import TopBar from '~/components/TopBar.vue';
import CartSidebar from '~/components/CartSidebar.vue';
import WishlistSidebar from '~/components/WishlistSidebar.vue';
import LoginModal from '~/components/LoginModal.vue';
import LazyHydrate from 'vue-lazy-hydration';
import Notification from '~/components/Notification';
import OfflineWarning from '~/components/Layout/OfflineWarning.vue';
import { onSSR } from '@vue-storefront/core';
import { useRoute } from '@nuxtjs/composition-api';
import { useCart, useStore, useUser, useWishlist, useMetadata, useConfiguration, useCountries, useCategory, useSearch } from 'orc-vsf';

export default {
  name: 'DefaultLayout',

  components: {
    LazyHydrate,
    TopBar,
    AppHeader,
    BottomNavigation,
    AppFooter,
    CartSidebar,
    WishlistSidebar,
    LoginModal,
    Notification,
    OfflineWarning
  },

  setup() {
    const route = useRoute();
    const { load: loadStores } = useStore();
    const { load: loadUser } = useUser();
    const { load: loadCart } = useCart();
    const { load: loadWishlist } = useWishlist();
    const { load: loadMetadata} = useMetadata();
    const { load: loadConfiguration} = useConfiguration();
    const { load: loadCountries } = useCountries();
    const { search: loadCategories } = useCategory('categories');
    const { search: categoryCountsSearch } = useSearch('categoryCounts');

    onSSR(async () => {
      await Promise.all([
        loadStores(),
        loadUser(),
        loadCart(),
        loadWishlist(),
        loadMetadata(),
        loadConfiguration(),
        loadCountries(),
        loadCategories({}),
        categoryCountsSearch({ queryType: 'FacetCounts', facetCounts: ['CategoryLevel1', 'CategoryLevel2', 'CategoryLevel3']})
      ]);
    });

    return {
      route
    };
  }
};
</script>

<style lang="scss">
@import "~@storefront-ui/vue/styles";
:root {
  .sf-tabs__content__tab {
    // workaround for issue https://github.com/vuestorefront/storefront-ui/issues/2491
    transform: translate3d(0, 0, 0);
  }
}
#layout {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
}

.no-scroll {
  overflow: hidden;
  height: 100vh;
}

// Reset CSS
html {
  width: auto;
  @include for-mobile {
    overflow-x: hidden;
  }
}
body {
  overflow-x: hidden;
  color: var(--c-text);
  font-size: var(--font-size--base);
  font-family: var(--font-family--primary);
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
  color: var(--c-link);
  &:hover {
    color: var(--c-link-hover);
  }
}
h1 {
  font-family: var(--font-family--secondary);
  font-size: var(--h1-font-size);
  line-height: 1.6;
  margin: 0;
}
h2 {
  font-family: var(--font-family--secondary);
  font-size: var(--h2-font-size);
  line-height: 1.6;
  margin: 0;
}
h3 {
  font-family: var(--font-family--secondary);
  font-size: var(--h3-font-size);
  line-height: 1.6;
  margin: 0;
}
h4 {
  font-family: var(--font-family--secondary);
  font-size: var(--h4-font-size);
  line-height: 1.6;
  margin: 0;
}

.sf-bottom-modal__container > .sf-bottom-modal__close{
  position: absolute;
}

@include for-desktop {
  .sf-header__search {
    max-width: 20rem;
  }
}
</style>
