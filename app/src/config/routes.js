const routes = [
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
                component: '../pages/login/index'
            }
        ]
    }
];
export default routes;