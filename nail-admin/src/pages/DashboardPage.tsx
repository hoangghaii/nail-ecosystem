import {
  Image,
  Scissors,
  Images,
  Calendar,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DashboardPage() {
  const stats = [
    { icon: Image, label: "Total Banners", value: "3" },
    { icon: Scissors, label: "Total Services", value: "10" },
    { icon: Images, label: "Gallery Items", value: "18" },
    { icon: Calendar, label: "Pending Bookings", value: "5" },
  ];

  const quickActions = [
    {
      description: "Create and manage hero section banners",
      href: "/banners",
      icon: Image,
      title: "Manage Banners",
    },
    {
      description: "Add, edit, and organize nail services",
      href: "/services",
      icon: Scissors,
      title: "Manage Services",
    },
    {
      description: "Upload and organize portfolio images",
      href: "/gallery",
      icon: Images,
      title: "Manage Gallery",
    },
    {
      description: "View and update booking status",
      href: "/bookings",
      icon: Calendar,
      title: "View Bookings",
    },
    {
      description: "Respond to customer inquiries",
      href: "/contacts",
      icon: MessageSquare,
      title: "View Contacts",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Pink Nail Admin Dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Manage your nail salon content and bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <Link key={action.href} to={action.href}>
                <Card className="transition-colors hover:bg-accent cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <action.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
