"use client";

import styles from './Footer.module.css';
import footerImage from '../../public/images/footer.jpg';

const exploreLinks = [
  { label: 'Our Work',  href: '#work' },
  { label: 'About Us',  href: '#about' },
  { label: 'Shop',      href: '#shop' },
  { label: 'Reach Out', href: '#contact' },
];

const followLinks = [
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn',  href: '#' },
  { label: 'Facebook',  href: '#' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>

      {/* ── Hero section: headline + bg image ─────────── */}
      <div
        className={styles.heroSection}
        style={{ backgroundImage: `url(${footerImage.src})` }}
      >
       
      </div>

      {/* ── 3-col links ───────────────────────────────── */}
      <div className={styles.linksSection}>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Explore</h4>
          <ul className={styles.linkList}>
            {exploreLinks.map(l => (
              <li key={l.label}>
                <a href={l.href} className={styles.link}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Follow</h4>
          <ul className={styles.linkList}>
            {followLinks.map(l => (
              <li key={l.label}>
                <a href={l.href} className={styles.link}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Contact</h4>
          <a href="mailto:azharstuition685607@gmail.com" className={styles.contactText}>
            azharstuition685607@gmail.com
          </a>
        </div>

      </div>

      {/* ── Bottom bar ────────────────────────────────── */}
      <div className={styles.bottom}>
        <p className={styles.copy}>
          © {new Date().getFullYear()} Azhar's Tuition Centre. All rights reserved.
        </p>
        <p className={styles.credit}>
          Built with ❤️ in Kerala
        </p>
      </div>

    </footer>
  );
}