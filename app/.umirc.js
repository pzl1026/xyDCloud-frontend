
// ref: https://umijs.org/config/
// import routes from './src/config/routes';

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
  "hash": true,
  "disableCSSModules": true,
}
