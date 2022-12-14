<template>
  <SfSection :title-heading="title" class="section">
    <SfLoader :class="{ loading }" :loading="loading">
      <SfCarousel
        :settings="{ peek: 16, breakpoints: { 1023: { peek: 0, perView: 2 } } }"
        class="carousel"
      >
        <SfCarouselItem class="carousel__item" v-for="(product, i) in products" :key="i">
          <SfProductCard
            :title="productGetters.getName(product)"
            :image="addBasePath(productGetters.getCoverImage(product))"
            :image-height="326"
            :image-width="216"
            :regular-price="$n(productGetters.getPrice(product).regular, 'currency')"
            :special-price="productGetters.getPrice(product).special && $n(productGetters.getPrice(product).special, 'currency')"
            :show-add-to-cart-button="true"
            :is-added-to-cart="isInCart({ product })"
            :is-in-wishlist="isInWishlist({ product })"
            :link="localePath(productGetters.getLink(product))"
            class="product-card"
            @click:add-to-cart="addItemToCart({ product, quantity: 1 })"
            @click:wishlist="!isInWishlist({ product }) ? addItemToWishlist({ product }) : removeProductFromWishlist(product)"
          />
        </SfCarouselItem>
      </SfCarousel>
    </SfLoader>
  </SfSection>
</template>

<script lang="ts">
import {
  SfCarousel,
  SfProductCard,
  SfSection,
  SfLoader
} from '@storefront-ui/vue';
import { productGetters, useCart, useWishlist, wishlistGetters } from 'orc-vsf';
import { addBasePath } from '@vue-storefront/core';
import type { WishlistItem } from 'orc-vsf-api';
export default {
  name: 'RelatedProducts',
  components: {
    SfCarousel,
    SfProductCard,
    SfSection,
    SfLoader
  },
  props: {
    title: String,
    products: Array,
    loading: Boolean
  },
  setup() {
    const { addItem: addItemToCart, isInCart } = useCart();
    const { addItem: addItemToWishlist, isInWishlist, removeItem: removeItemFromWishlist, wishlist } = useWishlist();

    const removeProductFromWishlist = (productItem) => {
      const wishListItems = wishlistGetters.getItems(wishlist.value) as WishlistItem[];
      const product = wishListItems.find(wishlistProduct => wishlistProduct.sku === productItem.sku);
      removeItemFromWishlist({ product });
    };

    return {
      productGetters,
      addItemToWishlist,
      isInWishlist,
      removeProductFromWishlist,
      addItemToCart,
      isInCart,
      addBasePath
    };
  }
};
</script>

<style lang="scss" scoped>
.section {
  margin-top: var(--spacer-base);
}

.carousel {
    margin: 0 calc(0 - var(--spacer-sm)) 0 0;
  @include for-desktop {
    margin: 0;
  }
  &__item {
    margin: 1.9375rem 0 2.4375rem 0;
  }
}

</style>
