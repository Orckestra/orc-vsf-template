<template>
  <div id="category">
    <SfBreadcrumbs
      class="breadcrumbs"
      :breadcrumbs="breadcrumbs"
    >
      <template #link="{ breadcrumb }">
        <nuxt-link
          :data-testid="breadcrumb.text"
          :to="breadcrumb.link ? localePath(breadcrumb.link) : ''"
          class="sf-link disable-active-link sf-breadcrumbs__breadcrumb"
        >
          {{ breadcrumb.text }}
        </nuxt-link>
      </template>
      <template #current="{ breadcrumb }">
        {{ breadcrumb.text }}
        </template>
    </SfBreadcrumbs>
    <div class="navbar section">
      <div class="navbar__aside desktop-only">
        <LazyHydrate never>
          <SfHeading
            :level="3"
            :title="$t('Categories')"
            class="navbar__title" />
        </LazyHydrate>
      </div>
      <CategoryPageHeader :pagination="pagination"/>
    </div>

    <div class="main section">
      <div class="sidebar desktop-only">
        <LazyHydrate when-idle>
          <SfLoader
          :class="{ 'loading--categories': loading }"
          :loading="loading">
            <SfAccordion
              v-e2e="'categories-accordion'"
              :open="activeCategory"
              :show-chevron="true"
            >
              <SfAccordionItem
                v-for="(cat, i) in categoryTree && categoryTree.items"
                :key="i"
                :header="cat.label"
              >
                <template>
                  <SfList class="list">
                    <SfListItem class="list__item">
                      <SfMenuItem
                        v-if="cat.count"
                        :count="cat.count || ''"
                        :label="cat.label"
                      >
                        <template #label>
                          <nuxt-link
                            :to="localePath(th.getCatLink(cat))"
                            class="sidebar--cat"
                            :class="cat.isCurrent ? 'sidebar--cat-selected' : ''"
                          >
                            All
                          </nuxt-link>
                        </template>
                      </SfMenuItem>
                    </SfListItem>
                    <SfListItem
                      class="list__item"
                      v-for="(subCat, j) in cat.items"
                      :key="j"
                    >
                      <SfMenuItem
                        v-if="subCat.count"
                        :count="subCat.count || ''"
                        :label="subCat.label"
                      >
                        <template #label="{ label }">
                          <nuxt-link
                            class="sidebar--cat"
                            :to="localePath(th.getCatLink(subCat))"
                            :class="subCat.isCurrent ? 'sidebar--cat-selected' : ''"
                          >
                            {{ label }}
                          </nuxt-link>
                        </template>
                      </SfMenuItem>
                    </SfListItem>
                  </SfList>
                </template>
              </SfAccordionItem>
            </SfAccordion>
          </SfLoader>
        </LazyHydrate>
      </div>
      <SfLoader :class="{ loading }" :loading="loading">
        <div class="products" v-if="!loading">
          <transition-group
            v-if="isCategoryGridView"
            appear
            name="products__slide"
            tag="div"
            class="products__grid"
          >
            <SfProductCard
              v-e2e="'category-product-card'"
              v-for="(product, i) in products"
              :key="productGetters.getSlug(product)"
              :style="{ '--index': i }"
              :title="productGetters.getName(product)"
              :image="addBasePath(productGetters.getCoverImage(product))"
              :image-height="326"
              :image-width="216"
              :regular-price="$n(productGetters.getPrice(product).regular, 'currency')"
              :special-price="productGetters.getPrice(product).special && $n(productGetters.getPrice(product).special, 'currency')"
              :show-add-to-cart-button="true"
              :is-in-wishlist="isInWishlist({ product })"
              :is-added-to-cart="isInCart({ product })"
              :link="localePath(productGetters.getLink(product))"
              class="products__product-card"
              @click:wishlist="!isInWishlist({ product }) ? addItemToWishlist({ product }) : removeProductFromWishlist(product)"
              @click:add-to-cart="addToCart({ product, quantity: 1 })"
            />
          </transition-group>
          <transition-group
            v-else
            appear
            name="products__slide"
            tag="div"
            class="products__list"
          >
            <SfProductCardHorizontal
              v-e2e="'category-product-card'"
              v-for="(product, i) in products"
              class="products__product-card-horizontal"
              :key="productGetters.getSlug(product)"
              :style="{ '--index': i }"
              :title="productGetters.getName(product)"
              :description="productGetters.getDescription(product)"
              :image="addBasePath(productGetters.getCoverImage(product))"
              :image-height="200"
              :image-width="140"
              :regular-price="$n(productGetters.getPrice(product).regular, 'currency')"
              :special-price="productGetters.getPrice(product).special && $n(productGetters.getPrice(product).special, 'currency')"
              :qty="1"
              :is-in-wishlist="isInWishlist({ product })"
              :link="localePath(productGetters.getLink(product))"
              @input="productsQuantity[product.id] = $event"
              @click:wishlist="!isInWishlist({ product }) ? addItemToWishlist({ product }) : removeProductFromWishlist(product)"
              @click:add-to-cart="addToCart({ product, quantity: Number(productsQuantity[product.id] || 1) })"
            >
              <template #configuration>
                <SfProperty
                  class="desktop-only"
                  name="Brand"
                  :value="productGetters.getBrand(product)"
                  style="margin: 0 0 1rem 0;"
                />
              </template>
              <template #actions>
                <SfButton
                  class="sf-button--pure sf-header__action desktop-only"
                  aria-label="Toggle wishlist sidebar"
                  @click="!isInWishlist({ product }) ? addItemToWishlist({ product }) : removeProductFromWishlist(product)"
                >
                  <SfIcon
                    class="sf-header__icon"
                    :icon="isInWishlist({ product }) ? 'heart_fill' : 'heart' "
                    size="1.25rem"
                  />
               </SfButton>
                <SfAddToCart
                  v-model="productsQuantity[product.id]"
                  @input="productsQuantity[product.id] = $event"
                  class="sf-product-card-horizontal__add-to-cart smartphone-only"
                 @click="addToCart({ product, quantity: Number(productsQuantity[product.id] || 1) })"
              />

              </template>
            </SfProductCardHorizontal>
          </transition-group>

          <LazyHydrate on-interaction>
            <SfPagination
              v-if="!loading"
              class="products__pagination desktop-only"
              v-show="pagination.totalPages > 1"
              :current="pagination.currentPage"
              :total="pagination.totalPages"
              :visible="5"
            />
          </LazyHydrate>

          <div
            v-show="pagination.totalPages > 1"
            class="products__show-on-page"
          >
            <span class="products__show-on-page__label">{{ $t('Show on page') }}</span>
            <LazyHydrate on-interaction>
              <SfSelect
                :value="pagination && pagination.itemsPerPage ? pagination.itemsPerPage.toString() : ''"
                class="products__items-per-page"
                @input="th.changeItemsPerPage"
              >
                <SfSelectOption
                  v-for="option in pagination.pageOptions"
                  :key="option"
                  :value="option"
                  class="products__items-per-page__option"
                >
                  {{ option }}
                </SfSelectOption>
              </SfSelect>
            </LazyHydrate>
          </div>
        </div>
      </SfLoader>
    </div>
  </div>
