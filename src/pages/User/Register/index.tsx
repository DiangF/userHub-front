import {Footer, PUBLIC_LINK, SYSTEM_LOGO} from '@/components';
// import { login } from '@/services/ant-design-pro/api';
import {LockOutlined, UserOutlined,} from '@ant-design/icons';
import {LoginForm, ProFormText,} from '@ant-design/pro-components';
import {Helmet, history} from '@umijs/max';
import {message, Tabs} from 'antd';
import {createStyles} from 'antd-style';
import React, {useState} from 'react';
import Settings from '../../../../config/defaultSettings';
import {register} from "@/services/ant-design-pro/api";


const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});



const Register: React.FC = () => {

  const [type, setType] = useState<string>('account');
  const { styles } = useStyles();

  const handleSubmit = async (values: API.RegisterParams) => {
    const{userPassword, checkPassword} = values;
    if(userPassword !== checkPassword){
      message.error("两次输入密码不一致！");
      return ;
    }


    try {
      // 注册
      const id = await register(values);

      if (id>0) {
        const defaultLoginSuccessMessage = '注册成功，欢迎注册！';
        message.success(defaultLoginSuccessMessage);
        if(!history) return;
        // const urlParams = new URL(window.location.href).searchParams;
        // history.push(urlParams.get('redirect') || '/');

        /*此方法会跳转到 redirect 参数所在的位置*/
        // @ts-ignore
        const {query} = history.location;
        history.push({
          pathname: '/user/login',
          // @ts-ignore
          query,
        });

        // history.push('/user/login?redirect'+urlParams.get('redirect'));
        return;
      }else{
        throw new Error("Register error id =  $(id)");
      }
      console.log(id);
      // 如果失败去设置用户错误信息
      // setUserLoginState(user);
    } catch (error) {
      const defaultLoginFailureMessage = '注册失败，请重试！';
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'注册'}- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          submitter ={{
            searchConfig:{
              submitText: '注册',
            }
        }}
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}


          logo={<img alt="logo" src={SYSTEM_LOGO} />}
          title="用户管理系统"
          subTitle={<a href = {PUBLIC_LINK}> 最实用的用户管理系统</a>}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {


            await handleSubmit(values as API.RegisterParams);




          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '欢迎注册',
              }
            ]}
          />
          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={'请输入账户'}
                rules={[
                  {
                    required: true,
                    message: '账户是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min : 8,
                    type:'string',
                    message: '长度不能小于8位',
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请再次输入密码'}
                rules={[
                  {
                    required: true,
                    message: '确认密码是必填项！',
                  },
                  {
                    min : 8,
                    type:'string',
                    message: '长度不能小于8位',
                  },
                ]}
              />
            </>
          )}

        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Register;
