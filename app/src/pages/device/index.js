import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import DownloadHeader from '@components/DownloadHeader';
import {routerRedux} from 'dva/router';
import DownlistLi from './components/DownlistLi';
import './index.scss';
const { ipcRenderer } = window.require('electron');

const header = ['设备名称', '本地目录', '状态', '操作'];

function mapStateToProps(state) {
    return {
        ...state.user,
        ...state.device
    };
}

function DownlistEmpty (props) {
    return (
        <div className="downlist-empty">
            <img src={require('../../assets/empty.png')} alt=""/>
            <span>当前无下载任务</span>
        </div>
    );
}

@withRouter
@connect(mapStateToProps)
class DeviceContainer extends PureComponent {
    componentDidMount() {
        ipcRenderer.send('get-devices');
        ipcRenderer.on('render-device-list', (event, devices) => {
            this.props.dispatch({
                type: 'device/saveDownloadDevices',
                payload: devices || []
            });

            if (devices.length > 0 && this.props.devices.length === 0) {
                devices.forEach(item => {
                    this.props.dispatch({
                        type: 'device/autoLoginDivice',
                        payload: item
                    });
                });
            }
        });
    }

    changePause = (tid) => {
        ipcRenderer.send('change-device-pause-status', tid);
    }

    toDeviceAdd = () => {
        this.props.dispatch(routerRedux.push({pathname: '/deviceadd'}));
    }

    render() {
        const {downloadDevices} = this.props;
        return (
            <Fragment>
                <button className="btn1" onClick={this.toDeviceAdd}>添加设备</button>
                <div className="download-list">
                    {downloadDevices && downloadDevices.length > 0 ? 
                    <>
                    <DownloadHeader header={header} colSpan={[6, 10, 4, 4]}></DownloadHeader>
                    <div className="table-list">
                        <DownlistLi {...this.props} changePause={this.changePause}></DownlistLi>
                    </div>
                    </> :
                    <DownlistEmpty></DownlistEmpty>}
                </div>
            </Fragment>
        );
    }
}

export default DeviceContainer;