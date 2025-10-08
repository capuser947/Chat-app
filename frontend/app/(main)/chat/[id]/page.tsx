"use client";
import { axiosInstance } from "@/app/utils/axiosInstance";
import getCurrentUser from "@/app/utils/currentUser";
import { getSocket } from "@/app/utils/socket";
import { Message } from "@chatscope/chat-ui-kit-react";
import { useMutation, useQuery, QueryClient } from "@tanstack/react-query";
import { Button, Card, Form, Input, Spin } from "antd";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

interface TMessage {
  from: string;
  to: string[];
  text: string;
}

const page = () => {
  const [allMessages, setAllMessages] = useState<TMessage[]>([]);
  const currentUser: any = getCurrentUser();
  console.log(currentUser, "CURRRRRRRR");
  const params = useParams();
  const toId = String(params.id);
  const [form] = Form.useForm();
  const socket = getSocket();
  const createOrAddPrivateChat = async () => {
    console.log("Damn bro");
    const chat = {
      isGroupChat: false,
      from: currentUser._id,
      to: toId,
    };
    const res = await axiosInstance.post(`chat/addchat`, chat);
    return res.data.data;
  };
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("join-room", `${currentUser?._id}`);
    });

    socket.on("private-message", (message) => {
      console.log("message", message);
      setAllMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("connect");
      socket.disconnect();
    };
  }, []);

  const sendMessageHandler = async (values: any) => {
    console.log(currentUser);
    const message = {
      from: currentUser?._id,
      to: [toId],
      text: values.message,
    };
    socket.emit("private-message", { ...message });
    await addMessagesToDB(message);
  };

  const toUserFetcher = async () => {
    const res = await axiosInstance.get(`user/getsingleuser/${toId}`);
    return res.data.data;
  };

  const addMessagesToDB = async (message: any) => {
    const res = await axiosInstance.post(
      `chat/addmessages/${chat._id}`,
      message
    );
    console.log("LATEST", res);
    return res.data.data;
  };

  const queryClient = new QueryClient();

  const mutatemessage = useMutation({
    mutationFn: addMessagesToDB,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });

  const {
    data: toUser,
    isLoading: isToUserLoading,
    error: toUserError,
  } = useQuery({
    queryFn: toUserFetcher,
    queryKey: ["touser"],
  });

  const {
    data: chat,
    isLoading: isChatLoading,
    error: chatError,
  } = useQuery({
    queryFn: createOrAddPrivateChat,
    queryKey: ["chat"],
  });
  console.log("ABEOYEEE CHAT AYA", chat);
  if (isToUserLoading || isChatLoading) return <Spin />;
  return (
    <Card className="!m-2 w-full relative">
      <div className="relative top-0 bg-gray-900 text-2xl text-white text-center">
        {toUser.name}
      </div>
      <div>
        {allMessages.map((message) => (
          <Message
            model={{
              direction:
                message.from === currentUser._id ? "outgoing" : "incoming",
              position: "single",
              message: message.text,
              sender:
                message.from === currentUser._id
                  ? currentUser.name
                  : toUser.name,
              sentTime: new Date().toLocaleTimeString(),
            }}
          />
        ))}
      </div>
      <Form
        className="flex gap-2 absolute bottom-0 right-2 left-2 m-2"
        form={form}
        onFinish={(values) => sendMessageHandler(values)}
      >
        <Form.Item className="!w-full" name="message">
          <Input.TextArea placeholder="Enter Your message"></Input.TextArea>
        </Form.Item>
        <Form.Item className="!w-10">
          <Button type="primary" htmlType="submit">
            Send
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default page;
