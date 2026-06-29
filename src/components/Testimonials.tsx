"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Testimonials.module.css";

const testimonials = [
  {
    text: "Azhar's Tuition completely changed my perspective on mathematics. The way concepts are broken down made everything click. My grades jumped from C to A+ in one term.",
    name: "Sarah K.",
    role: "High School Student",
    subject: "Mathematics",
    score: "A+",
    avatar: "SK",
    color: "#6f42c1",
  },
  {
    text: "The personalised attention here is unlike any tuition centre I've attended. Faculty genuinely cares about every student's progress, not just exam scores.",
    name: "Rahul M.",
    role: "College Student",
    subject: "Physics",
    score: "98%",
    avatar: "RM",
    color: "#4175fc",
  },
  {
    text: "As a parent I was sceptical, but the results speak for themselves. My daughter went from struggling to topping her class within two months.",
    name: "Anita P.",
    role: "Parent",
    subject: "All Subjects",
    score: "Top 3",
    avatar: "AP",
    color: "#10b981",
  },
  {
    text: "Best academic decision I ever made. The study materials, doubt sessions, and mentorship prepared me far beyond just passing exams.",
    name: "James D.",
    role: "Alumni · Batch 2022",
    subject: "Chemistry",
    score: "State Rank",
    avatar: "JD",
    color: "#f59e0b",
  },
  {
    text: "Small batch sizes mean you never get lost in the crowd. Every doubt is addressed, every concept revisited until it's crystal clear.",
    name: "Meera R.",
    role: "High School Student",
    subject: "Biology",
    score: "A+",
    avatar: "MR",
    color: "#ec4899",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const go = (dir: number) => {
    setDirection(dir);
    setActive((prev) => (prev + dir + testimonials.length) % testimonials.length);
  };

  const current = testimonials[active];

  const variants = {
    enter: (d: number) => ({
      x: d > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (d: number) => ({
      x: d > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.96,
      transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
    }),
  };

  return (
    <section ref={sectionRef} className={styles.section} id="testimonials">
      {/* Parallax ambient blobs */}
      <motion.div className={styles.blobWrap} style={{ y: bgY }} aria-hidden>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />
      </motion.div>

      {/* Grid lines */}
      <div className={styles.grid} aria-hidden />

      <div className={styles.inner}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className={styles.eyebrow}>Student Stories</p>
          <h2 className={styles.heading}>
            Real results,{" "}
            <span className={styles.headingAccent}>real voices</span>
          </h2>
          <p className={styles.sub}>
            Over 500 students have passed through our doors. Here's what they have to say.
          </p>
        </motion.div>

        {/* Main card + side previews */}
        <div className={styles.stage}>
          {/* Prev preview */}
          <button
            className={`${styles.preview} ${styles.previewLeft}`}
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
          >
            <div
              className={styles.previewCard}
              style={{
                "--accent": testimonials[(active - 1 + testimonials.length) % testimonials.length].color,
              } as React.CSSProperties}
            >
              <Quote size={18} className={styles.previewQuote} />
              <p className={styles.previewText}>
                {testimonials[(active - 1 + testimonials.length) % testimonials.length].text.slice(0, 60)}…
              </p>
            </div>
            <ChevronLeft className={styles.chevron} size={20} />
          </button>

          {/* Active card */}
          <div className={styles.cardWrap}>
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={active}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className={styles.card}
                style={{ "--accent": current.color } as React.CSSProperties}
              >
                {/* Top accent bar */}
                <div className={styles.accentBar} />

                {/* Quote icon */}
                <div className={styles.quoteIcon}>
                  <Quote size={24} />
                </div>

                {/* Stars */}
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#FFD700" color="#FFD700" />
                  ))}
                  <span className={styles.starsLabel}>5.0</span>
                </div>

                {/* Text */}
                <p className={styles.text}>"{current.text}"</p>

                {/* Divider */}
                <div className={styles.divider} />

                {/* Author row */}
                <div className={styles.author}>
                  <div
                    className={styles.avatar}
                    style={{ background: current.color }}
                  >
                    {current.avatar}
                  </div>
                  <div className={styles.authorInfo}>
                    <p className={styles.authorName}>{current.name}</p>
                    <p className={styles.authorRole}>{current.role}</p>
                  </div>
                  <div className={styles.scorePill}>
                    <span className={styles.scoreLabel}>Score</span>
                    <span className={styles.scoreValue}>{current.score}</span>
                  </div>
                </div>

                {/* Subject tag */}
                <div className={styles.subjectTag} style={{ color: current.color }}>
                  {current.subject}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next preview */}
          <button
            className={`${styles.preview} ${styles.previewRight}`}
            onClick={() => go(1)}
            aria-label="Next testimonial"
          >
            <ChevronRight className={styles.chevron} size={20} />
            <div
              className={styles.previewCard}
              style={{
                "--accent": testimonials[(active + 1) % testimonials.length].color,
              } as React.CSSProperties}
            >
              <Quote size={18} className={styles.previewQuote} />
              <p className={styles.previewText}>
                {testimonials[(active + 1) % testimonials.length].text.slice(0, 60)}…
              </p>
            </div>
          </button>
        </div>

        {/* Dot nav + counter */}
        <div className={styles.nav}>
          <span className={styles.counter}>
            {String(active + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
          </span>
          <div className={styles.dots}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
                style={i === active ? { background: current.color } : {}}
                onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <div className={styles.navBtns}>
            <button className={styles.navBtn} onClick={() => go(-1)} aria-label="Previous">
              <ChevronLeft size={18} />
            </button>
            <button className={styles.navBtn} onClick={() => go(1)} aria-label="Next">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}