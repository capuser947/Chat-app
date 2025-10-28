"use client";
import { Button, Menu, Select, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useEffect, useState } from "react";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LogoutOutlined,
  MonitorOutlined,
} from "@ant-design/icons";
import { axiosInstance } from "../utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import getCurrentUser from "../utils/currentUser";
import { MessageCircleHeartIcon } from "lucide-react";

interface TOptions {
  label: string;
  value: string;
}
interface ChatOptions {
  chatType: "private" | "public";
  toMembers: string[];
}

const AppSidebar = () => {
  const currentUser: any = getCurrentUser();
  console.log("CURR", currentUser);
  const router = useRouter();
  const currentPath = usePathname();
  const [selectedTab, setSelectedTab] = useState<string>();
  console.log("VURRENTPATHVURRENTPATHVURRENTPATHVURRENTPATH", currentPath);
  const [tabsList, setTabsList] = useState<
    { key: string; icon: any; label: any }[] | null
  >(null);
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
  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  const fetcher = async () => {
    console.log("I am inside fetcher function");
    const res = await axiosInstance.get(`/user`);
    return res.data.data;
  };
  const chatFetcher = async () => {
    console.log("I am inside Chat fetcher function");
    const res = await axiosInstance.get(`/chat/getchats/${currentUser?._id}`);
    return res.data.data;
  };

  const { data, isLoading } = useQuery({
    queryFn: fetcher,
    queryKey: ["users"],
  });
  console.log(data, "datadata");

  const { data: chats, isLoading: isChatsLoading } = useQuery({
    queryFn: chatFetcher,
    queryKey: ["chat"],
  });

  const usersList = (data: any) => {
    let options: TOptions[] = [];
    data.map((user: any) => {
      options.push({ label: user.name, value: user._id });
    });
    return options;
  };
  const handleMenuClick = ({ key }: { key: string }) => {
    router.replace(`/${key}`);
  };
  const handleCreateAndNavigateToChatPage = async (
    id: string,
    chatType: string
  ) => {
    if (chatType == "private") {
      router.push(`/chat/${id}`);
      setSelectedTab(`chat/${id}`);
    }
  };
  useEffect(() => {
    if (Array.isArray(chats) && currentUser?._id) {
      let tabsMenu: { key: string; icon: any; label: any }[] = [];
      console.log("currentUser", currentUser);
      console.log("chats", chats);
      chats.map((chat: any) => {
        let toParticipantArray = chat?.participants.filter((x: any) => {
          return x?._id != currentUser?._id;
        });
        console.log("toParticipantArray", toParticipantArray);
        if (toParticipantArray.length != 0) {
          tabsMenu.push({
            key: `chat/${toParticipantArray[0]._id}`,
            icon: <MessageCircleHeartIcon></MessageCircleHeartIcon>,
            label: toParticipantArray[0].name,
          });
        } else {
          tabsMenu.push({
            key: `chat/${currentUser._id}`,
            icon: <MessageCircleHeartIcon></MessageCircleHeartIcon>,
            label: currentUser.name,
          });
        }
      });
      console.log("tabsMenu", tabsMenu);
      setTabsList(tabsMenu);
    }
  }, [chats, currentPath]);
  console.log("tabsList", tabsList);
  if (isLoading || isChatsLoading) return;

  return (
    <Sider
      collapsed={collapsed}
      style={{ background: colorBgContainer, overflow: "hidden" }}
      width={250}
      className="!border-r !overflow-hidden "
    >
      <div className="p-4 border-b border-0 flex items-center justify-between relative  ">
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
          className="w-8 absolute left-7.75 !z-10000"
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
            console.log("IAMGOING", value);
            handleCreateAndNavigateToChatPage(value, "private");
          }}
        />
      </div>
      <div className="h-full flex-col justify-around space-x-8">
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedTab ?? ""]}
          items={tabsList ?? []}
          onClick={handleMenuClick}
          className="!px-2 !pt-1 !text-base custom-sidebar-menu !border-0"
        />
        {/* <Menu
          theme="light"
          mode="inline"
          // selectedKeys={selectedKeys}
          items={tabsList ?? []}
          // onClick={handleMenuClick}
          className="!px-2 !pt-1 !text-base custom-sidebar-menu !border-0"
        /> */}
      </div>

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
