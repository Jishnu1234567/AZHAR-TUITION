"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Events.module.css';
import event1 from '../../images/event1.jpg';
import event2 from '../../images/event2.jpg';
import event3 from '../../images/event3.jpg';
import event4 from '../../images/event4.jpg';
import gradeBg from '../../images/grade-1.png';

gsap.registerPlugin(ScrollTrigger);

const events = [
  {
    id: 1,
    title: 'Anniversary Celebration',
    date: 'Jan 2nd',
    badge: '🎉',
    tag: '1st Year',
    tagColor: '#6f42c1',
    image: event1,
    stats: [{ label: 'Year', value: '1st' }, { label: 'Month', value: 'Jan' }],
  },
  {
    id: 2,
    title: 'Merit Day',
    date: 'Feb 26th',
    badge: '🏆',
    tag: 'Awards',
    tagColor: '#f59e0b',
    image: event2,
    stats: [{ label: 'Awardees', value: '20+' }, { label: 'Month', value: 'Feb' }],
  },
  {
    id: 3,
    title: 'New Year Celebration',
    date: 'Jan 1st',
    badge: '🎊',
    tag: 'Festive',
    tagColor: '#10b981',
    image: event3,
    stats: [{ label: 'Batches', value: 'All' }, { label: 'Vibe', value: 'Festive' }],
  },
  {
    id: 4,
    title: '10 & +2 Farewell',
    date: 'Mar 15th',
    badge: '🎓',
    tag: 'Farewell',
    tagColor: '#4175fc',
    image: event4,
    stats: [{ label: 'Graduates', value: '40+' }, { label: 'Batches', value: '2' }],
  },
];

// ── Layout constants — tweak CARD_GAP to adjust spacing between cards ───
const CARD_WIDTH = 250;
const CARD_GAP   = 80;   // gap between card edges
const START_X    = 100;  // starting dot
const FIRST_CARD = 180;  // centre x of first card

// Total canvas width = first card + all cards + trailing space
const TOTAL_CARDS  = events.length;
const CANVAS_WIDTH = FIRST_CARD + TOTAL_CARDS * CARD_WIDTH + (TOTAL_CARDS - 1) * CARD_GAP + 200;

