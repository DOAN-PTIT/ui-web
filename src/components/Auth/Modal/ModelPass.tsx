"use client";
import apiClient from '@/service/auth';
import { Button, Form, Input, Modal, message } from 'antd';

export default function PassModel({ open, onOk, onCancel }: { open: boolean, onOk: () => void, onCancel: () => void }) {
    const [form] = Form.useForm();

    const handleOk = async (data: any) => {
        try {
            // await form.validateFields(); 
            await apiClient.post('/user/change-password', data)
            message.success('Đã thay đổi mật khẩu thành công!');
            form.resetFields();
            onOk();
        } catch (error) {
            console.error('Xác thực không thành công:', error);
        }
    };
    const onFinish = (value: any) => {
        delete value.password;
        handleOk(value)
    }
    return (
        <div className='change-passwword'>
            <Modal
                title="Thay đổi mật khẩu"
                open={open}
                onCancel={onCancel}
                footer={false}
            >
                <Form form={form} layout="vertical" requiredMark={false} onFinish={onFinish}>
                    <Form.Item
                        name="old_password"
                        label="Mật khẩu hiện tại"
                        rules={[
                            {
                                required: true,
                                message: 'Xin hãy nhập mật khẩu hiện tại!',
                            },
                        ]}

                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Mật khẩu mới"
                        rules={[
                            {
                                required: true,
                                message: 'Xin hãy nhập mật khẩu!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="new_password"
                        label="Xác nhận mật khẩu mới"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Xin hãy xác nhận mật khẩu mới:!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The new password that you entered do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item className='flex justify-end'>
                        <Button
                            onClick={() => {
                                form.resetFields();
                                onCancel();
                            }}
                            type='link'>
                            Hủy
                        </Button>
                        <Button htmlType="submit" type='primary'>Đổi</Button>
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    );
}
