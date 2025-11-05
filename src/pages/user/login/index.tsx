import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import {
  FormattedMessage,
  Helmet,
  SelectLang,
  useIntl,
  useModel,
  history
} from '@umijs/max';
import { Alert, App } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { Footer } from '@/components';
import { login } from '@/services/ant-design-pro/api';
import Settings from '../../../../config/defaultSettings';
import logoUrl from '@r/images/logo.svg';
import bg from '@r/images/background.jpg';


// import fjson from '@assets/f.json'
// import fjson from '@/assets/f.json'
// import fjson from '../../../assets/f.json';

// console.log(logoUrl)

const useStyles = createStyles(({ token }) => {
  return {
    container: {
      display: 'grid',
      gridTemplateColumns: '600px 1fr',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#141414',
    },
    leftPanel: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      position: 'relative',
    },
    rightPanel: {
      position: 'relative',
      overflow: 'hidden',
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    },
    videoBg: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      minWidth: '100%',
      minHeight: '100%',
      width: 'auto',
      height: 'auto',
      transform: 'translate(-50%, -50%)',
      objectFit: 'cover',
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'absolute',
      top: 16,
      right: 16,
      borderRadius: token.borderRadius,
      color: token.colorWhite,
      ':hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
    },
    loginForm: {
      width: '100%',
      maxWidth: 400,
    },
    logo: {
      marginBottom: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: token.colorPrimary,
      fontSize: 24,
      fontWeight: 'bold',
    },
  };
});

const Lang = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.lang} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'rgba(255, 255, 255, 0.85)',
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const { message } = App.useApp();
  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const msg = await login({ ...values, type: 'account' });
      if (msg.status === 'ok') {
        // const defaultLoginSuccessMessage = intl.formatMessage({
        //   id: 'pages.login.success',
        //   defaultMessage: '登录成功！',
        // });
        // message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        // const urlParams = new URL(window.location.href).searchParams;
        // window.location.href = urlParams.get('redirect') || '/';
        // return;
        history.push('/dashboard/calendar')
      }
      console.log(msg);
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  const { status } = userLoginState;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
          - {Settings.title}
        </title>
        <meta itemprop="name" content="ant.design最佳尝试" />
        <meta itemprop="description" content="该栏描述了一个离职在家需要写一个个人作品的前端工程师的心路历程" />
        <meta itemprop="image" content="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" />
        <meta name="wechat:web:share" content="true" />
        <meta name="wechat:web:share:title" content="ant.design最佳尝试" />
        <meta name="wechat:web:share:desc" content="该栏描述了一个离职在家需要写一个个人作品的前端工程师的心路历程" />
        <meta name="wechat:web:share:img" content="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" />
        <meta property="og:title" content="ant.design最佳尝试" />
        <meta property="og:description" content="该栏描述了一个离职在家需要写一个个人作品的前端工程师的心路历程" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" />
        <meta name="applicable-device" content="pc,mobile"/>
      <link rel="apple-touch-icon-precomposed" href="https://cdn2.jianshu.io/assets/apple-touch-icons/57-a6f1f1ee62ace44f6dc2f6a08575abd3c3b163288881c78dd8d75247682a4b27.png" sizes="57x57"/>
      <link rel="apple-touch-icon-precomposed" href="https://cdn2.jianshu.io/assets/apple-touch-icons/72-fb9834bcfce738fd7b9c5e31363e79443e09a81a8e931170b58bc815387c1562.png" sizes="72x72"/>
      <link rel="apple-touch-icon-precomposed" href="https://cdn2.jianshu.io/assets/apple-touch-icons/76-49d88e539ff2489475d603994988d871219141ecaa0b1a7a9a1914f4fe3182d6.png" sizes="76x76"/>
      <link rel="apple-touch-icon-precomposed" href="https://cdn2.jianshu.io/assets/apple-touch-icons/114-24252fe693524ed3a9d0905e49bff3cbd0228f25a320aa09053c2ebb4955de97.png" sizes="114x114"/>
      <link rel="apple-touch-icon-precomposed" href="https://cdn2.jianshu.io/assets/apple-touch-icons/120-1bb7371f5e87f93ce780a5f1a05ff1b176828ee0d1d130e768575918a2e05834.png" sizes="120x120"/>
      <link rel="apple-touch-icon-precomposed" href="https://cdn2.jianshu.io/assets/apple-touch-icons/152-bf209460fc1c17bfd3e2b84c8e758bc11ca3e570fd411c3bbd84149b97453b99.png" sizes="152x152"/>
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:site_name" content="resuscitateHope" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ant.design最佳尝试" />
        <meta name="twitter:description" content="该栏描述了一个离职在家需要写一个个人作品的前端工程师的心路历程" />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" />
        <meta name="description" content="该栏描述了一个离职在家需要写一个个人作品的前端工程师的心路历程" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <Lang />
      {/* 左侧登录面板 */}
      <div className={styles.leftPanel}>
        <div className={styles.loginForm}>
          <div className={styles.logo}>
            {false&&<img 
              alt="logo" 
              src={logoUrl} 
              style={{ 
                width: 40, 
                height: 40, 
                marginRight: 12,
                filter: 'brightness(0) invert(1)'
              }} 
            />}
            Ant Design
          </div>

          <LoginForm
            contentStyle={{
              minWidth: 280,
              maxWidth: '100%',
            }}
            title="登录"
            initialValues={{
                username:"admin",
                password:"ant.design",
              autoLogin: true,
            }}
            onFinish={async (values) => {
              await handleSubmit(values as API.LoginParams);
            }}
            submitter={{
              searchConfig: {
                submitText: intl.formatMessage({
                  id: 'pages.login.submit',
                  defaultMessage: '登录',
                }),
              },
            }}
          >
            {status === 'error' && (
              <LoginMessage
                content={intl.formatMessage({
                  id: 'pages.login.accountLogin.errorMessage',
                  defaultMessage: '账户或密码错误(admin/ant.design)',
                })}
              />
            )}
            
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />,
                style: {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.85)',
                },
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.username.placeholder',
                defaultMessage: '用户名: admin or user',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.username.required"
                      defaultMessage="请输入用户名!"
                    />
                  ),
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />,
                style: {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.85)',
                },
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.password.placeholder',
                defaultMessage: '密码: ant.design',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.password.required"
                      defaultMessage="请输入密码！"
                    />
                  ),
                },
              ]}
            />

            <div
              style={{
                marginBottom: 24,
              }}
            >
              <ProFormCheckbox 
                noStyle 
                name="autoLogin"
                fieldProps={{
                  style: {
                    color: 'rgba(255, 255, 255, 0.65)',
                  }
                }}
              >
                <FormattedMessage
                  id="pages.login.rememberMe"
                  defaultMessage="自动登录"
                />
              </ProFormCheckbox>
            </div>
          </LoginForm>
        </div>
      </div>

      {/* 右侧视频背景面板 */}
      <div className={styles.rightPanel}>
        {false &&<video autoPlay loop muted playsInline className={styles.videoBg}>
          <source src={videoUrl} type="video/mp4" />
          您的浏览器不支持视频标签。
        </video>}
      </div>
    </div>
  );
};

export default Login;