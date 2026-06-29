"use client";

import { useEffect, useRef } from "react";
import styles from "./GallerySection.module.css";

import g1  from "../../images/gallery-1.jpeg";
import g2  from "../../images/gallery-2.jpeg";
import g3  from "../../images/gallery-3.jpeg";
import g4  from "../../images/gallery-4.jpeg";
import g5  from "../../images/gallery-5.jpeg";
import g6  from "../../images/gallery-6.jpeg";
import g7  from "../../images/gallery-7.jpeg";
import g8  from "../../images/gallery-8.jpeg";
import g9  from "../../images/gallery-9.jpeg";


const ORIGINAL_IMAGES = [g1, g2, g3, g4, g5, g6, g7, g8, g9].map(
  (img) => img.src
);

const CLONE_COUNT      = 3;
const SNAP_ENABLED     = true;
const SNAP_DELAY       = 300;
const SNAP_STRENGTH    = 0.08;
const INERTIA_DAMPING  = 0.92;
const SCROLL_SMOOTHING = 0.15;

export default function GallerySection() {
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    /* ── Build infinite strip ─────────────────────────────────── */
    gallery.innerHTML = "";
    const allItems: HTMLDivElement[] = [];

    for (let c = 0; c < CLONE_COUNT; c++) {
      ORIGINAL_IMAGES.forEach((src, index) => {
        const item = document.createElement("div");
        item.className = styles.galleryItem;
        const img = document.createElement("img");
        img.src = src;
        img.alt = `Gallery ${index + 1}`;
        img.loading = "eager";
        item.appendChild(img);
        gallery.appendChild(item);
        allItems.push(item);
      });
    }

    const images = allItems.map((el) => el.querySelector("img") as HTMLImageElement);
    const originalSetSize = ORIGINAL_IMAGES.length;

    /* ── State ────────────────────────────────────────────────── */
    let targetScroll  = 0;
    let currentScroll = 0;
    let velocity      = 0;
    let isLooping     = false;
    let snapTimeout: ReturnType<typeof setTimeout> | null = null;
    let animationId: number;

    let cachedContainerCenter = window.innerWidth / 2;
    const cachedItemsCenters  = new Array(allItems.length).fill(0);
    const offsets             = new Array(images.length).fill(0);

    /* ── Helpers ──────────────────────────────────────────────── */
    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function updateItemsCenters() {
      for (let i = 0; i < allItems.length; i++) {
        const rect = allItems[i].getBoundingClientRect();
        cachedItemsCenters[i] = rect.left + rect.width / 2;
      }
    }

    function getOriginalSetWidth() {
      if (allItems.length === 0) return 0;
      const first = allItems[0].getBoundingClientRect();
      const last  = allItems[originalSetSize - 1].getBoundingClientRect();
      return last.right - first.left + 15;
    }

    function handleInfiniteScroll() {
      if (isLooping) return;
      const maxScroll = gallery.scrollWidth - gallery.clientWidth;
      const setWidth  = getOriginalSetWidth();
      const threshold = setWidth * 0.3;

      if (targetScroll > maxScroll - threshold) {
        isLooping = true;
        const newScroll = targetScroll - setWidth;
        targetScroll = currentScroll = newScroll;
        gallery.scrollLeft = currentScroll;
        requestAnimationFrame(() => { isLooping = false; });
      } else if (targetScroll < threshold) {
        isLooping = true;
        const newScroll = targetScroll + setWidth;
        targetScroll = currentScroll = newScroll;
        gallery.scrollLeft = currentScroll;
        requestAnimationFrame(() => { isLooping = false; });
      }
    }

    /* ── Snap ─────────────────────────────────────────────────── */
    function triggerSnap() {
      if (!SNAP_ENABLED) return;
      if (snapTimeout) clearTimeout(snapTimeout);
      snapTimeout = setTimeout(() => {
        if (Math.abs(velocity) > 0.5) return;
        updateItemsCenters();
        const center = window.innerWidth / 2;
        let closest = 0, minDist = Infinity;
        for (let i = 0; i < allItems.length; i++) {
          const dist = Math.abs(center - cachedItemsCenters[i]);
          if (dist < minDist) { minDist = dist; closest = i; }
        }
        const rect = allItems[closest].getBoundingClientRect();
        const tp   = targetScroll + (rect.left + rect.width / 2 - center);
        const maxS = gallery.scrollWidth - gallery.clientWidth;
        const newT = Math.max(0, Math.min(tp, maxS));
        velocity  += (newT - targetScroll) * SNAP_STRENGTH;
      }, SNAP_DELAY);
    }

    function resetSnap() {
      if (snapTimeout) clearTimeout(snapTimeout);
      if (SNAP_ENABLED) snapTimeout = setTimeout(triggerSnap, SNAP_DELAY);
    }

    /* ── Wheel (scoped to gallery element only) ──────────────── */
    let lastWheelTime = 0;
    let isHovered = false;

    function onMouseEnter() { isHovered = true; }
    function onMouseLeave() { isHovered = false; }

    function onWheel(e: WheelEvent) {
      if (!isHovered) return;          // only hijack when over the gallery
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTime < 16) return;
      lastWheelTime = now;
      let delta = e.deltaY;
      if (Math.abs(delta) > 100) delta *= 0.5;
      if (Math.abs(delta) <  20) delta *= 1.5;
      velocity += delta * 0.6;
      resetSnap();
    }

    /* ── Drag ─────────────────────────────────────────────────── */
    let isDragging   = false;
    let startX       = 0;
    let startScroll  = 0;
    let lastMoveX    = 0;
    let lastMoveTime = 0;

    function onPointerDown(e: PointerEvent) {
      isDragging  = true;
      startX      = e.clientX;
      startScroll = targetScroll;
      lastMoveX   = e.clientX;
      lastMoveTime = Date.now();
      velocity    = 0;
      if (snapTimeout) clearTimeout(snapTimeout);
      gallery.style.cursor = "grabbing";
    }

    function onPointerMove(e: PointerEvent) {
      if (!isDragging) return;
      e.preventDefault();
      const now  = Date.now();
      const dx   = startX - e.clientX;
      const maxS = gallery.scrollWidth - gallery.clientWidth;
      targetScroll  = Math.max(0, Math.min(startScroll + dx, maxS));
      currentScroll = targetScroll;
      gallery.scrollLeft = currentScroll;
      const td = now - lastMoveTime;
      if (td > 0 && td < 100) velocity = ((lastMoveX - e.clientX) / td) * 8;
      lastMoveX    = e.clientX;
      lastMoveTime = now;
    }

    function onPointerUp() {
      isDragging = false;
      gallery.style.cursor = "grab";
      triggerSnap();
    }

    /* ── Animation loop ───────────────────────────────────────── */
    let lastTimestamp = 0;
    function animate(timestamp: number) {
      if (timestamp - lastTimestamp > 100) {
        cachedContainerCenter = window.innerWidth / 2;
        lastTimestamp = timestamp;
      }
      if (!isDragging) {
        targetScroll += velocity;
        velocity     *= INERTIA_DAMPING;
        if (Math.abs(velocity) < 0.05) velocity = 0;
      }
      const maxS = gallery.scrollWidth - gallery.clientWidth;
      targetScroll  = Math.max(0, Math.min(targetScroll, maxS));
      handleInfiniteScroll();
      currentScroll       = lerp(currentScroll, targetScroll, SCROLL_SMOOTHING);
      gallery.scrollLeft  = currentScroll;
      updateItemsCenters();

      for (let i = 0; i < images.length; i++) {
        let offset = (cachedContainerCenter - cachedItemsCenters[i]) / 6;
        offset     = Math.max(-80, Math.min(80, offset));
        offsets[i] = lerp(offsets[i], offset, 0.12);
        images[i].style.transform =
          `translate(calc(-50% + ${offsets[i].toFixed(1)}px), -50%)`;
      }
      animationId = requestAnimationFrame(animate);
    }

    /* ── Resize ───────────────────────────────────────────────── */
    let resizeTimeout: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        cachedContainerCenter = window.innerWidth / 2;
        updateItemsCenters();
        const maxS = gallery.scrollWidth - gallery.clientWidth;
        targetScroll  = Math.max(0, Math.min(targetScroll, maxS));
        currentScroll = targetScroll;
        gallery.scrollLeft = currentScroll;
      }, 100);
    }

    /* ── Init ─────────────────────────────────────────────────── */
    gallery.style.cursor = "grab";

    // Scroll to the middle clone set so infinite scroll works both ways
    requestAnimationFrame(() => {
      const setWidth = getOriginalSetWidth();
      targetScroll   = currentScroll = setWidth;
      gallery.scrollLeft = currentScroll;
      updateItemsCenters();
      cachedContainerCenter = window.innerWidth / 2;
      animationId = requestAnimationFrame(animate);
    });

    // wheel on the gallery element only — never blocks page scroll elsewhere
    gallery.addEventListener("wheel",       onWheel,                    { passive: false });
    gallery.addEventListener("mouseenter",  onMouseEnter);
    gallery.addEventListener("mouseleave",  onMouseLeave);
    window.addEventListener("resize",       onResize);
    gallery.addEventListener("pointerdown", onPointerDown as EventListener);
    gallery.addEventListener("pointermove", onPointerMove as EventListener);
    gallery.addEventListener("pointerup",   onPointerUp);
    gallery.addEventListener("pointerleave", onPointerUp);

    return () => {
      cancelAnimationFrame(animationId);
      if (snapTimeout) clearTimeout(snapTimeout);
      gallery.removeEventListener("wheel",       onWheel);
      gallery.removeEventListener("mouseenter",  onMouseEnter);
      gallery.removeEventListener("mouseleave",  onMouseLeave);
      window.removeEventListener("resize",       onResize);
      gallery.removeEventListener("pointerdown", onPointerDown as EventListener);
      gallery.removeEventListener("pointermove", onPointerMove as EventListener);
      gallery.removeEventListener("pointerup",   onPointerUp);
      gallery.removeEventListener("pointerleave", onPointerUp);
    };
  }, []);

  return (
    <section id="gallery" className={styles.section}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className={styles.titleBlock}>
        <p className={styles.eyebrow}>Visual Gallery</p>
        <h2 className={styles.heading}>Our Moments</h2>
        <p className={styles.subTitle}>with horizontal parallax</p>
      </div>

      {/* ── Hint ───────────────────────────────────────────────── */}
      <p className={styles.hint}>
        Drag or scroll to explore
      </p>

      {/* ── Gallery strip ──────────────────────────────────────── */}
      <div className={styles.pageWrapper}>
        <div
          ref={galleryRef}
          id="gallery-inner"
          className={styles.galleryContainer}
        />
      </div>

    </section>
  );
}