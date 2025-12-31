import { Home } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BreadcrumbData = {
  label: string;
  path: string;
};

const routeLabels: Record<string, string> = {
  "": "Home",
  booking: "Book Appointment",
  contact: "Contact Us",
  gallery: "Gallery",
  services: "Services",
};

export function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't show breadcrumbs on homepage
  if (location.pathname === "/") {
    return null;
  }

  const breadcrumbs: BreadcrumbData[] = [
    { label: "Home", path: "/" },
    ...pathnames.map((value, index) => {
      const path = `/${pathnames.slice(0, index + 1).join("/")}`;
      return {
        label: routeLabels[value] || value,
        path,
      };
    }),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ damping: 30, stiffness: 300, type: "spring" }}
      className="mb-8 rounded-[12px] border border-border bg-card px-4 py-3"
    >
      <BreadcrumbRoot>
        <BreadcrumbList>
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const isFirst = index === 0;

            return (
              <React.Fragment key={breadcrumb.path}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="flex items-center gap-1.5 font-sans text-sm font-medium">
                      {isFirst && <Home className="size-4" />}
                      {breadcrumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        to={breadcrumb.path}
                        className="flex items-center gap-1.5 font-sans text-sm transition-colors duration-200 hover:text-primary"
                      >
                        {isFirst && <Home className="size-4" />}
                        {breadcrumb.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </BreadcrumbRoot>
    </motion.div>
  );
}
