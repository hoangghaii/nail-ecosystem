type PageHeaderProps = {
  subtitle?: string;
  title: string;
};

export function PageHeader({ subtitle, title }: PageHeaderProps) {
  return (
    <div className="mb-8 md:mb-12 text-center">
      <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 mx-auto max-w-2xl font-sans text-base lg:text-lg leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}
