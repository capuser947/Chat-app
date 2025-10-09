"use client";
import React, { useState } from "react";
import { Activity, Bell, MessageCircle, Users } from "lucide-react";
import { Button, Card, Form, Input } from "antd";
import Cookies from "js-cookie";
import { axiosInstance } from "../../utils/axiosInstance";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const ValueAdds = [
    {
      label: "Real-Time Messaging",
      desc: "Experience lightning-fast personal and group chats with instant message delivery powered by live sockets.",
      icon: <MessageCircle className="h-5 w-5 text-blue-200" />,
    },
    {
      label: "Group Conversations",
      desc: "Create or join groups to collaborate with teams, friends, or communities — all messages sync in real time across devices.",
      icon: <Users className="h-5 w-5 text-blue-200" />,
    },
    {
      label: "Smart Notifications",
      desc: "Stay updated with instant message alerts, mentions, and unread indicators, even when you're away.",
      icon: <Bell className="h-5 w-5 text-blue-200" />,
    },
  ];
  const handleLogin = async (values: any) => {
    setIsLoading(true);
    const res = await axiosInstance.post("/user/login", values);
    if (res.data.success) {
      const { token } = res.data;
      Cookies.set("token", token);
      router.push("/overview");
      setIsLoading(false);
    } else {
      const { error } = res.data;
      setIsLoading(false);
      console.log("Ye le login ne error throw kar diya ", error);
    }
  };
  const currentYear = new Date();
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 w-full"></div>
        <div className="relative z-10 text-white p-12 text-center flex flex-col w-full justify-center items-center">
          <div className="bg-white/10 rounded-lg p-8 flex max-w-xl flex-col w-full justify-center items-center backdrop-blur-sm">
            <div className="mb-8 flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
                <Activity className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Chat.IO</h1>
              <p className="text-xl text-blue-100 mb-6">
                Professional website for real-time chatting and video calling
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full">
              {ValueAdds.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white/10 rounded-lg"
                >
                  {item.icon}
                  <div className="text-left">
                    <h3 className="font-semibold text-white">{item.label}</h3>
                    <p className="text-sm text-blue-100 !m-0">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-10 w-20 h-20 bg-white/5 rounded-full blur-lg"></div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Activity className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Chat.IO</h1>
            </div>
            <p className="text-gray-600">
              Professional website monitoring platform
            </p>
          </div>

          <Card className="shadow-md border-0 bg-white ">
            <div className="text-center pb-3 space-y-2">
              <div className="text-3xl font-bold text-gray-900">
                Welcome back
              </div>
              <div className="text-gray-600">
                Sign in to access your monitoring dashboard
              </div>
            </div>

            <div className="space-y-4">
              <Form form={form} layout="vertical" onFinish={handleLogin}>
                <Form.Item
                  className="!mb-2"
                  label="Email address"
                  name="email"
                  rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Enter a valid email" },
                  ]}
                >
                  <Input placeholder="Enter your email" />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: "Password is required" }]}
                >
                  <Input.Password placeholder="Enter your password" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" className="w-full">
                    Sign in
                  </Button>
                </Form.Item>
              </Form>

              <div className="text-end">
                <p className="text-sm text-gray-500">
                  <span className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer hover: opacity-80 pr-2">
                    Register now
                  </span>
                </p>
              </div>
            </div>
          </Card>

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <div className="flex justify-center space-x-4 mb-2">
              <a href="#" className="hover:text-gray-700">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-700">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-700">
                Support
              </a>
            </div>
            <p>
              &copy; {currentYear.toDateString()} Chat.IO. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
