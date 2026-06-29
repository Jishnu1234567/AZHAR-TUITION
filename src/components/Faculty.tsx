"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import styles from './Faculty.module.css';

// ── Import images directly so Next.js/webpack bundles them correctly ──
// These resolve relative to wherever Faculty.tsx lives in your project.
// Adjust the path (e.g. ../../images/...) to match your folder structure.
import imgAzhar    from '../../images/Prof. M. Azhar.jpeg';
import imgThasneem from '../../images/Thasneem Azeez.jpg';
import imgBadhusha from '../../images/Badhusha M Razak.jpg';
import imgJumana   from '../../images/Jumana Shaji.jpg';
import imgSajeena  from '../../images/Sajeena Shaji.jpg';
import imgSumayya  from '../../images/Sumayya Ashraf.jpg';

const faculty = [
  { name: "Prof. M. Azhar",   subject: "Lead Teacher", classes: "10, +1 & +2",   image: imgAzhar    },
  { name: "Thasneem Azeez",   subject: "Teacher",      classes: "10, +1 & +2",   image: imgThasneem },
  { name: "Badhusha M Razak", subject: "Teacher",      classes: "8, 9 & 10",     image: imgBadhusha },
  { name: "Jumana Shaji",     subject: "Teacher",      classes: "10 & Commerce", image: imgJumana   },
  { name: "Sajeena Shaji",    subject: "Teacher",      classes: "8th Class",     image: imgSajeena  },
  { name: "Sumayya Ashraf",   subject: "Teacher",      classes: "Kids, 10 & +1", image: imgSumayya  },
];

function buildCarouselItems() {
  return Array.from({ length: 12 }, (_, i) => ({
    ...faculty[i % faculty.length],
    _key: i,
  }));
}

export default function Faculty() {
  const [items, setItems] = useState(buildCarouselItems);
  const activeIndex       = 4; // visible centre slot is always index 4
  const autoRef           = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAuto = useCallback(() => {
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; }
  }, []);

  const nextSlide = useCallback(() => {
    setItems(prev => {
      const next  = [...prev];
      const first = next.shift()!;
      next.push({ ...first, _key: Date.now() + Math.random() });
      return next;
    });
  }, []);

  const prevSlide = useCallback(() => {
    setItems(prev => {
      const next = [...prev];
      const last = next.pop()!;
      next.unshift({ ...last, _key: Date.now() + Math.random() });
      return next;
    });
  }, []);

  const handleNext = useCallback(() => { stopAuto(); nextSlide(); }, [stopAuto, nextSlide]);
  const handlePrev = useCallback(() => { stopAuto(); prevSlide(); }, [stopAuto, prevSlide]);

  const handleCardClick = useCallback((idx: number) => {
    stopAuto();
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width:600px)').matches;
    const max = isMobile ? 5 : 8;
    if (idx < 3 || idx > max) return;
    if (idx === max) nextSlide();
    if (idx === 3)   prevSlide();
  }, [stopAuto, nextSlide, prevSlide]);

  useEffect(() => {
    autoRef.current = setInterval(nextSlide, 3500);
    return stopAuto;
  }, [nextSlide, stopAuto]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd') handleNext();
      if (e.key === 'ArrowLeft'  || e.key === 'a') handlePrev();
    };
    window.addEventListener('keyup', onKey);
    return () => window.removeEventListener('keyup', onKey);
  }, [handleNext, handlePrev]);

  return (
    <section id="faculty" className={styles.facultySection}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p className={styles.eyebrow}>Our Educators</p>
        <h2 className={styles.heading}>Meet Our Experts</h2>
        <p className={styles.subheading}>
          Dedicated teachers who bring clarity, care, and expertise to every class.
        </p>
      </motion.div>

      <div className={styles.carousel}>
        <nav className={styles.carouselNav}>
          <button className={styles.navBtn} onClick={handlePrev} aria-label="Previous teacher">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Prev
          </button>
          <button className={styles.navBtn} onClick={handleNext} aria-label="Next teacher">
            Next
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </nav>

        <ul className={styles.carouselList}>
          {items.map((f, idx) => (
            <li
              key={f._key}
              className={styles.carouselItem}
              data-active={idx === activeIndex ? true : undefined}
              onClick={() => handleCardClick(idx)}
              tabIndex={idx === activeIndex ? 0 : -1}
              aria-label={`${f.name}, ${f.subject}`}
            >
              <div className={styles.avatarFallback} aria-hidden="true">
                <span>{f.name.charAt(0)}</span>
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={typeof f.image === 'string' ? f.image : (f.image as any).src}
                alt={f.name}
                className={styles.carouselImage}
                draggable={false}
              />

              <div className={styles.carouselContents}>
                <p className={styles.userName}>{f.name}</p>
                <p className={styles.userTitle}>{f.subject}&nbsp;·&nbsp;{f.classes}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}