import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { API_ROOT } from '../constants';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;


export class Register extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };

    onFinish = values => {
        console.log('Received values of form: ', values);
        fetch(`${API_ROOT}/signup`, {
            method: 'POST',
            body: JSON.stringify({
                username: values.username,
                password: values.password,
            })
        }).then((response) => {
            if (response.ok) {
                return response;
            }
            throw new Error(response.statusText);
        }).then((response) => response.text())
            .then((response) => {
                console.log(response);
                message.success('Registration Succeed');
                this.props.history.push('/login');
            })
            .catch((e) => {
                console.log(e)
                message.error('Registration Failed');
            });
    };

    // handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log()
    //     this.props.form.validateFieldsAndScroll((err, values) => {
    //         if (!err) {
    //             fetch(`${API_ROOT}/signup`, {
    //                 method: 'POST',
    //                 body: JSON.stringify({
    //                     username: values.username,
    //                     password: values.password,
    //                 })
    //             }).then((response) => {
    //                 if (response.ok) {
    //                     return response;
    //                 }
    //                 throw new Error(response.statusText);
    //             }).then((response) => response.text())
    //                 .then((response) => {
    //                     console.log(response);
    //                     message.success('Registration Succeed');
    //                     this.props.history.push('/login');
    //                 })
    //                 .catch((e) => {
    //                     console.log(e)
    //                     message.error('Registration Failed');
    //                 });
    //         }
    //     });
    // }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        return (
            <Form onFinish={this.onFinish} className="register">
                <FormItem
                    {...formItemLayout}
                    label="Username"
                    name='username'
                    rules={[{ required: true, message: 'Please input your username!', whitespace: false }]}
                >
                    <Input />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Password"
                    name='password'
                    rules={[{
                        required: true, message: 'Please input your password!',
                    }]}
                >
                    <Input type="password" />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Confirm Password"
                    name='confirm'
                    rules={[{
                        required: true, message: 'Please confirm your password!',
                    }, ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                        },
                    })]}
                >
                    <Input type="password" onBlur={this.handleConfirmBlur} />
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">Register</Button>
                    <p>I already have an account, go back to <Link to="/login">login</Link></p>
                </FormItem>
            </Form>
        );
    }
}

// export const Register = Form.create()(RegistrationForm);