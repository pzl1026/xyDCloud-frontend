import {post, handleData} from '@helper/utils';
import {message} from 'antd';

export default {
	namespace: 'global',
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
			
			handleData(json).then((data) => {

			})
		},

		*sendCode ({ payload: param }, { call, put, select, take }) {
			const json = yield call(post, '/account/sms', {...param});
			
			handleData(json).then((data) => {
				message.success(data.msg);
			}, (data) => {

			});
		},
	},
	subscriptions: {},
};
