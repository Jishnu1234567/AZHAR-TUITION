"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import styles from "./Features.module.css";

import azharImg   from "../../images/Azhar.png";
import azharfImg  from "../../images/grade-2.png";
import azharfiImg from "../../images/grade-1.png";

interface Stat { label: string; value: string; }
interface SlideData {
  name: string; sub: string; image: StaticImageData;
  quote: string; stats: Stat[];
}

const slides: SlideData[] = [
  {
    name: "M. Azhar", sub: "Founder & Lead Educator", image: azharImg,
    quote: "Every lesson is built around the student, not just the syllabus.",
    stats: [
      { label: "Students",    value: "500+" },
      { label: "Pass rate",   value: "98%"  },
      { label: "Experience",  value: "10+ yrs" },
      { label: "Top rankers", value: "50+"  },
    ],
  },
  {
    name: "Expert Curriculum", sub: "Board Patterns · Competitive Exams", image: azharfImg,
    quote: "Designed around board patterns and competitive exam requirements for maximum results.",
    stats: [
      { label: "Subjects",    value: "8+"     },
      { label: "Board types", value: "3"      },
      { label: "Modules",     value: "120+"   },
      { label: "Updates",     value: "Yearly" },
    ],
  },
  {
    name: "Small Batches", sub: "Personalised · Direct attention", image: azharfiImg,
    quote: "Capped enrolment ensures every student gets direct attention and personalised feedback.",
    stats: [
      { label: "Batch size",  value: "≤12"   },
      { label: "Mentors",     value: "3"     },
      { label: "Sessions/wk", value: "5"     },
      { label: "Doubt hours", value: "Daily" },
    ],
  },
  {
    name: "Track Record", sub: "Est. 2014 · Aluva, Kerala", image: azharImg,
    quote: "Consistent top-rank results across CBSE, ICSE and State board examinations.",
    stats: [
      { label: "State ranks", value: "12"        },
      { label: "Dist. ranks", value: "40+"       },
      { label: "Years",       value: "10+"       },
      { label: "Boards",      value: "CBSE/ICSE" },
    ],
  },
];

const features = [
  { icon: "◈", title: "Expert Curriculum",    desc: "Designed around board patterns and competitive exam requirements." },
  { icon: "◉", title: "Small Batch Sizes",    desc: "Capped enrolment so every student gets direct attention."         },
  { icon: "◎", title: "Proven Track Record",  desc: "Consistent top-rank results across CBSE, ICSE and State boards."  },
];

function getStatAngles(count: number): string[] {
  const spread = 0.72;
  const startRad = -Math.PI / 2 - spread * Math.PI;
  return Array.from({ length: count }, (_, i) => {
    const rad = count === 1
      ? -Math.PI / 2
      : startRad + i * ((spread * 2 * Math.PI) / (count - 1));
    return (rad / (2 * Math.PI)).toFixed(4) + "turn";
  });
}

function Slide({ slide, isPrev = false }: { slide: SlideData; isPrev?: boolean }) {
  const angles = getStatAngles(slide.stats.length);
  return (
    <div className={`${styles.slide} ${isPrev ? styles.prev : ""}`}>
      <div className={styles.badge}>
        <span className={styles.badgeDot} />
        Est. 2014 · Aluva, Kerala
      </div>
      <div className={styles.slideImageWrap}>
        <Image src={slide.image} alt={slide.name} fill sizes="260px" className={styles.slideImage} priority />
      </div>
      {slide.quote && <div className={styles.slideQuote}>"{slide.quote}"</div>}
      {slide.stats.map((stat, i) => (
        <div key={stat.label} className={styles.slideStat} style={{ "--angle": angles[i] } as React.CSSProperties}>
          <div className={styles.statLabel}>{stat.label}</div>
          <div className={styles.statValue}>{stat.value}</div>
        </div>
      ))}
      <div className={styles.slideName}>{slide.name}</div>
      <div className={styles.slideSub}>{slide.sub}</div>
    </div>
  );
}

export default function About() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev]       = useState<number | null>(null);
  const animating             = useRef(false);

  const goTo = useCallback((index: number) => {
    if (animating.current || index === current) return;
    animating.current = true;
    setPrev(current);
    setCurrent(index);
    setTimeout(() => { animating.current = false; setPrev(null); }, 750);
  }, [current]);

  // ── Auto-advance every 3 s ──────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 3000);
    return () => clearInterval(id);
  }, [current, goTo]);

  return (
    <section id="about" className={styles.section} aria-label="About us">
      <div className={styles.layout}>

        {/* LEFT PANEL */}
        <div className={styles.leftPanel}>
          <p className={styles.aboutEyebrow}>About us</p>
          <h2 className={styles.headlineWrap}>
            We help students become{" "}
            <div className={styles.droppingTexts}>
              <span>confident.</span>
              <span>top rankers.</span>
              <span>achievers.</span>
              <span>their best.</span>
            </div>
          </h2>
          <p className={styles.aboutBody}>
            At Azhar&apos;s Tuition Centre, every lesson is built around the
            student — not the syllabus. We combine structured learning with
            personalised mentorship to make sure no one gets left behind.
            Founded in 2014 and based in Aluva, Kerala, we have helped over
            500 students reach their academic goals.
          </p>
          <div className={styles.featureList}>
            {features.map((f) => (
              <div key={f.title} className={styles.featureItem}>
                <span className={styles.featureIcon} aria-hidden="true">{f.icon}</span>
                <div>
                  <p className={styles.featureTitle}>{f.title}</p>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <a href="#courses" className={styles.cta}>
            Explore Courses <span className={styles.ctaArrow}>→</span>
          </a>
        </div>

        {/* RIGHT PANEL */}
        <div className={styles.rightPanel}>
          <div className={styles.app}>
            <svg viewBox="0 0 100 100" className={styles.dashes} fill="none"
              stroke="#828dd6" strokeDasharray="2 4 4 3 2 3 8 2 3 5"
              strokeLinecap="round" strokeWidth="0.6" aria-hidden="true">
              <circle r="45" cx="50" cy="50" />
            </svg>
            {prev !== null && <Slide key={`prev-${prev}`} slide={slides[prev]} isPrev />}
            <Slide key={`cur-${current}`} slide={slides[current]} />
          </div>

          {/* Dot navigation */}
          <nav className={styles.dots} aria-label="Slide navigation">
            {slides.map((_, i) => (
              <button key={i}
                className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === current ? "true" : undefined}
              />
            ))}
          </nav>
        </div>

      </div>
    </section>
  );
}