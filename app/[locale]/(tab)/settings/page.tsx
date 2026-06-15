"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspace } from "@/providers/WorkspaceProvider";
import { useState } from "react";

export default function SettingsPage() {
  const { selectedWorkspace } = useWorkspace();
  const [workspaceName, setWorkspaceName] = useState(selectedWorkspace.name);

  const initials = selectedWorkspace.name
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Configurations
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your workspace settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="workspace">
        <TabsList>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="danger">Danger zone</TabsTrigger>
        </TabsList>

        <TabsContent value="workspace" className="mt-4">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>Workspace profile</CardTitle>
              <CardDescription>
                Update your workspace name and logo.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-16 rounded-xl">
                  <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  Change logo
                </Button>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ws-name">Workspace name</Label>
                <Input
                  id="ws-name"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-4">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Configure how this workspace behaves.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-1">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Email notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive activity summaries by email.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Compact tables</p>
                  <p className="text-sm text-muted-foreground">
                    Show more rows per screen.
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger" className="mt-4">
          <Card className="max-w-xl border-destructive/40">
            <CardHeader>
              <CardTitle className="text-destructive">Delete workspace</CardTitle>
              <CardDescription>
                Permanently delete this workspace and all of its data. This
                action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="destructive">Delete workspace</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
