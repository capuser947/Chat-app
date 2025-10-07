"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout as AntLayOut } from "antd";
import AppSidebar from "../components/AppSidebar";

const queryClient = new QueryClient();

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <AntLayOut style={{ minHeight: "100vh" }}>
          <AppSidebar />
          {children}
        </AntLayOut>
      </QueryClientProvider>
    </div>
  );
};

export default MainLayout;
