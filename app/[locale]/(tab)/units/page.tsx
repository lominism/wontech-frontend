import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Plus } from "lucide-react";

// Placeholder page for the "Organization Mgmt" section.
// Kept as a single landing page so new sub-pages can be added under it later.
export default function UnitsPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">All Units</h1>
          <p className="text-sm text-muted-foreground">
            Organization management — add your unit sub-pages here.
          </p>
        </div>
        <Button>
          <Plus className="size-4" />
          New Unit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Units overview</CardTitle>
          <CardDescription>
            This is a static placeholder. Wire it up to your backend when ready.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Building2 className="size-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">No units yet</p>
              <p className="text-sm text-muted-foreground">
                Units you create will appear here.
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="size-4" />
              Add your first unit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
