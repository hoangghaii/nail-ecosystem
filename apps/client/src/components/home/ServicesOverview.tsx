import { motion, type Variants } from "motion/react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { getFeaturedServices } from "@/data/services";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
    y: 0,
  },
} as Variants;

export function ServicesOverview() {
  const featuredServices = getFeaturedServices();

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-100px", once: true }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center md:mb-16"
        >
          <h2 className="font-serif text-4xl font-semibold text-foreground md:text-5xl">
            Dịch vụ Nổi bật
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground lg:text-lg">
            Khám phá các dịch vụ chăm sóc móng cao cấp của chúng tôi
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ margin: "-50px", once: true }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {featuredServices.slice(0, 3).map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="group relative"
            >
              {/* Service Card */}
              <div className="h-full rounded-[24px] border border-border bg-card p-6 transition-all hover:border-secondary">
                {/* Image Frame */}
                <div className="relative mb-6 overflow-hidden rounded-[20px] border-2 border-secondary p-2 bg-card">
                  <motion.img
                    src={service.imageUrl}
                    alt={service.name}
                    className="rounded-[16px] h-56 w-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>

                {/* Service Details */}
                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    {service.name}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>

                  {/* Price & Duration */}
                  <div className="flex items-baseline gap-3 pt-2">
                    <span className="font-sans text-2xl font-bold text-secondary">
                      ${service.price}
                    </span>
                    <span className="font-sans text-sm text-muted-foreground">
                      {service.duration} phút
                    </span>
                  </div>

                  {/* CTA Button */}
                  <Link to="/booking" className="block pt-2">
                    <Button
                      className="w-full group-hover:bg-secondary group-hover:text-secondary-foreground transition-all"
                      size="default"
                    >
                      Đặt Lịch Ngay
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="mt-12 text-center"
        >
          <Link to="/services">
            <Button variant="outline" size="lg" className="group">
              <span className="font-sans text-base font-semibold">
                Xem Tất Cả Dịch Vụ
              </span>
              <motion.span
                className="ml-2 inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                →
              </motion.span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
