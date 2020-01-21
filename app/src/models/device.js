import {post, handleData, get, get2} from '@helper/utils';
import {message} from 'antd';
import {deviceData, deviceInfo} from '@helper/data';
const { ipcRenderer } = window.require('electron');

export default {
	namespace: 'device',
	state: {
        myHost: '',
        devices: [],
		currentLoginDevice: '192.168.2.208',
		downloadDevices: [],
		currentDeviceVideos: []
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

		saveCurrentDeviceVideos(state, { payload: currentDeviceVideos}) {
			console.log(currentDeviceVideos, 'currentDeviceVideos222')
            return {...state, currentDeviceVideos}
		},
	},
	effects: {
		*loginDevice ({ payload: {param, cb} }, { call, put, select, take }) {
			const json = yield call(get2, '', param, 0);
			
			if (json.data.result === 0) {
				let devices = yield select(state => state.device.devices);
				let downloadDevices = yield select(state => state.device.downloadDevices);
				let device = devices.find(item => item.product['product-id'] === param.productId);
				let downloadDevice = downloadDevices.find(item => item.product['product-id'] === param.productId);
				if (device && !downloadDevice) {
					// let downloadDevices2 = [...downloadDevices, device];
					// yield put({ type: 'saveDownloadDevices', payload: downloadDevices2}); 
					device['media-files'] = [];
					ipcRenderer.send('save-device', device);
					cb();
				}
			}
		},

		*searchDevice ({ payload: param }, { call, put, select, take }) {
			const json = yield call(get, `${param.ip}/usapi`, {method: 'ping'}, 1, param.cb);
            let devices = yield select(state => state.device.devices);

			if (json.data.result === 0) {
				devices.push(param.ip);
				console.log(devices, 'devicesdevicesdevices')
                yield put({ type: 'saveDevices', payload: devices});
            }
		},

		*getDevice ({ payload: param }, { call, put, select, take }) {
			let devices = yield select(state => state.device.devices);
			// const json = yield call(get2, '', {method: 'get-info'}, 0);
			// if (json.data.result === 0) {
			// 	let device = {...json.data, ip: param.ip};
			// 	devices = [...devices, device];
			// 	yield put({ type: 'saveDevices', payload: devices});
			// }

			// 模拟数据
			let device = {...deviceInfo, ip: param.ip};
			devices = [...devices, device];
			yield put({ type: 'saveDevices', payload: devices});
			
		},

		*getDeviceVideos ({ payload: param }, { call, put, select, take }) {
			// 假设ip为
			param.ip = '192.168.2.208';
			const json = yield call(post, '/account/signin', {...param});
			console.log(json, 'json');
			let currentDeviceVideos = yield select(state => state.device.currentDeviceVideos);
	
			// currentDeviceVideos = [...currentDeviceVideos, ...deviceData['media-files']];
			console.log(currentDeviceVideos, 'currentDeviceVideos');
			deviceData['media-files'] = deviceData['media-files'].map(m => {
				return {
					...m,
					downpath: `http://${param.ip}/download/${deviceData.path}/m.name`
				}
			})
			ipcRenderer.send('save-device-videos', {videos: deviceData['media-files'], ip: param.ip});
		}
	},
	subscriptions: {
		setup({ dispatch, history } ) {	
			ipcRenderer.on('get-ip-address', (event, myHost) => {
				dispatch({
					type: 'saveMyHost',
					payload: myHost
				});
			});
	
			ipcRenderer.on('render-device', (event, devices) => {
				dispatch({
					type: 'saveDownloadDevices',
					payload: devices
				});
			});

			ipcRenderer.on('render-device-videos', (event, videos) => {
				dispatch({
					type: 'saveCurrentDeviceVideos',
					payload: videos
				});
			});
		}
	},
};
