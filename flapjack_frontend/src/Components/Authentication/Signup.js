import React from 'react'
import FormFactory from '../Forms/Form'
import { Card, Row, Col, Typography, Button, Alert } from 'antd'
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import './Authentication.scss'
import PropTypes from 'prop-types'
import api from '../../api'

const Signup = ({ goToLogin }) => {
  const [errors, setErrors] = React.useState([])

  const fields = [
    {
      name: 'username',
      label: 'Username',
      PrefixComponent: UserOutlined,
      rules: [{ required: true, max: 80, min: 3, whitespace: true }],
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      PrefixComponent: MailOutlined,
      rules: [{ required: true, type: 'email' }],
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      PrefixComponent: LockOutlined,
      rules: [{ required: true, min: 5, whitespace: true }],
    },
    {
      name: 'password_confirmation',
      label: 'Password Confirmation',
      type: 'password',
      PrefixComponent: LockOutlined,
      rules: [
        { required: true },
        ({ getFieldValue }) => ({
          validator(rule, value) {
            if (!value || getFieldValue('password') === value) return Promise.resolve()
            return Promise.reject("Passwords don't match!")
          },
        }),
      ],
    },
  ]

  const showAlerts = (messages) => (
    <div style={{ marginBottom: 12 }}>
      {messages.map((msg, i) => (
        <Alert key={`login-err-${i}`} message={msg} type="error" closable />
      ))}
    </div>
  )

  const onSubmit = async ({ username, email, password, password_confirmation }) => {
    if (password !== password_confirmation) {
      setErrors(["Passwords don't match."])
      return
    }

    const response = await api.register({
      username,
      email,
      password,
      password2: password_confirmation,
    })

    if (response.errors) {
      setErrors([...Object.values(response.errors)])
    }
  }

  return (
    <Row align="middle" className="auth-form-container">
      <Col xs={22} md={16} lg={12}>
        <Card title="Register on Flapjack">
          {errors.length > 0 && showAlerts(errors)}
          <FormFactory
            name="Signup"
            onSubmit={onSubmit}
            fields={fields}
            submitText="Register"
          />
          <Typography.Text>
            {'Already have an account? '}
            <Button type="link" onClick={goToLogin}>
              Log in here!
            </Button>
          </Typography.Text>
        </Card>
      </Col>
    </Row>
  )
}

Signup.propTypes = {
  goToLogin: PropTypes.func.isRequired,
}

export default Signup
