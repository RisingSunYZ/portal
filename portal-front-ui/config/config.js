// https://umijs.org/config/
import os from 'os';
import slash from 'slash2';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';


const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: true, // default false
        default: 'zh-CN', // default zh-CN
        baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
      },
      pwa: {
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
          importWorkboxFrom: 'local',
        },
      },
      ...(!process.env.TEST && os.platform() === 'darwin'
        ? {
            dll: {
              include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
              exclude: ['@babel/runtime'],
            },
            hardSource: true,
          }
        : {}),
    },
  ],
];

export default {
  // add for transfer to umi
  plugins,
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },
  targets: {
    ie: 11,
  },
  hash: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/eip/' : '/eip/',
  // outputPath: '../../../../data/eip',
  outputPath: './target/eip',
  mountElementId: 'portalMainContent',
  base: '/eip',
  // 路由配置
  routes: pageRoutes,

  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  proxy: {
    '/rest/': {
      target: 'http://127.0.0.1:8889/rest/',
      changeOrigin: true,
      pathRewrite: { '^/rest/': '' },
    },
    '/portal/api/': {
      target: 'http://homedev.chinayasha.com/portal/api/',
      changeOrigin: true,
      pathRewrite: { '^/portal/api/': '' },
    },
    '/website/tools/': {
      target: 'http://homedev.chinayasha.com/website/tools/',
      changeOrigin: true,
      pathRewrite: { '^/website/tools/': '' },
    },
    '/office/': {
      // 文档预览
      target: 'http://home.chinayasha.com',
      changeOrigin: true,
    }
  },

  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/eip',
  },

  chainWebpack: webpackPlugin,
};
