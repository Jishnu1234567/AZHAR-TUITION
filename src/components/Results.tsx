"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Results.module.css";

const stats = [
  { num: "100%", label: "Pass Rate" },
  { num: "95%+", label: "Top Scorers" },
  { num: "2025", label: "Batch" },
];

const toppers = [
  { name: "Aisha Rahman",    score: "98.6%", stream: "10th Grade", rank: 1, image: "result-1.jpg" },
  { name: "Mohammed Faiz",   score: "97.8%", stream: "12th Grade", rank: 2, image: "result-2.jpg" },
  { name: "Fathima Noor",    score: "96.4%", stream: "10th Grade", rank: 3, image: "result-3.jpg" },
  { name: "Sarath Krishnan", score: "95.2%", stream: "12th Grade", rank: 4, image: "result-4.jpg" },
  { name: "Hana Suresh",     score: "94.8%", stream: "10th Grade", rank: 5, image: "result-5.jpg" },
];

function Arrow() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
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

function StatCounter({ value, label }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(value.startsWith("2") ? value : "0");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const numMatch = value.match(/[\d.]+/);
    if (!numMatch) return;
    const target = parseFloat(numMatch[0]);
    const suffix = value.replace(numMatch[0], "");
    const isDecimal = value.includes(".");

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(
          (isDecimal
            ? (target * eased).toFixed(1)
            : Math.round(target * eased).toString()
          ) + suffix
        );
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });

    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} className={styles.stat}>
      <div className={styles.statNum}>{display}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

function TopperCard({ topper, index, onClick }) {
  const isFeatured = topper.rank === 1;

  return (
    <Reveal delay={index * 80} className={isFeatured ? styles.featuredCardWrap : ""}>
      <button
        className={`${styles.topperCard} ${isFeatured ? styles.topperCardFeatured : ""}`}
        onClick={() => onClick(`/images/${topper.image}`)}
        aria-label={`View ${topper.name}'s photo`}
      >
        {/* Photo */}
        <div className={styles.cardImageWrap}>
          <Image
            src={`/images/${topper.image}`}
            alt={topper.name}
            fill
            sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 33vw"}
            className={styles.cardImage}
            priority={isFeatured}
          />
          <div className={styles.cardScrim} />
        </div>

        {/* Rank badge — top-left corner */}
        <div className={styles.cardRankBadge}>
          <span className={styles.rankNumber}>#{topper.rank}</span>
        </div>

        {/* Info — bottom */}
        <div className={styles.cardInfo}>
          <h3 className={styles.cardName}>{topper.name}</h3>
          <div className={styles.cardMeta}>
            <span className={styles.scoreChip}>{topper.score}</span>
            <span className={styles.streamTag}>{topper.stream}</span>
          </div>
        </div>
      </button>
    </Reveal>
  );
}

export default function Results() {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────── */}
      <section className={styles.hero}>
        <Reveal>
          <p className={styles.eyebrow}>Results 2025</p>
          <h1 className={styles.h1}>Our Toppers</h1>
          <p className={styles.heroSub}>
            Meet our shining stars of 2025 — excellence earned through dedication.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className={styles.statsGrid}>
            {stats.map((s, i) => (
              <StatCounter key={i} value={s.num} label={s.label} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── TOPPERS GRID ───────────────────────────────────── */}
      <section className={styles.toppersSection}>
        <div className={styles.toppersHead}>
          <Reveal>
            <p className={styles.eyebrow}>Achievers</p>
            <h2 className={styles.h2}>Class of 2025</h2>
          </Reveal>
        </div>

        {/* Row 1 — Featured #1 (wide) + #2 */}
        <div className={styles.gridRow}>
          <TopperCard topper={toppers[0]} index={0} onClick={setActiveImage} />
          <TopperCard topper={toppers[1]} index={1} onClick={setActiveImage} />
        </div>

        {/* Row 2 — #3, #4, #5 equal columns */}
        <div className={styles.gridRowThree}>
          {toppers.slice(2).map((t, i) => (
            <TopperCard key={t.rank} topper={t} index={i + 2} onClick={setActiveImage} />
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <Reveal>
          <div className={styles.ctaBanner}>
            <div className={styles.ctaText}>
              <h3 className={styles.ctaHeading}>You can be our next topper.</h3>
              <p className={styles.ctaPara}>
                Join us today and take the first step toward transforming your future.
                Together, we will unlock your true potential.
              </p>
            </div>
            <a href="#contact" className={styles.ctaBtn}>
              Enroll now <Arrow />
            </a>
          </div>
        </Reveal>
      </section>

      {/* ── LIGHTBOX ───────────────────────────────────────── */}
      {activeImage && (
        <div
          className={styles.lightbox}
          onClick={() => setActiveImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
        >
          <button
            className={styles.closeBtn}
            onClick={() => setActiveImage(null)}
            aria-label="Close"
          >
            ×
          </button>
          <div
            className={styles.lightboxInner}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt="Student photo full view"
              fill
              className={styles.lightboxImage}
            />
          </div>
        </div>
      )}
    </>
  );
}