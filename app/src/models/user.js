import {post, handleData, get, getTokenLocalstorage} from '@helper/utils';
import {message} from 'antd';
import {STORE_FIELD} from '@config/user';
import { routerRedux } from 'dva/router';
import {getProjectsVideos, saveProjects, loopFetchProjects} from '@helper/projects';
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


export default {
	namespace: 'user',
	state: {
		xcxShow: false,
		prModalShow: false,
		userInfo: null
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
	},
	effects: {
		*applyApp({ payload: param }, { call, put, select, take }) {

		},

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
			let handleHasUser = (userInfo) => {
				dispatch({
					type: 'saveUserInfo',
					payload: userInfo
				});
				dispatch(routerRedux.push({
					pathname: '/cloud',
				}));
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
				setTimeout(() => {
					handleHasUser(JSON.parse(userInfo));
				}, 3000);
			} else{
				setTimeout(() => {
					dispatch(routerRedux.push({
						pathname: '/login',
					}));
				});
			}

			ipcRenderer.on('store-client-user', (event, arg) => {
				localStorage.setItem(STORE_FIELD, JSON.stringify(arg));
				handleHasUser(arg);
			});

			ipcRenderer.on('project-render', (event, projects) => {
				dispatch({
					type: 'project/saveProjects',
					payload: projects
				});
			});
		}
	},
};
