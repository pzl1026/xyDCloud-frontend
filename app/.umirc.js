
// ref: https://umijs.org/config/
// import routes from './src/config/routes';
var path = require('path');

export default {
  treeShaking: true,
  routes:[
      {
          path : '/',
          component : '../layouts/index',
          routes : [
              {
                  path: '/',
                  component: '../pages/index'
              }, {
                  path: '/a',
                  component: '../pages/a'
              }, {
                  path: '/login',
                  component: '../pages/login'
              }, {
                  path: '/cloud',
                  component: '../pages/cloud'
              }, {
                path: '/cloudrecord',
                component: '../pages/cloudRecord'
              }, {
                path: '/cloudcreate',
                component: '../pages/cloudCreate'
              }, {
                path: '/usersetting',
                component: '../pages/usersetting'
              }, {
                path: '/device',
                component: '../pages/device'
              }, {
                path: '/videoimport',
                component: '../pages/videoImport'
              }, {
                path: '/deviceadd',
                component: '../pages/deviceAdd'
              }, {
                path: '/devicerecord',
                component: '../pages/deviceRecord'
              }
          ]
      }
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'app',
      dll: true,
      
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  "sass": {},
  "alias": {
    '@components': path.resolve(__dirname, 'src/components/'),
    '@CPC': path.resolve(__dirname, 'src/components/pageComponents/'),
    '@CC':  path.resolve(__dirname, 'src/components/common/'),
    '@CCP':  path.resolve(__dirname, 'src/components/commonPannel/'),
    '@assets': path.resolve(__dirname, 'src/assets/'),
    '@helper': path.resolve(__dirname, 'src/helper/'),
    '@services': path.resolve(__dirname, 'src/services/'),
    '@layouts': path.resolve(__dirname, 'src/layouts/'),
    '@config': path.resolve(__dirname, 'src/config/'),
    '@APP_NODE': path.resolve(__dirname, 'src/application/node/'),
    '@APP_BRO': path.resolve(__dirname, 'src/application/browser/')
},
  "hash": true,
  "disableCSSModules": true,
}
