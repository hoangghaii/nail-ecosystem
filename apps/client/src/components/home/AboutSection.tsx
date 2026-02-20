import { Check } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const features = [
  {
    desc: "Sơn và phụ kiện nhập khẩu chính hãng",
    title: "Nguyên Liệu Cao Cấp",
  },
  {
    desc: "Nghệ nhân với 5+ năm kinh nghiệm",
    title: "Kỹ Thuật Vẽ Tay",
  },
  {
    desc: "Dụng cụ sát trùng kỹ sau mỗi khách",
    title: "Vệ Sinh Chuẩn Y Khoa",
  },
];

export function AboutSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
          {/* Image with Offset Border Effect */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ margin: "-100px", once: true }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 lg:order-1"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none lg:overflow-visible">
              {/* Offset border layer - background decoration */}
              <motion.div
                className="absolute -bottom-2 -right-2 h-full w-full rounded-[24px] bg-secondary md:-bottom-3 md:-right-3 md:rounded-[28px] lg:-bottom-4 lg:-right-4 lg:rounded-[32px]"
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.1,
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />

              {/* Main image with primary border frame */}
              <motion.div
                className="relative rounded-[24px] border-2 border-primary bg-card p-2 md:rounded-[28px] md:border-[3px] md:p-2.5 lg:rounded-[32px] lg:border-4 lg:p-3"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.15,
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&h=600&fit=crop"
                  alt="Nail salon interior"
                  className="h-auto w-full rounded-[20px] object-cover md:rounded-[24px]"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ margin: "-100px", once: true }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2 text-center lg:text-left"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="font-serif text-4xl md:text-5xl font-semibold text-foreground"
            >
              Chúng Tôi Không Chỉ Đắp Móng,{" "}
              <br className="hidden md:block" />
              Chúng Tôi Tạo Ra Sự Tự Tin
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="mt-6 font-sans text-base lg:text-lg leading-relaxed text-muted-foreground"
            >
              Tại Pink Nail Art Studio, mỗi bộ móng là một tác phẩm nghệ thuật
              được chăm chút tỉ mỉ bởi những nghệ nhân tài hoa — nơi sự sáng
              tạo gặp gỡ đẳng cấp.
            </motion.p>

            {/* Features List */}
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="mt-6 space-y-4 text-left"
            >
              {features.map((feature) => (
                <li key={feature.title} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-foreground text-sm md:text-base">
                      {feature.title}
                    </h4>
                    <p className="font-sans text-sm text-muted-foreground">
                      {feature.desc}
                    </p>
                  </div>
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="mt-8"
            >
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  Tìm Hiểu Thêm
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
