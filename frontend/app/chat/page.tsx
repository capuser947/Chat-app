"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, Select } from "antd";
import axios from "axios";
import { useEffect } from "react";
interface TOptions {
  label: string;
  value: string;
}
const page = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetcher = async () => {
    console.log("I am inside fetcher function");
    const res = await axios.post(baseUrl + "/user");
    return res;
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

  return (
    <div className=" w-[80%]  m-auto flex gap-6 justify-around">
      <Card className="!bg-green-100 w-[40%]">
        <Select options={usersList(data)} />
      </Card>
      <Card className="!bg-green-100 w-[40%]">Group Chat</Card>
    </div>
  );
};

export default page;