export default function Events() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLDivElement>(null);
  const hintRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas  = canvasRef.current;
    if (!wrapper || !canvas) return;

    const ctx = gsap.context(() => {
      const getMax = () => canvas.scrollWidth - window.innerWidth + 200;

      const hTween = gsap.to(canvas, {
        x: () => -getMax(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          pin: true,
          scrub: 1,
          end: () => '+=' + getMax(),
          invalidateOnRefresh: true,
        },
      });

      if (hintRef.current) {
        gsap.to(hintRef.current, {
          opacity: 0,
          y: 20,
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: 'top -80',
            scrub: true,
          },
        });
      }

      const paths = canvas.querySelectorAll<SVGPathElement>('.' + styles.linePath);
      paths.forEach((path) => {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: path,
            containerAnimation: hTween,
            start: 'left right-=200',
            end: 'right center',
            scrub: true,
          },
        });
      });

      const reveals = canvas.querySelectorAll<HTMLElement>('.' + styles.gsReveal);
      reveals.forEach((el) => {
        gsap.from(el, {
          scale: 0,
          opacity: 0,
          rotation: el.classList.contains(styles.plusBtn) ? -90 : 0,
          duration: 0.8,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: el,
            containerAnimation: hTween,
            start: 'left right-=150',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <section id="events" className={styles.section}>
      {/* Background image */}
      <div className={styles.bgImage}>
        <Image
          src={gradeBg}
          alt=""
          fill
          sizes="(max-width: 480px) 80vw, (max-width: 768px) 55vw, 28vw"
          className={styles.bgImg}
          aria-hidden="true"
        />
        <div className={styles.bgOverlay} />
      </div>

      {/* Section header */}
      <div className={styles.sectionHeader}>
        <p className={styles.eyebrow}>Latest Events & Activities</p>
        <h2 className={styles.heading}>Moments that matter</h2>
        <p className={styles.sub}>
          Celebrations, milestones and memories from Azhar's Tuition Centre
        </p>
      </div>

      {/* Pinned horizontal scroll zone */}
      <div ref={wrapperRef} className={styles.scrollWrapper}>
        <div ref={hintRef} className={styles.scrollHint}>
          Scroll to explore →
        </div>

        <div
          ref={canvasRef}
          className={styles.canvas}
          style={{ width: CANVAS_WIDTH }}
        >
          {/* SVG connector lines — viewBox matches canvas dimensions */}
          <svg
            className={styles.linesLayer}
            viewBox={`0 0 ${CANVAS_WIDTH} 1000`}
            preserveAspectRatio="none"
          >
            {events.slice(0, -1).map((_, i) => {
              const x1 = FIRST_CARD + i * (CARD_WIDTH + CARD_GAP) + CARD_WIDTH / 2 + 10;
              const x2 = FIRST_CARD + (i + 1) * (CARD_WIDTH + CARD_GAP) - CARD_WIDTH / 2 - 10;
              const mid = (x1 + x2) / 2;
              return (
                <path
                  key={i}
                  className={styles.linePath}
                  d={`M ${x1} 500 C ${mid} 500, ${mid} 500, ${x2} 500`}
                />
              );
            })}
          </svg>

          {/* Start dot */}
          <div
            className={`${styles.clayElement} ${styles.connectorDot} ${styles.gsReveal}`}
            style={{ left: START_X, top: '50%' }}
          />

          {/* Cards + connectors */}
          {events.map((ev, i) => {
            const cardLeft = FIRST_CARD + i * (CARD_WIDTH + CARD_GAP);
            const dotLeft  = cardLeft + CARD_WIDTH / 2 + 18;
            const plusLeft = cardLeft + CARD_WIDTH / 2 + 40;

            return (
              <div key={ev.id}>
                <div
                  className={`${styles.clayElement} ${styles.card} ${styles.gsReveal}`}
                  style={{ left: cardLeft, top: '50%' }}
                >
                  <div className={styles.cardVideoWrap}>
                    <Image
                      src={ev.image}
                      alt={ev.title}
                      fill
                      sizes="250px"
                      className={styles.thumbnail}
                    />
                    <div
                      className={styles.overlay}
                      style={{
                        background: `linear-gradient(135deg, ${ev.tagColor}99, #0a0c14cc)`,
                      }}
                    />
                    <div className={styles.headerBadges}>
                      <div className={styles.badgeGroup}>
                        <span
                          className={styles.badge}
                          style={{ background: ev.tagColor }}
                        >
                          {ev.tag}
                        </span>
                      </div>
                      <span className={`${styles.badge} ${styles.badgeIcon}`}>
                        {ev.badge}
                      </span>
                    </div>
                    <p className={styles.cardDate}>{ev.date}</p>
                  </div>

                  <div className={styles.cardStats}>
                    {ev.stats.map((s) => (
                      <div key={s.label} className={styles.statItem}>
                        <span className={styles.statVal}>{s.value}</span>
                        <span className={styles.statLbl}>{s.label}</span>
                      </div>
                    ))}
                    <div className={styles.statItem}>
                      <span className={styles.cardTitle}>{ev.title}</span>
                    </div>
                  </div>
                </div>

                {i < events.length - 1 && (
                  <>
                    <div
                      className={`${styles.clayElement} ${styles.connectorDot} ${styles.gsReveal}`}
                      style={{ left: dotLeft, top: '50%' }}
                    />
                    <div
                      className={`${styles.clayElement} ${styles.plusBtn} ${styles.gsReveal}`}
                      style={{ left: plusLeft, top: '50%' }}
                    >
                      +
                    </div>
                  </>
                )}
              </div>
            );
          })}

          {/* End dot */}
          <div
            className={`${styles.clayElement} ${styles.connectorDot} ${styles.gsReveal}`}
            style={{
              left: FIRST_CARD + TOTAL_CARDS * (CARD_WIDTH + CARD_GAP) - CARD_GAP + 30,
              top: '50%',
            }}
          />
        </div>
      </div>
    </section>
  );
}