import { TextSkeleton } from "./TextSkeleton";

export function FooterSkeleton() {
  return (
    <footer className="bg-background border-t border-border py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          role="status"
          aria-label="Loading footer"
        >
          {/* Contact Column */}
          <div className="space-y-4">
            <TextSkeleton width="w-1/2" height="h-6" />
            <div className="space-y-2">
              <TextSkeleton width="w-full" height="h-4" />
              <TextSkeleton width="w-3/4" height="h-4" />
              <TextSkeleton width="w-2/3" height="h-4" />
            </div>
          </div>

          {/* Hours Column */}
          <div className="space-y-4">
            <TextSkeleton width="w-1/2" height="h-6" />
            <div className="space-y-2">
              <TextSkeleton width="w-full" height="h-4" />
              <TextSkeleton width="w-full" height="h-4" />
              <TextSkeleton width="w-3/4" height="h-4" />
            </div>
          </div>

          {/* Social Column */}
          <div className="space-y-4">
            <TextSkeleton width="w-1/2" height="h-6" />
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-muted/50 rounded-full animate-pulse" />
              <div className="w-10 h-10 bg-muted/50 rounded-full animate-pulse" />
              <div className="w-10 h-10 bg-muted/50 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <TextSkeleton width="w-1/3 mx-auto" height="h-4" />
        </div>
      </div>
    </footer>
  );
}
