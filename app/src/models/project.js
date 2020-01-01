import {post, handleData, get} from '@helper/utils';
import {message} from 'antd';
const { ipcRenderer } = window.require('electron');

export default {
	namespace: 'project',
	state: {
        projects: [],
        currentProjects: null,
        projectVideos: null
	},
	reducers: {
		saveProjects(state, { payload: projects}) {
			console.log(projects, 'projects')
			return {...state, projects};
		},

		saveCurrentProjects(state, { payload: currentProjects}) {
			return {...state, currentProjects};
		},

		saveProjectVideos(state, { payload: projectVideos}) {
			return {...state, projectVideos};
		},
	},
	effects: {
		*login ({ payload: param }, { call, put, select, take }) {
	
			const json = yield call(post, '/account/signin', {...param});

			handleData(json).then((data) => {
				message.success('登录成功');
				console.log(data, 'data')
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
