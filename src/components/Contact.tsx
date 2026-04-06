import React, { useEffect, useRef } from 'react';
import styles from './Contact.module.css';

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.15 }
    );
    const els = sectionRef.current?.querySelectorAll('.reveal');
    els?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" className={styles.section} ref={sectionRef}>
      <div className="container">
        <div className={`${styles.header} reveal`}>
          <span className={styles.label}>Contact</span>
          <h2 className={styles.heading}>
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <p className={styles.subtitle}>
            Open to cybersecurity roles, consulting, and collaboration opportunities.
          </p>
        </div>

        <div className={`${styles.grid} reveal`}>
          <a href="mailto:Vivekling07@gmail.com" className={styles.contactCard}>
            <div className={styles.contactIcon}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="2" y="4" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2 7l8.16 5.44a2 2 0 002.18 0L20 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3>Email</h3>
              <p>Vivekling07@gmail.com</p>
            </div>
          </a>

          <a href="tel:+15516979927" className={styles.contactCard}>
            <div className={styles.contactIcon}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M14.05 2a9 9 0 016 6m-2.8-3.2a5 5 0 013.3 3.3M5 4H8l2 5-2.5 1.5A11 11 0 0012.5 15L14 12.5l5 2V17a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3>Phone</h3>
              <p>+1 (551) 697-9927</p>
            </div>
          </a>

          <div className={styles.contactCard}>
            <div className={styles.contactIcon}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 12a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 21c4-4 8-7.58 8-11a8 8 0 10-16 0c0 3.42 4 7 8 11z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <div>
              <h3>Location</h3>
              <p>New York, USA</p>
            </div>
          </div>
        </div>

        <div className={`${styles.cta} reveal`}>
          <div className={styles.ctaContent}>
            <h3>Ready to strengthen your security posture?</h3>
            <p>Let&apos;s discuss how I can help protect your infrastructure.</p>
            <a href="mailto:Vivekling07@gmail.com" className={styles.ctaBtn}>
              Send a Message
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
