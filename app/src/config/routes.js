export default [
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
                path: '/user',
                component: '../pages/user/index'
            }
        ]
    }
];