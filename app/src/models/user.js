

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
		}
	},
	subscriptions: {},
};
