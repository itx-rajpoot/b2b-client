const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#0F4D90',
              '@link-color': '#1890ff',
              '@success-color': '#52c41a',
              '@warning-color': '#FFCF00',
              '@error-color': '#F23868',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};