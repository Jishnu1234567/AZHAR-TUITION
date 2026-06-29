"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './Navigation.module.css';
import logoImage from '../../images/logo-azhar.png';

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Courses', href: '/#courses' },
  { label: 'Faculty', href: '/#faculty' },
  { label: 'Results', href: '/#results' },
  { label: 'Contact', href: '/#contact' },

];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>

          {/* Logo */}
          <a href="/#home" className={styles.logo} onClick={() => setActiveLink('Home')}>
            <Image src={logoImage} alt="Azhar's Tuition" height={36} priority />
          </a>

          {/* Desktop links */}
          <ul className={styles.links} role="list">
            {navLinks.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className={`${styles.link} ${activeLink === label ? styles.linkActive : ''}`}
                  onClick={() => setActiveLink(label)}
                >
                  {label}
                  <span className={styles.linkDot} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>

          {/* CTA + Hamburger */}
          <div className={styles.actions}>
            <a href="/#contact" className={styles.cta}>
              Enroll Now
            </a>
            <button
              className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`${styles.drawerBackdrop} ${menuOpen ? styles.drawerBackdropOpen : ''}`}
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
      />
      <div
        ref={menuRef}
        className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-label="Navigation menu"
      >
        <div className={styles.drawerHeader}>
          <Image src={logoImage} alt="Azhar's Tuition" height={32} />
          <button
            className={styles.drawerClose}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <ul className={styles.drawerLinks} role="list">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className={`${styles.drawerLink} ${activeLink === label ? styles.drawerLinkActive : ''}`}
                onClick={() => { setActiveLink(label); setMenuOpen(false); }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a href="/#contact" className={styles.drawerCta} onClick={() => setMenuOpen(false)}>
          Enroll Now
        </a>
      </div>
    </>
  );
}