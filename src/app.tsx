import { AvatarDropdown, AvatarName, Footer, Question } from '@/components';
import { currentUser as queryCurrentUser} from '@/services/ant-design-pro/api';
import { LinkOutlined } from '@ant-design/icons';
import { Settings as LayoutSettings} from '@ant-design/pro-components';
import {SettingDrawer} from '@ant-design/pro-layout';
// import { SettingDrawer } from '@ant-design/pro-components';
import {RequestConfig, RunTimeLayoutConfig} from '@umijs/max';
import { history, Link } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
// import {PageLoading} from "@ant-design/pro-layout";
// import { errorConfig } from './requestErrorConfig';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const NO_NEED_LOGIN_WHITE_LIST = ['user/register',loginPath];

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */


/** 获取用户信息比较慢的时候会展示一个 loading */
// export const initialStateConfig = {
//   loading: <PageLoading />,
// };

export const request: RequestConfig = {
  // prefix: 'http://localhost:8080',
  timeout: 1000000,
};

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      return  await queryCurrentUser();
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

//果果是无需登录页面 不执行
  if(NO_NEED_LOGIN_WHITE_LIST.includes(history.location.pathname)) {
    return {
      fetchUserInfo,
      settings: defaultSettings as Partial<LayoutSettings>,
    };

  }
  const currentUser = await fetchUserInfo();
  // 如果不是登录页面，执行

  return {
    fetchUserInfo,
    currentUser,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    actionsRender: () => [<Question key="doc" />],
    avatarProps: {
      src: initialState?.currentUser?.avatarUrl,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.username,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;

      if(NO_NEED_LOGIN_WHITE_LIST.includes((location.pathname))){
        return;
      }
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser ) {
        history.push(loginPath);
      }
    },

    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
// export const request = {
//   ...errorConfig,
// };






