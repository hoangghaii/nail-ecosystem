import { motion } from "motion/react";
import { Link } from "react-router-dom";

import { ServiceCard } from "@/components/services/ServiceCard";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useServicesPage } from "@/hooks/useServicesPage";

export function ServicesPage() {
  const {
    categories,
    filteredServices,
    selectedCategory,
    setSelectedCategory,
  } = useServicesPage();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Breadcrumb />
        <PageHeader
          subtitle="Khám phá các dịch vụ chăm sóc móng cao cấp được thiết kế để bạn trông và cảm thấy tốt nhất"
          title="Dịch Vụ Của Chúng Tôi"
        />

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <motion.button
              key={category.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ damping: 30, stiffness: 300, type: "spring" }}
              onClick={() => setSelectedCategory(category.value)}
              className={`rounded-[12px] px-6 py-3 font-sans font-medium transition-colors duration-200 ${
                selectedCategory === category.value
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground hover:border-secondary"
              }`}
            >
              {category.label}
            </motion.button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service, index) => (
            <ServiceCard key={service.id} index={index} service={service} />
          ))}
        </div>

        {/* No results message */}
        {filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <p className="font-sans text-lg text-muted-foreground">
              Không tìm thấy dịch vụ nào trong danh mục này.
            </p>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            damping: 30,
            delay: 0.3,
            stiffness: 300,
            type: "spring",
          }}
          className="mt-16 rounded-[32px] border-2 border-border bg-muted p-8 text-center sm:p-12"
        >
          <h2 className="mb-4 font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Sẵn Sàng Bắt Đầu?
          </h2>
          <p className="mx-auto mb-6 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground lg:text-lg">
            Đặt lịch hẹn ngay hôm nay và trải nghiệm sự khác biệt của dịch vụ
            chăm sóc móng cao cấp
          </p>
          <Link to="/booking">
            <Button className="rounded-[12px]" size="lg">
              Đặt Lịch Hẹn
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
