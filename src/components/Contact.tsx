"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  ChevronDown, Send, Phone, Mail, MapPin, MessageCircle,
  Users, BookOpen, BarChart2, GraduationCap, CalendarCheck,
  type LucideIcon,
} from "lucide-react";
import styles from "./Contact.module.css";

interface Faq {
  q: string;
  a: string;
  icon: LucideIcon;
}

const faqs: Faq[] = [
  {
    q: "What is the batch size?",
    a: "We cap every batch at 12 students to guarantee personalised attention. Smaller groups mean more direct interaction with the faculty and faster doubt resolution.",
    icon: Users,
  },
  {
    q: "Do you provide study materials?",
    a: "Yes — comprehensive printed study materials, digital notes, and a curated test-series are all included in the fee. No hidden extras.",
    icon: BookOpen,
  },
  {
    q: "How can I track my child's progress?",
    a: "We share detailed monthly performance reports and hold regular parent-teacher sessions. A real-time progress dashboard is also available on request.",
    icon: BarChart2,
  },
  {
    q: "Which boards do you cover?",
    a: "We cover CBSE, ICSE and Kerala State Board for classes 8 through 12, along with competitive exam preparation for JEE, NEET and PSC.",
    icon: GraduationCap,
  },
  {
    q: "Are demo classes available?",
    a: "Absolutely. Every new student is welcome to attend a free demo session before enrolling. Just fill out the contact form and we'll schedule one.",
    icon: CalendarCheck,
  },
];

const contactDetails = [
  { icon: Phone,       label: "Call us",      value: "+91 85901 41812",          href: "tel:+91 85901 41812" },
  { icon: Mail,        label: "Email us",     value: "azharstuition685607@gmail.com",    href: "mailto:azharstuition685607@gmail.com" },
  { icon: MapPin,      label: "Visit us",     value: "Aluva, Kerala, India",     href: "#" },
  { icon: MessageCircle, label: "WhatsApp",   value: "Chat with us",             href: "https://wa.me/918590141812" },
];

export default function Contact() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contact" ref={sectionRef} className={styles.section}>
      {/* Parallax blobs */}
      <motion.div className={styles.blobs} style={{ y: bgY }} aria-hidden>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
      </motion.div>
      <div className={styles.gridBg} aria-hidden />

      <div className={styles.inner}>

        {/* ── Header ─────────────────────────────────────────────────── */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className={styles.eyebrow}>Contact & FAQ</p>
          <h2 className={styles.heading}>
            Let's start your{" "}
            <span className={styles.accent}>learning journey</span>
          </h2>
          <p className={styles.sub}>
            Have a question? Browse the FAQs or drop us a message — we respond within 24 hours.
          </p>
        </motion.div>

        {/* ── Two-col grid ───────────────────────────────────────────── */}
        <div className={styles.grid}>

          {/* LEFT — FAQ */}
          <motion.div
            className={styles.faqCol}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className={styles.colLabel}>Common Questions</p>

            <div className={styles.faqList}>
              {faqs.map((faq, i) => {
                const open = activeFaq === i;
                return (
                  <motion.div
                    key={i}
                    className={`${styles.faqItem} ${open ? styles.faqOpen : ""}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <button
                      className={styles.faqQ}
                      onClick={() => setActiveFaq(open ? null : i)}
                      aria-expanded={open}
                    >
                      <span className={styles.faqEmoji}>
                        <faq.icon size={16} />
                      </span>
                      <span className={styles.faqText}>{faq.q}</span>
                      <motion.span
                        className={styles.faqChevron}
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={18} />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          key="answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: "hidden" }}
                        >
                          <p className={styles.faqA}>{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Contact detail pills */}
            <div className={styles.contactPills}>
              {contactDetails.map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} className={styles.pill} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  <span className={styles.pillIcon}><Icon size={15} /></span>
                  <span className={styles.pillContent}>
                    <span className={styles.pillLabel}>{label}</span>
                    <span className={styles.pillValue}>{value}</span>
                  </span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Form */}
          <motion.div
            className={styles.formCol}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Accent bar */}
            <div className={styles.formAccentBar} />

            <p className={styles.colLabel}>Send a Message</p>
            <h3 className={styles.formTitle}>Get in touch</h3>
            <p className={styles.formSub}>
              Fill out the form and our team will get back to you within 24 hours.
            </p>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {/* Name + Phone row */}
              <div className={styles.row}>
                <div className={`${styles.field} ${focused === "name" ? styles.fieldFocused : ""}`}>
                  <label className={styles.label} htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g. Rahul Menon"
                    required
                    className={styles.input}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                  />
                </div>
                <div className={`${styles.field} ${focused === "phone" ? styles.fieldFocused : ""}`}>
                  <label className={styles.label} htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+91 85901 41812"
                    required
                    className={styles.input}
                    onFocus={() => setFocused("phone")}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className={`${styles.field} ${focused === "email" ? styles.fieldFocused : ""}`}>
                <label className={styles.label} htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className={styles.input}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                />
              </div>

              {/* Class / Board row */}
              <div className={styles.row}>
                <div className={`${styles.field} ${focused === "class" ? styles.fieldFocused : ""}`}>
                  <label className={styles.label} htmlFor="class">Class</label>
                  <select
                    id="class"
                    className={styles.input}
                    onFocus={() => setFocused("class")}
                    onBlur={() => setFocused(null)}
                  >
                    <option value="">Select class</option>
                    {["8", "9", "10", "11", "12"].map((c) => (
                      <option key={c} value={c}>Class {c}</option>
                    ))}
                  </select>
                </div>
                <div className={`${styles.field} ${focused === "board" ? styles.fieldFocused : ""}`}>
                  <label className={styles.label} htmlFor="board">Board</label>
                  <select
                    id="board"
                    className={styles.input}
                    onFocus={() => setFocused("board")}
                    onBlur={() => setFocused(null)}
                  >
                    <option value="">Select board</option>
                    {["CBSE", "ICSE", "Kerala State"].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className={`${styles.field} ${focused === "msg" ? styles.fieldFocused : ""}`}>
                <label className={styles.label} htmlFor="msg">Message <span className={styles.optional}>(optional)</span></label>
                <textarea
                  id="msg"
                  placeholder="Any specific subjects, doubts or questions…"
                  rows={4}
                  className={`${styles.input} ${styles.textarea}`}
                  onFocus={() => setFocused("msg")}
                  onBlur={() => setFocused(null)}
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                className={styles.submitBtn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.span
                      key="sent"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className={styles.sentMsg}
                    >
                      ✓ Message sent!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="send"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className={styles.sendContent}
                    >
                      Send Message <Send size={16} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}