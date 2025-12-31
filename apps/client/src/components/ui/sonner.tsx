import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          description: "group-[.toast]:text-muted-foreground",
          error:
            "group-[.toast]:border-2 group-[.toast]:border-destructive group-[.toast]:bg-background group-[.toast]:text-destructive",
          success:
            "group-[.toast]:border-2 group-[.toast]:border-primary group-[.toast]:bg-background group-[.toast]:text-foreground",
          toast:
            "group toast group-[.toaster]:rounded-[16px] group-[.toaster]:border-2 group-[.toaster]:border-border group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:font-sans",
          warning:
            "group-[.toast]:border-2 group-[.toast]:border-secondary group-[.toast]:bg-background group-[.toast]:text-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
