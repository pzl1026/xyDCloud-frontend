import {post, handleData, queryData2Md5, get} from '@helper/utils';
import {STORE_FIELD} from '@config/user';
import {message} from 'antd';
const { ipcRenderer } = window.require('electron');

var loopFetchProjectsTimer = null;

async function getProjects(loginId, handleProjects) {
    return new Promise(async (resolve, reject) => {
        let json = await post('/project/list', queryData2Md5({
            login_id: loginId
        }));
        if (json.data.status === 1) {
            handleProjects && handleProjects(json.data.data.list);
            resolve(json.data.data.list);
        } else {
            message.error(json.data.msg);
        }
    });
     
}

async function getVideos (loginId, projectIds) {
    let videoFetches = projectIds.map(item => {
        return post('/project/file', queryData2Md5({
            login_id: loginId,
            project_id: item
        }));
    })
    return Promise.all(videoFetches);
}

export async function getProjectsVideos (loginId, handleProjects, handleProjectsVideos) {
    await getProjects(loginId, handleProjects)
    let projects = await getProjects(loginId, handleProjects);
    let projectIds = projects.map(n => n.id);
    let res = await getVideos(loginId, projectIds);
    const videoFields = ['id', 'file_type', 'name', 'size', 'project_id'];
    handleProjectsVideos && handleProjectsVideos(res);
    let videos = res.map((item, index) => {
        return {
            project_id: projectIds[index],
            list: item.data.data.list.map(m => {
                let o = {};
                for (let k in m) {
                    if (videoFields.includes(k)) {
                        o[k] = m[k];
                    }
                }
                return Object.assign({}, o, {
                    url: m.project_file.url,
                    project_id: projectIds[index]
                });
            })
        };
    });

    ipcRenderer.send('save-projects-video', {
        loginId,
        videos
    });
    
    console.log(videos, 'vvideos')
}

export function loopFetchProjects (handleProjects, handleProjectsVideos) {
    let userInfo = JSON.parse(localStorage.getItem(STORE_FIELD));
    getProjectsVideos(userInfo.login_id, handleProjects, handleProjectsVideos);
    return;
    loopFetchProjectsTimer = setInterval(() => {
        if (!userInfo){
            clearInterval(loopFetchProjectsTimer);
            loopFetchProjectsTimer = null;
            return;
        }
        getProjectsVideos(userInfo.login_id, handleProjects, handleProjectsVideos);
    }, 20000);
}

// 获取项目后，进行本地存储
export function saveProjects (dispatch, projects) {
    let userInfo = JSON.parse(localStorage.getItem(STORE_FIELD));

	dispatch({
		type: 'project/saveProjects',
		payload: projects
    });
    ipcRenderer.send('save-projects', {
        userId: userInfo.login_id,
        projects
    });
}