"use client";
import { Button, Menu, Select, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import {
  AppstoreOutlined,
  DashboardOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LogoutOutlined,
  MonitorOutlined,
  ProjectOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { axiosInstance } from "../utils/axiosInstance";
import baseUrl from "../utils/api";
import { useQuery } from "@tanstack/react-query";
import getCurrentUser from "../utils/currentUser";
import { useRouter } from "next/navigation";

interface TOptions {
  label: string;
  value: string;
}
interface ChatOptions {
  chatType: "private" | "public";
  toMembers: string[];
}

const AppSidebar = () => {
  const router = useRouter();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState<boolean>();
  // const TabsList = [
  //   {
  //     key: "/overview",
  //     icon: <AppstoreOutlined style={{ fontSize: "18px" }} />,
  //     label: "Overview",
  //   },
  //   {
  //     key: "/responselogs",
  //     icon: <DashboardOutlined style={{ fontSize: "18px" }} />,
  //     label: "Response Logs",
  //   },
  //   {
  //     key: "/projects",
  //     icon: <ProjectOutlined style={{ fontSize: "18px" }} />,
  //     label: "Projects",
  //   },
  // ];
  const handleLogout = async () => {
    throw new Error("Function not implemented.");
  };

  const fetcher = async () => {
    console.log("I am inside fetcher function");
    const res = await axiosInstance.get(`/user`);
    return res.data.data;
  };

  const { data, isLoading } = useQuery({
    queryFn: fetcher,
    queryKey: ["users"],
  });
  console.log(data, "datadata");

  const usersList = (data: any) => {
    let options: TOptions[] = [];
    data.map((user: any) => {
      options.push({ label: user.name, value: user._id });
    });
    return options;
  };
  const handleCreateAndNavigateToChatPage = async (
    id: string,
    chatType: string
  ) => {
    if (chatType == "private") {
      router.push(`/chat/${id}`);
    }
  };

  if (isLoading) return <>Loading ...</>;

  return (
    <Sider
      collapsed={collapsed}
      style={{ background: colorBgContainer }}
      width={250}
      className="!border-r"
    >
      <div className="p-4 border-b border-0 flex items-center justify-between relative ">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <MonitorOutlined className="text-blue-600 text-xl" />
            <span className="font-semibold text-xl">Chat.IO</span>
          </div>
        )}
        {collapsed && (
          <MonitorOutlined className="text-blue-600 text-xl mx-auto" />
        )}
        <Button
          className="w-8 absolute left-7.75"
          type="text"
          onClick={() => {
            setCollapsed(!collapsed);
          }}
          icon={
            collapsed ? (
              <DoubleRightOutlined className="bg-white" />
            ) : (
              <DoubleLeftOutlined className="bg-white" />
            )
          }
          style={{
            fontSize: "16px",
            width: 32,
            height: 32,
            backgroundColor: "transparent",
          }}
        />
      </div>
      <div>
        <Select
          showSearch
          options={usersList(data)}
          placeholder="Select a person"
          onChange={(value: string) => {
            console.log("IAMGOING");
            handleCreateAndNavigateToChatPage(value, "private");
          }}
        />
      </div>
      {/* <div className="h-full flex-col justify-around space-x-8">
        <Menu
          theme="light"
          mode="inline"
          // selectedKeys={selectedKeys}
          items={TabsList}
          // onClick={handleMenuClick}
          className="!px-2 !pt-1 !text-base custom-sidebar-menu !border-0"
        />
        <Menu
          theme="light"
          mode="inline"
          // selectedKeys={selectedKeys}
          items={TabsList}
          // onClick={handleMenuClick}
          className="!px-2 !pt-1 !text-base custom-sidebar-menu !border-0"
        />
      </div> */}

      <div className="absolute text-center bottom-0 left-0 right-0 p-4 border-t">
        <Button
          type="text"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className="w-full"
        >
          {!collapsed && "Logout"}
        </Button>
      </div>
    </Sider>
  );
};

export default AppSidebar;
