"use client";
import { axiosInstance } from "@/app/utils/axiosInstance";
import getCurrentUser from "@/app/utils/currentUser";
import { Message } from "@chatscope/chat-ui-kit-react";
import { useMutation, useQuery, QueryClient } from "@tanstack/react-query";
import { Button, Card, Form, Input, Spin } from "antd";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { io, Socket } from "socket.io-client";

interface TMessage {
  _id: string;
  from: string;
  to: string[];
  text: string;
}
let socket: Socket;
const page = () => {
  const lastDivRef = useRef<HTMLDivElement>(null);
  const [allMessages, setAllMessages] = useState<TMessage[]>([]);
  const currentUser: any = getCurrentUser();
  console.log(currentUser, "CURRRRRRRR");
  const params = useParams();
  const toId = String(params.id);
  console.log(currentUser?._id, toId);
  const [form] = Form.useForm();
  const createOrAddPrivateChat = async () => {
    const chat = {
      isGroupChat: false,
      from: currentUser._id,
      to: toId,
    };
    console.log("Damn bro", chat.from, chat.to);
    const res = await axiosInstance.post(`chat/addchat`, chat);
    console.log("YE LEEEEE data : ", res?.data?.data);
    return res.data.data;
  };

  useEffect(() => {
    lastDivRef.current?.scrollIntoView();
  });
  useEffect(() => {
    if (currentUser._id) {
      socket = io("http://localhost:9000");
      socket.on("connect", () => {
        socket.emit("join-room", `${currentUser?._id}`);
      });
    }

    socket.on("private-message", (message) => {
      console.log("message", message);
      setAllMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("connect");
      socket.disconnect();
    };
  }, [currentUser._id]);

  const sendMessageHandler = async (values: any) => {
    console.log(currentUser);
    const message = {
      from: currentUser?._id,
      to: [toId],
      text: values?.message.trim(),
    };
    console.log("MESSAGEMESSAGE", message);
    socket.emit("private-message", { ...message });
    await mutatemessage.mutateAsync(message);
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

  const mutatemessage = useMutation({
    mutationFn: addMessagesToDB,
    onSettled: () => {
      console.log("Message added");
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
  // const setMessages = () => {
  //   setAllMessages(chat?.messages);
  // };
  // setMessages();
  useEffect(() => {
    if (chat?.messages) setAllMessages(chat?.messages);
  }, [isChatLoading, chat?._id]);

  if (isToUserLoading || isChatLoading) return <Spin />;

  return (
    <div className="w-screen h-screen flex flex-col justify-around m-2 ">
      <div className="fixed top-2 bg-gray-900 text-2xl text-white text-center">
        <div className="m-auto">{toUser?.name}</div>
      </div>
      <div className=" overflow-y-auto block">
        {allMessages?.map((message) => (
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
        <div ref={lastDivRef}></div>
      </div>
      <Form
        className="flex bg-white gap-2 fixed bottom-0 right-2 left-70 m-2"
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
    </div>
  );
};

export default page;
