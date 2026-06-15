"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  mockWorkspaces,
  type CurrentUser,
  type Workspace,
} from "@/lib/mock-data";
import { useAuth } from "./AuthProvider";

type WorkspaceContextType = {
  workspaces: Workspace[];
  selectedWorkspace: Workspace;
  currentUser: CurrentUser;
  selectWorkspace: (id: string) => void;
  addWorkspace: (name: string) => void;
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces);
  const [selectedId, setSelectedId] = useState<string>(mockWorkspaces[0].id);

  const currentUser = useMemo<CurrentUser>(() => {
    const displayName = user?.displayName ?? "";
    const [firstName = "", ...rest] = displayName.split(" ");
    const lastName = rest.join(" ");
    return {
      firstName,
      lastName,
      email: user?.email ?? "",
      avatar: user?.photoURL ?? "",
    };
  }, [user]);

  const selectWorkspace = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const addWorkspace = useCallback((name: string) => {
    const newWorkspace: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      logo: "",
      role: "Owner",
      plan: "Free",
    };
    setWorkspaces((prev) => [...prev, newWorkspace]);
    setSelectedId(newWorkspace.id);
  }, []);

  const selectedWorkspace = useMemo(
    () => workspaces.find((w) => w.id === selectedId) ?? workspaces[0],
    [workspaces, selectedId]
  );

  const value = useMemo<WorkspaceContextType>(
    () => ({
      workspaces,
      selectedWorkspace,
      currentUser,
      selectWorkspace,
      addWorkspace,
    }),
    [workspaces, selectedWorkspace, currentUser, selectWorkspace, addWorkspace]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
