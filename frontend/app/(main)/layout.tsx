"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout as AntLayOut } from "antd";
import AppSidebar from "../components/AppSidebar";

const queryClient = new QueryClient();

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { Content } = AntLayOut;
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <AntLayOut
          style={{
            height: "100vh",
            width: "100vw",
            padding: "20px",
            display: "flex",
          }}
        >
          <AppSidebar />
          <Content>{children}</Content>
        </AntLayOut>
      </QueryClientProvider>
    </div>
  );
};

export default MainLayout;
