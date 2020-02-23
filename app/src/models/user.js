import {post, handleData, get3} from '@helper/utils';
import {message} from 'antd';
import {STORE_FIELD} from '@config/user';
import { routerRedux } from 'dva/router';
import {saveProjects, loopFetchProjects} from '@helper/projects';
const { ipcRenderer } = window.require('electron');

// const user = {
//     "status": 1,
//     "msg": "",
//     "data": {
//         "login_id": 18784,
//         "token": "YjkwNTA2YzM5NTU4MjA3NDU2NGZmYWFlZmY1M2I2MGVhYmFiMjZlNDk3OWQxNzY1YzllZTc5MmU3NWU0ZjA5NA==",
//         "phone": "13127808798",
//         "email": "",
//         "company_name": "",
//         "realname": "123456",
//         "avatar": "",
//         "refresh_token": "NmRhMTdhYzIwNmIwOTkwMjYyODZhNjY3OGNlYWYxZTdkMzQ5YTQ0YzhmMWI5YWQwMmQxNmJlZGExYjhkNmVjZg==",
//         "status": 1
//     }
// }


function checkNetwork() {
	window.addEventListener("offline", function(e) {
		ipcRenderer.send('change-line-status', 1);
	});
	
	window.addEventListener("online", function(e) {
	
		ipcRenderer.send('change-line-status', 0);
	});
}

export default {
	namespace: 'user',
	state: {
		xcxShow: false,
		prModalShow: false,
		userInfo: {},
		version: '',
		newVersion: '',
		versionDownloadUrl: ''
	},
	reducers: {
		saveXcxShow(state, { payload: xcxShow}) {
			return {...state, xcxShow};
		},

		savePrModalShow(state, { payload: prModalShow}) {
			return {...state, prModalShow};
		},

		saveUserInfo(state, { payload: userInfo}) {
			return {...state, userInfo};
		},

		saveVersion(state, { payload: version}) {
			return {...state, version};
		},

		saveNewVersion(state, { payload: newVersion}) {
			return {...state, newVersion};
		},

		saveVersionDownloadUrl(state, { payload: versionDownloadUrl}) {
			return {...state, versionDownloadUrl};
		},
	},
	effects: {
		*applyApp({ payload: param }, { call, put, select, take }) {

		},

		*login ({ payload: param }, { call, put, select, take }) {
			const json = yield call(post, '/account/signin', {...param});
	
			handleData(json).then((data) => {
				message.success('登录成功');
				ipcRenderer.send('save-user', data.data);
			});	
		},

		*sendCode ({ payload: param }, { call, put, select, take }) {
			const json = yield call(post, '/account/sms', {...param});
			
			handleData(json).then((data) => {
				message.success(data.msg);
			});
		},

		*getVersion ({ payload: param }, { call, put, select, take }) {
			const json = yield call(get3, 'https://raw.githubusercontent.com/pzl1026/xyDCloud/master/package.json');
			console.log(json);
			if (json.data) {
				yield put({ type: 'saveNewVersion', payload: json.data.version});
				yield put({ type: 'saveVersionDownloadUrl', payload: json.data.downloadUrl});
			}
		},
	},
	subscriptions: {
		setup({ dispatch, history } ) {	
			let handleHasUser = (userInfo) => {
				dispatch({
					type: 'saveUserInfo',
					payload: userInfo
				});
				setTimeout(() => {
					dispatch(routerRedux.push({
						pathname: '/cloud',
					}));
				}, 3000);
			
				ipcRenderer.send('device-start-download');
				loopFetchProjects((projects) => {
					saveProjects(dispatch, projects);
					dispatch({
						type: 'project/saveProjectsSelect',
						payload: projects
					});
				});
			}
			let userInfo = localStorage.getItem(STORE_FIELD);

			userInfo && ipcRenderer.send('save-user', JSON.parse(userInfo));
			if (userInfo) {
				handleHasUser(JSON.parse(userInfo));
			} else{
				setTimeout(() => {
					dispatch(routerRedux.push({
						pathname: '/login',
					}));
				}, 3000);
			}

			ipcRenderer.on('store-client-user', (event, arg) => {
				localStorage.setItem(STORE_FIELD, JSON.stringify(arg));
				handleHasUser(arg);
				// setTimeout(() => {
				// 	console.log(222222)
				// 	dispatch(routerRedux.push({
				// 		pathname: '/cloud',
				// 	}));
				// }, 3000);
			});

			ipcRenderer.on('project-render', (event, projects) => {
				dispatch({
					type: 'project/saveProjects',
					payload: projects
				});
			});

			//检查网络是否断网
			checkNetwork();
			
			// 检查版本
			setInterval(() => {
				dispatch({
					type: 'getVersion',
					payload: {}
				});
			}, 10 * 60 * 1000);

			ipcRenderer.on('save-current-version', (event, version) => {
				dispatch({
					type: 'saveVersion',
					payload: version
				});
			});
			setTimeout(() => {
				ipcRenderer.send('post-current-version');
			}, 2000);
		}
	},
};
