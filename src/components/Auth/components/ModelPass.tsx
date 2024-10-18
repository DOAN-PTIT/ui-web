"use client";
import { Form, Input, Modal, message } from 'antd';

export default function PassModel({ open, onOk, onCancel }) {
    const [form] = Form.useForm(); // Create a form instance

    const handleOk = async () => {
        try {
            await form.validateFields(); // Validate the form fields
            message.success('Đã thay đổi mật khẩu thành công!');
            form.resetFields(); // Reset the form after successful submission
            onOk(); // Call the onOk handler
        } catch (error) {
            console.error('Xác thực không thành công:', error);
        }
    };

    return (
        <Modal
            className='p-0'
            title="Thay đổi mật khẩu"
            open={open}
            onOk={handleOk}
            onCancel={() => {
                form.resetFields(); // Reset fields on cancel
                onCancel();
            }}
            okText="Thêm"
            cancelText="Hủy"
        >
            <Form form={form} layout="vertical" requiredMark={false}>
                <Form.Item
                    name="password_now"
                    label="Mật khẩu hiện tại"
                    rules={[
                        {
                            required: true,
                            message: 'Xin hãy nhập mật khẩu hiện tại!',
                        },
                    ]}
                    hasFeedback
                    labelCol={{ required: false }} // Removes individual asterisks
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
                    hasFeedback
                    labelCol={{ required: false }} // Removes individual asterisks
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
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
                    labelCol={{ required: false }} // Removes individual asterisks
                >
                    <Input.Password />
                </Form.Item>
            </Form>
        </Modal>
    );
}
