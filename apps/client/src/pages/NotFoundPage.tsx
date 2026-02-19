import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-sans text-6xl font-bold text-primary/40 mb-4">404</p>
      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
        Trang Không Tồn Tại
      </h1>
      <p className="font-sans text-base text-muted-foreground max-w-md mb-8">
        Trang bạn đang tìm không tồn tại hoặc đã được di chuyển. Hãy quay về
        trang chủ để tiếp tục khám phá.
      </p>
      <Link to="/">
        <Button variant="pill" size="lg">
          Về Trang Chủ
        </Button>
      </Link>
    </div>
  );
}
