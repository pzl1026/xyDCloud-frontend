import {post, handleData} from '@helper/utils';
import {message} from 'antd';
const { ipcRenderer } = window.require('electron');

export default {
	namespace: 'project',
	state: {
		projects: [],
		projectsSelect: [],
        currentProjects: null,
        projectVideos: null
	},
	reducers: {
		saveProjects(state, { payload: projects}) {
			return {...state, projects};
		},

		saveCurrentProjects(state, { payload: currentProjects}) {
			return {...state, currentProjects};
		},

		saveProjectVideos(state, { payload: projectVideos}) {
			return {...state, projectVideos};
		},

		saveProjectsSelect(state, { payload: projectsSelect}) {
			return {...state, projectsSelect};
		},
	},
	effects: {
		*login ({ payload: param }, { call, put, select, take }) {
	
			const json = yield call(post, '/account/signin', {...param});

			handleData(json).then((data) => {
				message.success('登录成功');
				ipcRenderer.send('save-user', data.data)
			});	
		},

		*sendCode ({ payload: param }, { call, put, select, take }) {
			const json = yield call(post, '/account/sms', {...param});
			
			handleData(json).then((data) => {
				message.success(data.msg);
			});
		},
	},
	subscriptions: {
		setup({ dispatch, history } ) {	
            
		}
	},
};
