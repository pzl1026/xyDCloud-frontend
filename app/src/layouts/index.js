import React, {PureComponent, Fragment} from 'react';
// import styles from './index.css';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import Link from 'umi/link';
import IconBlock from '@components/IconBlock';
import './index.scss';

function mapStateToProps(state) {
    return {
        ...state.user
    };
}

const sideMenu = [
    {
        url: '/cloud',
        name: '云端下载',
        icon: 'side_cloud.svg',
        iconActive: 'side_cloud_active.svg'
    }, {
        url: '/cloudrecord',
        name: '下载记录',
        icon: 'side_cloud_record.svg',
        iconActive: 'sice_cloud_record_active.svg'
    }, {
        url: '/device',
        name: '设备导入',
        icon: 'side_device.svg',
        iconActive: 'side_device_active.svg'
    }, {
        url: '/cloud',
        name: '导入记录',
        icon: 'side_device_record.svg',
        iconActive: 'side_device_record_active.svg'
    }
];

function SideMenuBody(props) {
    const {location} = props;
    return sideMenu.map((item, index) => {
        return (
            <li key={index}
                className={location.pathname === item.url
                ? 'active'
                : ''}>
                <Link to={item.url}>
                    <div className="link-span">
                        <IconBlock
                            iconName={location.pathname === item.url
                            ? item.iconActive
                            : item.icon}></IconBlock>
                        <span>{item.name}</span>
                    </div>
                </Link>
            </li>
        )
    });
}

@withRouter
@connect(mapStateToProps)
class BasicLayout extends PureComponent {

    componentDidMount() {
        console.log(this.props, 'llllll')
    }

    render() {
        const {history} = this.props;

        if (history.location.pathname === '/') {
            return <Fragment>{this.props.children}</Fragment>;
        }

        return (
            <Fragment>
                {history.location.pathname !== '/login'
                    ? <div className="page">
                            <div className="side">
                                <div className="side-title">
                                    XINYUE 新阅
                                </div>
                                <ul className="side-menu">
                                    <SideMenuBody {...this.props}></SideMenuBody>
                                </ul>
                                <div className="side-footer">
                                    <div className="person-avatar">
                                        <img src="" alt=""/>
                                    </div>

                                    <div className="person-name">
                                        999999
                                    </div>
                                </div>
                            </div>
                            <div className="section">
                                {this.props.children}
                            </div>
                        </div>
                    : <> {
                        this.props.children
                    } < />}
            </Fragment>
        );
    }
}

export default BasicLayout;
