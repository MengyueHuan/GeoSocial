import React from 'react';
// import { Icon } from 'antd';
import Icon from '@ant-design/icons';
import logo from '../assets/images/logo.svg';

export class TopBar extends React.Component {
    render() {
        return (
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <div className="App-title">GeoNetwork</div>
                {
                    this.props.isLoggedIn ? <a className="logout" onClick={this.props.handleLogout}>
                        <Icon type="logout" />{' '}Logout
                    </a> : null
                }
            </header>
        );
    }
}
