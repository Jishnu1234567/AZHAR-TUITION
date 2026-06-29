"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Courses.module.css";

import grade1 from "../../images/grade-1.png";
import grade2 from "../../images/grade-2.png";
import grade3 from "../../images/grade-3.png";

/* ── Data ─────────────────────────────────────────────────────────────── */

const programs = [
  {
    grade: "7th – 9th",
    tag: "Foundation",
    title: "Customized teaching for specific classes",
    description:
      "Our dedicated educators focus on building a strong academic foundation, fostering critical skills for primary and high school students.",
    href: "#contact",
    image: grade1,
    accent: "#ffeba7",
  },
  {
    grade: "X STD",
    tag: "Board Exam",
    title: "Specialized preparation for 10th standard",
    description:
      "Specialized preparation and tuition crafted for 10th standard board exam success.",
    href: "#contact",
    image: grade2,
    accent: "#a7d4ff",
  },
  {
    grade: "+1 & +2",
    tag: "Higher Secondary",
    title: "Customized guidance for +1 and +2",
    description:
      "Customized guidance and tuition designed for +1 and +2 students. Scientific preparation from an exam point of view.",
    href: "#contact",
    image: grade3,
    accent: "#b8ffd8",
  },
];

const schedule = [
  {
    num: "01",
    label: "Mon – Fri",
    title: "Weekday Schedule",
    desc: "Our structured timetable ensures consistent and effective learning throughout the week with regular daily classes.",
    times: ["7:00 am – 9:30 am", "4:00 pm – 8:30 pm"],
  },
  {
    num: "02",
    label: "Weekend",
    title: "Saturday & Sunday",
    desc: "Specially curated weekend classes offering additional opportunities for focused study and doubt-clearing.",
    times: ["7:30 am – 6:00 pm", "(Time is subject to change)"],
  },
  {
    num: "03",
    label: "Crash Course",
    title: "Intensive Exam Sessions",
    desc: "Accelerate your exam readiness with intensive sessions on weekends and holidays — targeted revision and expert guidance.",
    times: [
      "7:30 am – 12:30 pm",
      "3:00 pm – 6:00 pm",
      "(Time is subject to change)",
    ],
  },
];

const whyUs = [
  {
    label: "Personalized Approach",
    desc: "Tailored teaching for individual success.",
  },
  {
    label: "Engaging Curriculum",
    desc: "Modern and creative methods for effective learning.",
  },
  {
    label: "Holistic Development",
    desc: "Beyond academics — we build confident, capable students.",
  },
];

