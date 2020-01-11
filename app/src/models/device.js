import {post, handleData, get} from '@helper/utils';
import {message} from 'antd';
import {deviceData, deviceInfo} from '@helper/data';
const { ipcRenderer } = window.require('electron');

export default {
	namespace: 'device',
	state: {
        myHost: '',
        devices: [],
		currentLoginDevice: '192.168.2.208',
		downloadDevices: []
	},
	reducers: {
        saveMyHost (state, { payload: myHost}) {
            return {...state, myHost}
        },

        saveDevices (state, { payload: devices}) {
            console.log(devices, 'devices')
            return {...state, devices}
        },

        saveCurrentLoginDevice(state, { payload: currentLoginDevice}) {
            return {...state, currentLoginDevice}
		},
		
		saveDownloadDevices(state, { payload: downloadDevices}) {
			console.log(downloadDevices, 'downloadDevice')
            return {...state, downloadDevices}
		},
	},
	effects: {
		*loginDevice ({ payload: param }, { call, put, select, take }) {
	
			const json = yield call(post, '/account/signin', {...param});

			handleData(json).then((data) => {
				message.success('登录成功');
				ipcRenderer.send('save-user', data.data)
			});	
		},

		*searchDevice ({ payload: param }, { call, put, select, take }) {
			const json = yield call(get, `${param.ip}/usapi`, {method: 'ping'}, 1, param.cb);
            let devices = yield select(state => state.device.devices);

            if (json.data.result === 0) {
                devices.push(param.ip);
                yield put({ type: 'saveDevices', payload: devices});
            }
		},

		*getDeviceVideos ({ payload: param }, { call, put, select, take }) {
			const json = yield call(post, '/account/signin', {...param});
			console.log(json, 'json');
			let currentLoginDevice = yield select(state => state.device.currentLoginDevice);
			console.log(currentLoginDevice, 'currentLoginDevice')
			let device = {...deviceInfo, ip: currentLoginDevice};
			device['media-files'] = [];
			console.log(device, 'device')
			ipcRenderer.send('save-device', device);
		}
	},
	subscriptions: {
		setup({ dispatch, history } ) {	
            
		}
	},
};
