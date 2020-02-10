import {get, get2} from '@helper/utils';
import {message} from 'antd';
import {deviceInfo} from '@helper/data';
import md5 from 'js-md5';
const { ipcRenderer } = window.require('electron');

export default {
	namespace: 'device',
	state: {
        myHost: '',
        devices: [],
		currentLoginDevice: '192.168.2.208',
		downloadDevices: [],
		currentDeviceVideos: [],
		currentVideosPlay: [],
		deviceStatus: 1,  //检查设备是否需要重新登录链接
	},
	reducers: {
        saveMyHost (state, { payload: myHost}) {
            return {...state, myHost}
        },

        saveDevices (state, { payload: devices}) {
            return {...state, devices}
        },

        saveCurrentLoginDevice(state, { payload: currentLoginDevice}) {
            return {...state, currentLoginDevice}
		},
		
		saveDownloadDevices(state, { payload: downloadDevices}) {
            return {...state, downloadDevices}
		},

		saveCurrentDeviceVideos(state, { payload: currentDeviceVideos}) {
            return {...state, currentDeviceVideos}
		},

		saveCurrentVideosPlay(state, { payload: currentVideosPlay}) {
            return {...state, currentVideosPlay}
		},

		saveDeviceStatus(state, { payload: deviceStatus}) {
            return {...state, deviceStatus}
		},
	},
	effects: {
		*loginDevice ({ payload: {param, cb, productId, ip} }, { call, put, select, take }) {
			const json = yield call(get2, '', param, `http://${ip}/`);
			if (json.data.result === 0) {
				let devices = yield select(state => state.device.devices);
				let downloadDevices = yield select(state => state.device.downloadDevices);
				let device = devices.find(item => item.product['product-id'] === productId);
				let downloadDevice = downloadDevices.find(item => item.product['product-id'] === productId);
				yield put({ type: 'saveDeviceStatus', payload: 1});
				if (device && !downloadDevice) {
					// let downloadDevices2 = [...downloadDevices, device];
					// yield put({ type: 'saveDownloadDevices', payload: downloadDevices2}); 
					device['media-files'] = [];
					device['ip'] = ip;
					ipcRenderer.send('save-device', device);
				}
				cb();
			} else {
				message.warning('登录失败，请检查设备是否正常或用户密码错误');
			}
		},

		*searchDevice ({ payload: param }, { call, put, select, take }) {
			const json = yield call(get, `${param.ip}/usapi`, {method: 'ping'}, 1, param.cb);
            let devices = yield select(state => state.device.devices);

			if (json.data.result === 0) {
				devices.push(param.ip);
                yield put({ type: 'saveDevices', payload: devices});
            } else {
				message.warning('登录失败，请检查设备是否正常');
			}
		},

		*checkDeviceStatus ({ payload:  {deviceVideo}  }, { call, put, select, take }) {
			const json = yield call(get2, '', {method: 'get-status'}, `http://${deviceVideo.ip}/`);

			ipcRenderer.send('change-device-status', {statusData: json.data, deviceVideo});
		},

		*getDevice ({ payload: param }, { call, put, select, take }) {
			let devices = yield select(state => state.device.devices);
			const json1 = yield call(get2, '', {method: 'login', id: 'Admin', pass: md5('Admin')}, `http://${param.ip}/`);
			if (json1.data.result === 0) {
				const json = yield call(get2, '', {method: 'get-info'}, `http://${param.ip}/`);
		
				if (json.data.result === 0) {
					const json2 = yield call(get2, '', {method: 'get-settings'}, `http://${param.ip}/`);
					
					let device = {...json.data, ...json2.data, ip: param.ip};
					if (!devices.find(m => m.ip === param.ip)) {
						devices = [...devices, device];
					}
					yield put({ type: 'saveDevices', payload: devices});
					yield put({ type: 'saveDeviceStatus', payload: 1});
				} else {
					yield put({ type: 'saveDeviceStatus', payload: 0});
					message.warning('请断开设备，重新搜索');
				}
			}
			// 模拟数据
			// let device = {...deviceInfo, ip: param.ip};
			// devices = [...devices, device];
			// yield put({ type: 'saveDevices', payload: devices});
			
		},

		*getDeviceVideos ({ payload: {param, cb, ip}}, { call, put, select, take }) {
			// 假设ip为
			// param.ip = '192.168.2.208';
			const json = yield call(get2, '', {...param, method: 'get-media-files'}, `http://${ip}/`);
			
			if (json.data.result === 0) {
				// let currentDeviceVideos = yield select(state => state.device.currentDeviceVideos);
	
				// currentDeviceVideos = [...currentDeviceVideos, ...deviceData['media-files']];
				
				// console.log(currentDeviceVideos, 'currentDeviceVideos');
				json.data['media-files'] = json.data['media-files'].map(m => {
					// let ipd = ip.substr(0, ip.length - 1);
					return {
						...m,
						downpath: `http://${ip}:8080/download${json.data.path}/${m.name}`,
						playpath: `http://${ip}:8080/${json.data.path}/${m.name}`,
					}
				})
				cb(json.data['media-files'].length < 1000 ? false : true);
				ipcRenderer.send('save-device-videos', {videos: json.data['media-files'], ip});
			} else {
				ipcRenderer.send('save-device-videos', {videos: [], ip});
				yield put({ type: 'saveDeviceStatus', payload: 0});
				message.warning('请断开设备，重新搜索');
			}

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

			ipcRenderer.on('check-device-status', (event, deviceVideo) => {
				dispatch({
					type: 'checkDeviceStatus',
					payload: {
						deviceVideo
					}
				});
			});
		}
	},
};
