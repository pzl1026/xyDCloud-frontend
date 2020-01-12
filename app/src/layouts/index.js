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
        urlTest: ['/cloud', '/cloudCreate'],
        name: '云端下载',
        icon: 'side_cloud.svg',
        iconActive: 'side_cloud_active.svg'
    }, {
        url: '/cloudrecord',
        urlTest: ['/cloudrecord'],
        name: '下载记录',
        icon: 'side_cloud_record.svg',
        iconActive: 'sice_cloud_record_active.svg'
    }, {
        url: '/device',
        urlTest: ['/device', '/deviceAdd'],
        name: '设备导入',
        icon: 'side_device.svg',
        iconActive: 'side_device_active.svg'
    }, {
        url: '/deviceRecord',
        urlTest: ['/deviceRecord'],
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
                            iconName={item.urlTest.includes(location.pathname)
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
        const {history, userInfo} = this.props;
        console.log(userInfo, 'userInfos')
        
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
                                <Link to='usersetting'>
                                    <div className="side-footer">
                                        <div className="person-avatar">
                                            <img src={userInfo.avatar} alt=""/>
                                        </div>
                                        <div className="person-name">
                                            {userInfo.realname}
                                        </div>
                                    </div>
                                </Link>
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
