"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AvailabilityCounter } from "@/components/availability-counter";
import { CountdownTimer } from "@/components/countdown-timer";
import { EVENT_LOCATION } from "@/lib/constants";
import { Bus, Camera, Martini, Users } from "lucide-react";

const highlights = [
  { title: "Transportation Included", icon: Bus },
  { title: "Food & Drinks", icon: Martini },
  { title: "Guided Tour", icon: Camera },
  { title: "Games & Fun Activities", icon: Users }
];

export function HomePage() {
  const { scrollYProgress } = useScroll();
  const yBackdrop = useTransform(scrollYProgress, [0, 1], [0, -160]);

  return (
    <div>
      <section className="animated-waterfall relative isolate min-h-[78vh] overflow-hidden">
        <motion.div style={{ y: yBackdrop }} className="absolute inset-0 -z-20">
          <Image
            src="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1600&q=80"
            alt="Waterfall and forest"
            fill
            priority
            className="object-cover opacity-45"
          />
        </motion.div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-emeraldDeep/50 to-black/85" />

        <div className="section-wrap relative z-10 flex min-h-[78vh] flex-col justify-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs uppercase tracking-[0.24em] text-[color:var(--gold-lux)]"
          >
            {EVENT_LOCATION}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="mt-2 max-w-4xl font-display text-4xl leading-tight md:text-5xl lg:text-6xl"
          >
            Escape to Nature: Kakla Sane & Crew Experience
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-2 text-sm text-sand/82 md:text-base"
          >
            Luxury. Adventure. Memories.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-5 flex flex-wrap items-center gap-2.5"
          >
            <Link href="/book" className="gold-button">
              Book Your Spot Now
            </Link>
            <Suspense fallback={<div className="text-sm text-sand/80">Loading...</div>}>
              <AvailabilityCounter />
            </Suspense>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-5 max-w-2xl"
          >
            <Suspense fallback={<div className="h-24 rounded-2xl bg-white/10" />}>
              <CountdownTimer />
            </Suspense>
          </motion.div>
        </div>
      </section>

      <section className="section-wrap page-fade">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="page-title">Experience Highlights</h2>
          <p className="mt-1 max-w-2xl text-xs text-sand/76">
            Every moment is designed to feel elevated, social, and deeply connected to nature.
          </p>
        </motion.div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="glass rounded-2xl p-4"
            >
              <item.icon className="h-5 w-5 text-[color:var(--gold-lux)]" />
              <p className="mt-2 font-display text-lg">{item.title}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
