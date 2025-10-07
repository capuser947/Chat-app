"use client";
import { axiosInstance } from "@/app/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

const page = () => {
  const params = useParams();
  const toId = params.id;
  const toUserFetcher = async () => {
    const res = await axiosInstance.get(`user/getsingleuser/${toId}`);
    return res.data.data;
  };
  const {
    data: toUser,
    isLoading: isToUserLoading,
    error: toUserError,
  } = useQuery({
    queryFn: toUserFetcher,
    queryKey: ["touser"],
  });
  console.log("GanduPraneeth", toUser, toUserError, isToUserLoading);

  return <div>Chat Page</div>;
};

export default page;
