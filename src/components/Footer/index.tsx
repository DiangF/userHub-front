import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';
import {PUBLIC_LINK} from "@/components";

const Footer: React.FC = () => {
  // const defaultMessage = 'DiangF';
  // const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: '用户管理系统',
          title: '用户管理系统',
          href:PUBLIC_LINK,
          blankTarget: true,
        },
        {
          key: 'github',
          title: '知识圈子',
          href: PUBLIC_LINK,
          blankTarget: true,
        },
        {
          key: 'Zhifei ding',
          title: <><GithubOutlined/>Zhifei ding Github</>,
          href: PUBLIC_LINK,
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
