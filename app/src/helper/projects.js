// import {post, handleData, get} from '@helper/utils';
// import {message} from 'antd';

// async function getProjects(loginId) {
//     return await get(handleData({
//         login_id: loginId
//     }))
// }

// async function getVideos () {
//     // project_id = 
//     return new Promise.all()
// }

// export async function getProjectsVideos (loginId) {
//     let json = await getProject(loginId);
//     if (json.data.status === 1) {
//         let projects = json.data.data;
//         let res = await getVideos(projects.map(n => n.id));
//         console.log(res);
//     } else {
//         message.error('登录成功');
//     }
// }