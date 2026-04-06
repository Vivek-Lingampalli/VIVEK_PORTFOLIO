import React, { useEffect, useRef } from 'react';
import styles from './Certifications.module.css';

const CERTS = [
  {
    name: 'CompTIA Security+',
    issuer: 'CompTIA',
    color: '#6366f1',
  },
  {
    name: 'Certified Ethical Hacker',
    issuer: 'EC-Council',
    color: '#8b5cf6',
  },
  {
    name: 'AWS Certified Cloud Security',
    issuer: 'Amazon Web Services',
    color: '#06b6d4',
  },
  {
    name: 'Infoblox DNS Infrastructure Security',
    issuer: 'Infoblox',
    color: '#10b981',
  },
  {
    name: 'Certified Information Security Manager',
    issuer: 'ISACA',
    color: '#f59e0b',
  },
];

export default function Certifications() {
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
    <section id="certifications" className={styles.section} ref={sectionRef}>
      <div className="container">
        <div className={`${styles.header} reveal`}>
          <span className={styles.label}>Certifications</span>
          <h2 className={styles.heading}>
            Professional <span className="gradient-text">Credentials</span>
          </h2>
        </div>

        <div className={`${styles.grid} reveal`}>
          {CERTS.map((cert, i) => (
            <div
              key={i}
              className={styles.card}
              style={{ '--accent': cert.color } as React.CSSProperties}
            >
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 15l-3.5 2 .67-3.9L6 10.1l3.9-.57L12 6l2.1 3.53 3.9.57-2.83 2.83.67 3.9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className={styles.certName}>{cert.name}</h3>
              <p className={styles.certIssuer}>{cert.issuer}</p>
              <div className={styles.cardGlow} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
