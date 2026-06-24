"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";
import { WorkspaceProvider } from "./WorkspaceProvider";
import { QueryProvider } from "./QueryProvider";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryProvider>
      <AuthProvider>
        <WorkspaceProvider>{children}</WorkspaceProvider>
      </AuthProvider>
    </QueryProvider>
  );
};

export default AppProvider;
