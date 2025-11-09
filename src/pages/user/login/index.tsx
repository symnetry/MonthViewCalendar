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
// import { Footer } from '@/components';
import StarFieldCanvas from '@/components/StarFieldCanvas';
import { login } from '@/services/ant-design-pro/api';
import Settings from '../../../../config/defaultSettings';
import backgroundImage from '@r/images/background.jpg';
import './login.less';
// console.log(logoUrl)

const useStyles = createStyles(({ token }) => {
  return {
    container: {
      display: 'grid',
      gridTemplateColumns: '500px 1fr',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#000000',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    },
    leftPanel: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      backgroundColor: 'rgba(15, 15, 15, 0.9)',
        position: 'relative',
        zIndex: 1,
        boxShadow: '2px 0 20px rgba(255, 0, 0, 0.3)',
    },
    rightPanel: {
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'transparent',
        zIndex: 1,
        // 右侧面板放置canvas
        height: '100%',
      },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'absolute',
      top: 16,
      right: 16,
      borderRadius: token.borderRadius,
      color: '#ffffff',
      ':hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
      },
    },
    loginForm: {
      width: '100%',
      maxWidth: 360,
    },
    logoContainer: {
      marginBottom: 40,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      color: '#ffffff',
      fontSize: 36,
      fontWeight: 'normal',
      fontFamily: '"YuMincho", serif',
      position: 'relative',
    },
    logoSubtitle: {
      color: '#ff0000',
      fontSize: 14,
      marginTop: 10,
      fontFamily: '"YuMincho", serif',
      opacity: 0.8,
    },
    // EVA风格面板
    controlPanel: {
      position: 'relative',
      width: '100%',
      padding: '40px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      overflow: 'hidden',
    },
    panelHeader: {
      marginBottom: 30,
      textAlign: 'center',
    },
    panelTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'normal',
        fontFamily: '"YuMincho", serif',
      },
    // EVA风格分割线
    divider: {
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      margin: '30px 0',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '20%',
        height: 3,
        backgroundColor: '#ff0000',
      },
    },
    // EVA风格按钮
    button: {
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: '1px solid #ffffff',
        color: '#ffffff',
        fontSize: 14,
        fontFamily: '"YuMincho", serif',
      transition: 'all 0.3s ease',
      ':hover': {
        backgroundColor: 'rgba(255, 0, 0, 0.8)',
        borderColor: '#ff0000',
        boxShadow: '0 0 15px rgba(255, 0, 0, 0.5)',
      },
      ':active': {
        boxShadow: '0 0 5px rgba(255, 0, 0, 0.5) inset',
      },
    },
    // EVA风格输入框
    input: {
        backgroundColor: 'rgba(0, 0, 0, 0.7) !important',
        border: '1px solid rgba(255, 255, 255, 0.2) !important',
        color: '#ffffff !important',
        borderRadius: 0,
        fontFamily: '"YuMincho", serif',
        fontSize: 14,
      transition: 'all 0.3s ease',
      ':focus': {
        borderColor: '#ff0000 !important',
        boxShadow: '0 0 10px rgba(255, 0, 0, 0.3) !important',
      },
    },
    // EVA风格标签
    label: {
        color: '#ffffff !important',
        fontSize: 12,
        fontFamily: '"YuMincho", serif',
        opacity: 0.8,
      },
    // EVA风格输入框前缀
    inputPrefix: {
      color: 'rgba(255, 255, 255, 0.5) !important',
    },
    // 错误提示样式
    alertMessage: {
        backgroundColor: 'rgba(0, 0, 0, 0.8) !important',
        border: '1px solid rgba(255, 0, 0, 0.3) !important',
        color: '#ff0000 !important',
        borderRadius: 0,
        fontFamily: '"YuMincho", serif',
      },
    // 装饰性网格线
    gridOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                       linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      pointerEvents: 'none',
      zIndex: 0,
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
      className={useStyles().alertMessage}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [loading, setLoading] = useState(false);
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
      // const msg = await login({ ...values, type: 'account' });
      // console.log(msg)
      // return false
      
        let msg = {"status": "ok","type": "account","currentAuthority": "admin"}
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
    <div className={`${styles.container} login-page`}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '用戶認證',
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
        <div className={styles.controlPanel}>
              <div className={styles.gridOverlay} />
              
              <div className={styles.panelHeader}>
                <div className={styles.logoContainer}>
                  <div className={`${styles.logo} login-logo`}>第三次冲击</div>
                <div className={`${styles.logoSubtitle} login-logo-subtitle`}>系統訪問</div>
                </div>
                <div className={`${styles.panelTitle} login-panel-title`}>
                  {loading ? '系統啟動中' : '用戶認證'}
                </div>
              </div>
              
              <div className={styles.divider} />
            
            <LoginForm
              contentStyle={{
                minWidth: 280,
                maxWidth: '100%',
              }}
              initialValues={{
                username: "admin",
                password: "ant.design",
              }}
              onFinish={async (values) => {
                setLoading(true);
                await handleSubmit(values as API.LoginParams);
                setLoading(false);
              }}
              submitter={{
                render: (props) => (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                    <button
                      className={`login-button`}
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        props.submit?.();
                      }}
                      disabled={loading}
                      style={{
                        padding: '12px 50px',
                        fontSize: '14px',
                        minWidth: '200px',
                      }}
                    >
                      {loading ? '訪問中' : '登錄'}
                    </button>
                  </div>
                ),
              }}
            >
              {status === 'error' && (
                <LoginMessage
                  content="登入失敗請重試 (admin/ant.design)"
                />
              )}
              
              <ProFormText
                name="username"
                label="用戶名"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                  className: 'login-input',
                  prefixCls: styles.inputPrefix,
                  placeholder: '請輸入用戶名',
                }}
                rules={[
                  {
                    required: true,
                    message: '請輸入用戶名',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                label="密碼"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                  className: 'login-input',
                  prefixCls: styles.inputPrefix,
                  placeholder: '請輸入密碼',
                }}
                rules={[
                  {
                    required: true,
                    message: '請輸入密碼',
                  },
                ]}
              />
            </LoginForm>
          </div>
      </div>

      {/* 右侧面板 - 星空效果仅显示在右侧 */}
      <div className={styles.rightPanel}>
        <StarFieldCanvas />
      </div>
    </div>
  );
};

export default Login;