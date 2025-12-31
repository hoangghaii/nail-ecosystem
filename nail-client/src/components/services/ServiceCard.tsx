import { Clock, DollarSign } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

import type { Service, ServiceCategory } from "@/types";

import { Button } from "@/components/ui/button";

type ServiceCardProps = {
  index: number;
  service: Service;
};

const categoryLabels: Record<ServiceCategory, string> = {
  extensions: "Nối Móng",
  manicure: "Làm Móng Tay",
  "nail-art": "Nghệ Thuật Nail",
  pedicure: "Làm Móng Chân",
  spa: "Liệu Trình Spa",
};

export function ServiceCard({ index, service }: ServiceCardProps) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/booking");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        damping: 30,
        delay: index * 0.05,
        stiffness: 300,
        type: "spring",
      }}
      className="group flex h-full flex-col rounded-[20px] border-2 border-secondary bg-card p-2 transition-colors duration-200 hover:border-primary"
    >
      {/* Gold-framed image */}
      {service.imageUrl && (
        <div className="relative mb-4 overflow-hidden rounded-[16px]">
          <img
            alt={service.name}
            className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={service.imageUrl}
          />
        </div>
      )}

      {/* Content area - grows to fill space */}
      <div className="flex flex-1 flex-col px-2">
        {/* Category badge */}
        <div className="mb-3">
          <span className="inline-block rounded-[8px] border border-border bg-background px-3 py-1 font-sans text-xs font-medium text-muted-foreground">
            {categoryLabels[service.category]}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">
          {service.name}
        </h3>

        {/* Description */}
        <p className="mb-4 flex-1 font-sans text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>

        {/* Price and Duration */}
        <div className="mb-4 flex items-center justify-between gap-3 rounded-[12px] border border-border bg-background p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="size-5 text-primary" />
            <div>
              <span className="font-sans text-2xl font-bold text-foreground">
                ${service.price}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="size-4 text-secondary" />
            <span className="font-sans text-sm text-muted-foreground">
              {service.duration} phút
            </span>
          </div>
        </div>

        {/* Book Now Button */}
        <Button
          className="w-full rounded-[12px]"
          onClick={handleBookNow}
          size="default"
          variant="default"
        >
          Đặt Dịch Vụ Này
        </Button>
      </div>
    </motion.div>
  );
}
