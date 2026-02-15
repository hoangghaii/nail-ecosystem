import { Component, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <div className="max-w-md text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-serif text-foreground">
                Something went wrong
              </h1>
              <p className="text-foreground/70 text-lg">
                We're sorry for the inconvenience. Please refresh the page to
                continue.
              </p>
            </div>

            <Button
              size="lg"
              onClick={() => window.location.reload()}
              className="rounded-full"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
