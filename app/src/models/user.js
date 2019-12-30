import {post, handleData, get, getTokenLocalstorage} from '@helper/utils';
import {message} from 'antd';
const { ipcRenderer } = window.require('electron')


const loginData = {
    "status": 1,
    "msg": "",
    "data": {
        "login_id": 18784,
        "token": "YjkwNTA2YzM5NTU4MjA3NDU2NGZmYWFlZmY1M2I2MGVhYmFiMjZlNDk3OWQxNzY1YzllZTc5MmU3NWU0ZjA5NA==",
        "phone": "13127808798",
        "email": "",
        "company_name": "",
        "realname": "123456",
        "avatar": "",
        "refresh_token": "NmRhMTdhYzIwNmIwOTkwMjYyODZhNjY3OGNlYWYxZTdkMzQ5YTQ0YzhmMWI5YWQwMmQxNmJlZGExYjhkNmVjZg==",
        "status": 1
    }
}

export default {
	namespace: 'user',
	state: {
		xcxShow: false,
		prModalShow: false,
	},
	reducers: {
		saveXcxShow(state, { payload: xcxShow}) {
			return {...state, xcxShow};
		},

		savePrModalShow(state, { payload: prModalShow}) {
			return {...state, prModalShow};
		},
	},
	effects: {
		*applyApp({ payload: param }, { call, put, select, take }) {

		},

		*login ({ payload: param }, { call, put, select, take }) {
	
			const json = yield call(post, '/account/signin', {...param});
			
			// handleData(json).then((data) => {
			// 	message.success('登录成功');
			// 	console.log(data, 'data')
			// });

			let data = loginData;
			// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
	
			ipcRenderer.on('reply-user', (event, arg) => {
				console.log(arg) // prints "pong"
			})
			ipcRenderer.send('save-user', data)
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
