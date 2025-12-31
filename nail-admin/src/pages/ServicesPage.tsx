import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Services Management
        </h1>
        <p className="text-muted-foreground">
          Manage nail salon services, prices, and categories
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service List</CardTitle>
          <CardDescription>
            Add, edit, and organize your nail services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[400px] items-center justify-center rounded-md border border-dashed">
            <p className="text-sm text-muted-foreground">
              Services CRUD functionality coming soon...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
