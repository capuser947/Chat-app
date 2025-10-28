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
import { LexicalEditorr } from "../../../components/LexicalEditorComponent";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import AllMessagesRenderer from "@/app/components/AllMessagesRenderer";

export interface TMessage {
  _id: string;
  from: string;
  to: string[];
  text: string;
  encryptedMessage: [];
}
let socket: Socket;
const page = () => {
  const lastDivRef = useRef<HTMLDivElement>(null);
  const [allMessages, setAllMessages] = useState<TMessage[]>([]);
  const currentUser: any = getCurrentUser();
  console.log(currentUser, "CURRRRRRRR");
  const params = useParams();
  const toId = String(params.id);
  console.log("BOTH", currentUser?._id, toId);
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
  }, []);

  const sendMessageHandler = async (values: any) => {
    console.log(values, "messagemessagemessage");
    console.log(currentUser);
    const message = {
      from: currentUser?._id,
      to: [toId],
      text: values.root.children[0].children[0].text.trim(),
      encryptedMessage: values,
    };
    console.log("MESSAGEMESSAGE", message);
    socket.emit("private-message", { ...message });
    await mutatemessage.mutateAsync(message);
    form.resetFields();
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
    queryKey: ["chat", currentUser?._id, toId], // 👈 dynamic key
    enabled: !!currentUser?._id && !!toId, // 👈 ensures user data is loaded
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
    <div className="flex flex-col justify-between p-2 h-screen bg-gray-50">
      <div className="text-2xl text-black bg-green-200 text-center ">
        {toUser?.name}
      </div>
      <div className="flex-1 overflow-y-scroll p-20">
        {allMessages?.map((message) => (
          <div key={message._id + Math.random().toString()}>
            <AllMessagesRenderer from={currentUser} to={toUser} message={message} />
          </div>
        ))}
        <div ref={lastDivRef}></div>
      </div>
      <div>
        <LexicalEditorr sendMessageHandler={sendMessageHandler} />
      </div>
    </div>
  );
};

export default page;
