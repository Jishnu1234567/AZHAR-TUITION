"use client";
import styles from "./Hero.module.css";
import Image from "next/image";
import { useRef, useEffect } from "react";

export default function Hero() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const ripplesRef = useRef([]);
  const img2Ref = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    let alive = true;

    // sync canvas size to container
    const syncSize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    syncSize();
    const ro = new ResizeObserver(syncSize);
    ro.observe(container);

    // preload hero-2
    const img = new window.Image();
    img.src = "/images/hero-2.png";
    img.onload = () => { img2Ref.current = img; };

    // track mouse
    const onMove = (e) => {
      const r = container.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      ripplesRef.current.push({ x, y, born: performance.now() });
      // keep max 25 ripples
      if (ripplesRef.current.length > 25) ripplesRef.current.splice(0, 1);
    };
    container.addEventListener("mousemove", onMove);

    // animation loop
    const LIFE = 900;    // ms a ripple lives
    const MAX_R = 110;   // max radius px
    const WAVES = 7;     // number of sine bumps on edge
    const AMP = 14;      // max wave amplitude

const loop = (now) => {
  if (!alive) return;

  rafRef.current = requestAnimationFrame(loop);

  ripplesRef.current = ripplesRef.current.filter(
    (rp) => now - rp.born < LIFE
  );

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Don't stop the animation loop
  if (!img2Ref.current || ripplesRef.current.length === 0) {
    return;
  }

  ctx.save();
  ctx.beginPath();

  ripplesRef.current.forEach((rp) => {
    const t = Math.min(1, (now - rp.born) / LIFE);

    const ease = 1 - Math.pow(1 - t, 2.5);

    const radius = Math.max(1, MAX_R * ease);

    const amp = Math.max(0, AMP * (1 - t));

    const phaseShift = t * Math.PI * 6;

    const steps = 80;

    for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * Math.PI * 2;

      const wave =
        Math.sin(angle * WAVES + phaseShift) * amp;

      // Prevent negative radius
      const r = Math.max(1, radius + wave);

      const px = rp.x + Math.cos(angle) * r;
      const py = rp.y + Math.sin(angle) * r;

      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }

    ctx.closePath();
  });

  ctx.clip();

  const cw = canvas.width;
  const ch = canvas.height;
  const img = img2Ref.current;

  const scale = Math.max(
    cw / img.naturalWidth,
    ch / img.naturalHeight
  );

  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;

  ctx.drawImage(
    img,
    (cw - dw) / 2,
    (ch - dh) / 2,
    dw,
    dh
  );

  ctx.restore();

  ripplesRef.current.forEach((rp) => {
    const t = Math.min(1, (now - rp.born) / LIFE);

    const ease = 1 - Math.pow(1 - t, 2.5);

    // Never allow negative radius
    const radius = Math.max(1, MAX_R * ease);

    const alpha =
      t < 0.4 ? t / 0.4 : (1 - t) / 0.6;

    ctx.beginPath();

    ctx.arc(
      rp.x,
      rp.y,
      radius,
      0,
      Math.PI * 2
    );

    ctx.strokeStyle = `rgba(255,255,255,${
      Math.max(0, alpha) * 0.5
    })`;

    ctx.lineWidth = 1.5;

    ctx.stroke();
  });
};
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      container.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <section className={styles.hero}>

      {/* ── TOP BAND ── */}
      <div className={styles.topSection}>
        <span className={styles.tagline}>CREATIVE AGENCY</span>
        <h1 className={styles.bigText}>#KNOWLEDGE</h1>
      </div>

      {/* ── MAIN FULL-IMAGE AREA ── */}
      <div className={styles.main} ref={containerRef}>

        {/* base image: hero-1 fills everything */}
        <Image
          src="/images/bgg.png"
          alt="Hero"
          fill
          priority
          sizes="100vw"
          className={styles.heroBg}
        />

        {/* canvas: reveals hero-2 on cursor wave */}
        <canvas ref={canvasRef} className={styles.canvas} />

        {/* UI text layer on top */}
        <div className={styles.ui}>

          <div className={styles.left}>
            <h2 className={styles.forText}>#BECOMES</h2>
            <div className={styles.bottomLeft}>
              <p className={styles.about}>ABOUT</p>
              <h3 className={styles.agencyText}>
                THE AGENCY THAT WILL GET RESULTS FOR YOU
              </h3>
            </div>
          </div>

          <div className={styles.right}>
            <p className={styles.smallRight}>
              * THE CREATIVE TEAM YOU'LL ALWAYS TRUST &amp; THE PARTNER YOU
              WILL EVER NEED
            </p>
            <h2 className={styles.shift}>#POWER</h2>
            <div className={styles.card}>
              <p className={styles.cardTitle}>IMPACT IN NUMBERS</p>
              <div className={styles.stats}>
                <div>
                  <h3>150+</h3>
                  <p>Successful Projects</p>
                </div>
                <div>
                  <h3>10+</h3>
                  <p>Years Experience</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.cta}>STUDY WITH US</div>

        </div>
      </div>
    </section>
  );
}