</template>

<script>
import {
  SfSidebar,
  SfButton,
  SfList,
  SfIcon,
  SfHeading,
  SfMenuItem,
  SfFilter,
  SfProductCard,
  SfProductCardHorizontal,
  SfPagination,
  SfAccordion,
  SfSelect,
  SfBreadcrumbs,
  SfLoader,
  SfColor,
  SfProperty,
  SfAddToCart
} from '@storefront-ui/vue';
import { computed, ref } from '@nuxtjs/composition-api';
import { useCart, useWishlist, productGetters, useFacet, facetGetters, wishlistGetters } from 'orc-vsf';
import { useUiHelpers, useUiState } from '~/composables';
import { onSSR } from '@vue-storefront/core';
import LazyHydrate from 'vue-lazy-hydration';
import CategoryPageHeader from '~/components/CategoryPageHeader';
import { addBasePath } from '@vue-storefront/core';

// TODO(addToCart qty, horizontal): https://github.com/vuestorefront/storefront-ui/issues/1606
export default {
  transition: 'fade',
  setup(props, context) {
    const th = useUiHelpers();
    const uiState = useUiState();
    const { addItem: addItemToCart, isInCart } = useCart();
    const { result, search, loading, error } = useFacet();
    const { addItem: addItemToWishlist, isInWishlist, removeItem: removeItemFromWishlist, wishlist } = useWishlist();

    const productsQuantity = ref({});
    const products = computed(() => facetGetters.getProducts(result.value));
    const categoryTree = computed(() => facetGetters.getCategoryTree(result.value));
    const breadcrumbs = computed(() => facetGetters.getBreadcrumbs(result.value));
    const pagination = computed(() => facetGetters.getPagination(result.value));
    const activeCategory = computed(() => {
      const items = categoryTree.value?.items;

      if (!items || !items.length) {
        return '';
      }

      const category = items.find(({ isCurrent, items }) => isCurrent || items.find(({ isCurrent }) => isCurrent));

      return category?.label || items[0].label;
    });

    const removeProductFromWishlist = (productItem) => {
      const wishListItems = wishlistGetters.getItems(wishlist.value);
      const product = wishListItems.find(wishlistProduct => wishlistProduct.sku === productItem.sku);
      removeItemFromWishlist({ product });
    };

    const addToCart = ({ product, quantity }) => {
      addItemToCart({
        product,
        quantity
      });
    };

    onSSR(async () => {
      await search({queryType: 'Category', ...th.getFacetsFromURL(), withFacetCounts: true});
      if (error?.value?.search) context.root.$nuxt.error({ statusCode: 404 });
    });

    return {
      ...uiState,
      th,
      products,
      categoryTree,
      loading,
      productGetters,
      pagination,
      activeCategory,
      breadcrumbs,
      addItemToWishlist,
      removeProductFromWishlist,
      isInWishlist,
      addToCart,
      isInCart,
      productsQuantity,
      addBasePath
    };
  },
  components: {
    CategoryPageHeader,
    SfButton,
    SfSidebar,
    SfIcon,
    SfList,
    SfFilter,
    SfProductCard,
    SfProductCardHorizontal,
    SfPagination,
    SfMenuItem,
    SfAccordion,
    SfSelect,
    SfBreadcrumbs,
    SfLoader,
    SfColor,
    SfHeading,
    SfProperty,
    LazyHydrate,
    SfAddToCart
  }
};
</script>

