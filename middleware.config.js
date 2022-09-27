module.exports = {
  integrations: {
    occ: {
      location: 'orc-vsf-api/server',
      configuration: {
        api: {
          url: process.env.OVERTURE_URL,
          authToken: process.env.OVERTURE_AUTH_TOKEN,
        },
        scope: process.env.OVERTURE_SCOPE_NAME,
        inventoryLocationIds: process.env.OVERTURE_INVENTORY_LOCATION_IDS,
        paymentProviders: ['Bambora','Onsite payment'],
        searchConfig: {
          defaultItemsPerPage: 12,
          availableFacets: [
            { name: 'Brand', type: 1 },
            { name: 'SeasonWear', type: 1 },
            { name: 'ShirtType', type: 1 },
            { name: 'ShoeType', type: 1 },
            { name: 'HeelsHeight', type: 1 },
            { name: 'CurrentPrice', type: 2 }],
          categoryCountFacets: ['CategoryLevel1', 'CategoryLevel2', 'CategoryLevel3']
        },
       mediaProviderConfig: {
          serverUrl: process.env.MEDIA_SERVER_URL ?? 'https://refapp.azureedge.net',
          imageFolderName: process.env.MEDIA_FOLDER ?? 'images',
          fallbackImage: 'image_not_found.jpg',
          maxThumbnailImages: 1
        },
        myAccount: {
          secretPassphrase: process.env.SECRET_PASSPHRASE
        }
      },
    },
  },
};
