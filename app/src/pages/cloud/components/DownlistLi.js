import React, {Fragment} from 'react';
import {Row, Col, Dropdown, Menu} from 'antd';
import IconBlock from '@components/IconBlock';

const menu = (
    <Menu>
        <Menu.Item key="0">
            <div className="dl-li-action-menu">
                <img src="" alt=""/>
                <span>打开本地目录</span>
            </div>
        </Menu.Item>
        <Menu.Item key="1">
            <div className="dl-li-action-menu">
                <img src="" alt=""/>
                <span>打开云端网页</span>
            </div>
        </Menu.Item>
        <Menu.Item key="2">
            <div className="dl-li-action-menu">
                <img src="" alt=""/>
                <span>编辑下载任务</span>
            </div>
        </Menu.Item>
        <Menu.Item key="3">
            <div className="dl-li-action-menu">
                <img src="" alt=""/>
                <span>删除下载任务</span>
            </div>
        </Menu.Item>
    </Menu>
);

function DownlistLi(props) {
    return (
        <Fragment>
            {props
                .projects
                .map(item => {
                    return (
                        <Row className="dl-li" key={item.id}>
                            <Col span={6}>
                                <span>{item.name}</span>
                            </Col>
                            <Col span={6}>
                                <span>{item.localPath || '未设置'}</span>
                            </Col>
                            <Col span={6}>
                                <span>{item.isPause ? '暂停中':'下载中'}</span>
                            </Col>
                            <Col span={6}>
                                <div className="dl-action">
                                    {/* <img src="" alt=""/> */}
                                    {/* <IconBlock iconName="fm-share.svg" direction="left"></IconBlock> */}
                                    <span className="cloud-li-play" onClick={() => props.changePause(item.id)}>
                                        {item.isPause ? 
                                        <IconBlock iconName="play.svg"></IconBlock> : 
                                        <IconBlock iconName="pause.svg"></IconBlock>}
                                    </span>
                                    <Dropdown overlay={menu} trigger={['click']} placement="bottomCenter">
                                        <div className="dl-action-btn">
                                            <span>
                                                <IconBlock iconName="more.svg"></IconBlock>
                                            </span>
                                        </div>
                                    </Dropdown>
                                </div>
                            </Col>
                        </Row>
                    )
                })
}
        </Fragment>
    );
}


export default DownlistLi;