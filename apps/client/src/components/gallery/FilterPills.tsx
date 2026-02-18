import { cn } from "@repo/utils/cn";
import { motion } from "motion/react";

interface FilterPillsProps {
  filters: Array<{ label: string; slug: string; }>;
  onSelect: (slug: string) => void;
  selected: string;
}

export function FilterPills({ filters, onSelect, selected }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {filters.map((filter) => (
        <motion.button
          key={filter.slug}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ damping: 30, stiffness: 300, type: "spring" }}
          onClick={() => onSelect(filter.slug)}
          className={cn(
            "min-h-[48px] rounded-full px-6 py-2.5 font-sans text-sm font-medium transition-all duration-200",
            selected === filter.slug
              ? "bg-primary text-primary-foreground shadow-md"
              : "border-2 border-border bg-card text-foreground shadow-sm hover:border-primary hover:shadow-md"
          )}
        >
          {filter.label}
        </motion.button>
      ))}
    </div>
  );
}