/* ── Arrow SVG ────────────────────────────────────────────────────────── */
function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Scroll-triggered reveal ──────────────────────────────────────────── */
function Reveal({
  children, delay = 0, className = "",
}: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.revealVisible : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Kinetic grade ticker ─────────────────────────────────────────────── */
function Ticker({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <span ref={ref} className={`${styles.ticker} ${visible ? styles.tickerVisible : ""}`}>
      {value}
    </span>
  );
}

/* ── Elevator split-text heading ─────────────────────────────────────── */
function ElevatorText({ left, right }: { left: string; right: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={styles.elevator}>
      <span className={`${styles.elevatorL} ${active ? styles.elevatorLActive : ""}`}>
        {left}
      </span>
      <span className={`${styles.elevatorR} ${active ? styles.elevatorRActive : ""}`}>
        {right}
      </span>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────────────── */
export default function Courses() {
  return (
    <>
      {/* ══════════════════════════════════════════════════════════════
          SECTION 1 — Programs (sticky scroll stacking)
         ══════════════════════════════════════════════════════════════ */}
      <section id="courses" className={styles.section}>
        <div className={styles.sectionHeader}>
          <Reveal>
            <p className={styles.eyebrow}>Our Offerings</p>
            <h2 className={styles.heading}>Programs by Grade Level</h2>
            <p className={styles.subheading}>
              Structured learning paths designed for every stage of a
              student&apos;s journey.
            </p>
          </Reveal>
        </div>

        <div className={styles.list}>
          {programs.map((p, idx) => (
            <div
              key={idx}
              className={styles.item}
              style={{ "--accent": p.accent, "--index": idx } as React.CSSProperties}
            >
              <figure className={styles.figure}>
                <Image
                  src={p.image} alt={p.title} fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.image} priority={idx === 0}
                />
                <div className={styles.figureOverlay} />
                <div className={styles.gradeBadge}>
                  <Ticker value={p.grade} />
                </div>
              </figure>
              <div className={styles.info}>
                <span className={styles.tag}>{p.tag}</span>
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.excerpt}>{p.description}</p>
                <a href={p.href} className={styles.link} target="_blank" rel="noopener noreferrer">
                  Learn More <Arrow />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2 — Schedule & Tuition
         ══════════════════════════════════════════════════════════════ */}
      <section id="schedule" className={styles.scheduleSection}>

        {/* ── Decorative background layer ── */}
        <div className={styles.scheduleDotGrid} aria-hidden="true" />
        <div className={styles.scheduleLineL} aria-hidden="true" />
        <div className={styles.scheduleLineR} aria-hidden="true" />

        <div className={styles.scheduleSectionInner}>
          <Reveal>
            <p className={styles.eyebrow}>Classes</p>
          </Reveal>
          <ElevatorText left="Schedule" right="& Tuition" />

          <div className={styles.scheduleGrid}>
            {schedule.map((s, idx) => (
              <Reveal key={idx} delay={idx * 110} className={styles.scheduleCardWrap}>
                <div className={styles.scheduleCard}>
                  <div className={styles.scheduleNum}>{s.num}</div>
                  <span className={styles.scheduleLabel}>{s.label}</span>
                  <h3 className={styles.scheduleTitle}>{s.title}</h3>
                  <p className={styles.scheduleDesc}>{s.desc}</p>
                  <ul className={styles.timeList}>
                    {s.times.map((t, i) => (
                      <li key={i} className={t.startsWith("(") ? styles.timeNote : styles.timeItem}>
                        {!t.startsWith("(") && <span className={styles.timeDot} aria-hidden="true" />}
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className={styles.ctaBanner}>
              <div className={styles.ctaBannerText}>
                <p className={styles.ctaBannerEyebrow}>Don&apos;t wait</p>
                <h3 className={styles.ctaBannerHeading}>Join Us Now!</h3>
              </div>
              <a
                href="#contact"
                className={styles.ctaBannerBtn}
                target="_blank" rel="noopener noreferrer"
              >
                Enrol Today <Arrow />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3 — Why Us
         ══════════════════════════════════════════════════════════════ */}
      <section id="why-us" className={styles.whySection}>

        {/* ── Decorative background layer ── */}
        <div className={styles.whyGridLines} aria-hidden="true" />
        <div className={styles.whyCornerTL} aria-hidden="true" />
        <div className={styles.whyCornerBR} aria-hidden="true" />
        <div className={styles.whyRing} aria-hidden="true" />

        <div className={styles.whyInner}>
          <Reveal className={styles.whyLeft}>
            <p className={styles.eyebrow}>Why Us</p>
            <h2 className={styles.heading}>The best learning experience</h2>
            <blockquote className={styles.whyQuote}>
              &ldquo;Choose us for personalized education with expert
              instructors, fostering holistic development in a positive and
              engaging environment.&rdquo;
            </blockquote>
            <ul className={styles.whyPills}>
              {["Holistic approach", "Passionate teachers", "Creative teaching methods"].map(
                (item) => (
                  <li key={item} className={styles.whyPill}>{item}</li>
                )
              )}
            </ul>
            <a href="#contact" className={styles.link} style={{ marginTop: "2rem" }}>
              Know More <Arrow />
            </a>
          </Reveal>

          <div className={styles.whyRight}>
            {whyUs.map((w, idx) => (
              <Reveal key={idx} delay={idx * 120} className={styles.whyCardWrap}>
                <div className={styles.whyCard}>
                  <span className={styles.whyCardNum}>0{idx + 1}</span>
                  <div>
                    <p className={styles.whyCardLabel}>{w.label}</p>
                    <p className={styles.whyCardDesc}>{w.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}