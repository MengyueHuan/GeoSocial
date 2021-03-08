import React from 'react';
import { Form, Input, Button, message } from 'antd';
import Icon from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { API_ROOT, TOKEN_KEY } from '../constants';

const FormItem = Form.Item;


export class Login extends React.Component {

    onFinish = values => {
        console.log('Received values of form: ', values);
        fetch(`${API_ROOT}/login`, {
            method: 'POST',
            body: JSON.stringify({
                username: values.username,
                password: values.password,
            }),
        }).then((response) => {
            if (response.ok) {
                return response.text();
            }
            throw new Error(response.statusText);
        })
            .then((data) => {
                this.props.handleLogin(data);
                message.success('Login Success.');
            })
            .catch((e) => {
                console.log(e);
                message.error('Login Failed.');
            });
    }

    render() {
        return (
            <Form onFinish={this.onFinish} className="login-form">
                <FormItem name='username' rules={[{ required: true, message: 'Please input your username!' }]}>
                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                </FormItem>
                <FormItem name='password' rules={[{ required: true, message: 'Please input your Password!' }]}>
                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    Or <Link to="/register">register now!</Link>
                </FormItem>
            </Form>
        );
    }
}
