"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";
import { WorkspaceProvider } from "./WorkspaceProvider";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <WorkspaceProvider>{children}</WorkspaceProvider>
    </AuthProvider>
  );
};

export default AppProvider;
