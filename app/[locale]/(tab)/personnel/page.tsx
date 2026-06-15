import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockPersonnel } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export default function PersonnelPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Personnel</h1>
          <p className="text-sm text-muted-foreground">
            Staff and field personnel records.
          </p>
        </div>
        <Button>
          <Plus className="size-4" />
          Add personnel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personnel directory</CardTitle>
          <CardDescription>{mockPersonnel.length} people</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPersonnel.map((person) => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">{person.name}</TableCell>
                  <TableCell>{person.position}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {person.department}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {person.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {person.phone}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