<style lang="scss" scoped>
#category {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
}
.main {
  &.section {
    padding: var(--spacer-xs);
    @include for-desktop {
      padding: 0;
    }
  }
}
.breadcrumbs {
  margin: var(--spacer-base) var(--spacer-base) var(--spacer-lg) var(--spacer-base);
  .sf-breadcrumbs__list-item {
    margin-top: var(--spacer-base);
  }
  @include for-desktop {
    margin: 0 auto var(--spacer-lg);
  }
}
.navbar {
  position: relative;
  display: flex;
  border: 1px solid var(--c-light);
  border-width: 0 0 1px 0;
  @include for-desktop {
    border-width: 1px 0 1px 0;
  }
  &.section {
    padding: var(--spacer-sm);
    @include for-desktop {
      padding: 0;
    }
  }
  &__aside {
    display: flex;
    align-items: center;
    padding: var(--spacer-sm) 0;
    flex: 0 0 15%;
    padding: var(--spacer-sm) var(--spacer-sm);
    border: 1px solid var(--c-light);
    border-width: 0 1px 0 0;
  }
  &__title {
    --heading-title-font-weight: var(--font-weight--semibold);
    --heading-title-font-size: var(--font-size--xl);
  }
}
.main {
  display: flex;
}
.list {
  --menu-item-font-size: var(--font-size--sm);
  &__item {
    &:not(:last-of-type) {
      --list-item-margin: 0 0 var(--spacer-sm) 0;
    }
    .nuxt-link-exact-active {
      text-decoration: underline;
    }
    .nuxt-link-active {
      font-weight: bold;
    }
  }
}
.products {
  box-sizing: border-box;
  flex: 1;
  margin: 0;
  &__grid {
    justify-content: center;
    @include for-desktop {
      justify-content: flex-start;
    }
  }
  &__grid,
  &__list {
    display: flex;
    flex-wrap: wrap;
  }
  &__product-card {
    --product-card-title-margin: var(--spacer-base) 0 0 0;
    --product-card-title-font-weight: var(--font-weight--medium);
    --product-card-title-margin: var(--spacer-xs) 0 0 0;
    flex: 1 1 50%;
    @include for-desktop {
      --product-card-title-font-weight: var(--font-weight--normal);
      --product-card-add-button-bottom: var(--spacer-base);
      --product-card-title-margin: var(--spacer-sm) 0 0 0;
    }
    @include for-mobile {
    --product-card-add-button-opacity: 1;
    --product-card-add-button-display: flex;
    --product-card-add-button-bottom: 0.5rem;
    }
  }
  &__product-card-horizontal {
    flex: 0 0 100%;
    @include for-mobile {
      --product-card-add-button-opacity: 1;
      --product-card-add-button-display: flex;
      --product-card-add-button-bottom: 0.5rem;
      padding-bottom: var(--spacer-sm);
      padding-top: var(--spacer-sm);
      border-bottom: solid 2px var(--c-light);
      ::v-deep .sf-image {
        --image-width: 5.3125rem;
        --image-height: 7.0625rem;
      }
    }
  }
  &__slide-enter {
    opacity: 0;
    transform: scale(0.5);
  }
  &__slide-enter-active {
    transition: all 0.2s ease;
    transition-delay: calc(0.1s * var(--index));
  }
  @include for-desktop {
    &__grid {
      margin: var(--spacer-sm) 0 0 var(--spacer-sm);
    }
    &__pagination {
      display: flex;
      justify-content: flex-start;
      margin: var(--spacer-xl) 0 0 0;
    }
    &__product-card-horizontal {
      margin: var(--spacer-lg) 0;
    }
    &__product-card {
      flex: 1 1 25%;
    }
    &__list {
      margin: 0 0 0 var(--spacer-sm);
    }
  }
  &__show-on-page {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    &__label {
      font-family: var(--font-family--secondary);
      font-size: var(--font-size--sm);
    }
  }
}
.sidebar {
  flex: 0 0 15%;
  padding: var(--spacer-sm);
  border: 1px solid var(--c-light);
  border-width: 0 1px 0 0;

  &--cat {
    text-align: left;
  }
}
.loading {
  margin: var(--spacer-3xl) auto;
  @include for-desktop {
    margin-top: 6.25rem;
  }
  &--categories {
    @include for-desktop {
      margin-top: 3.75rem;
    }
  }
}
</style>
