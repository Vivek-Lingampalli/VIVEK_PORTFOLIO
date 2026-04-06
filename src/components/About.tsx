import React, { useEffect, useRef } from 'react';
import styles from './About.module.css';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    const els = sectionRef.current?.querySelectorAll('.reveal');
    els?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className={styles.section} ref={sectionRef}>
      <div className={styles.gradientOrb1} />
      <div className={styles.gradientOrb2} />
      <div className={styles.gradientOrb3} />
      <div className={styles.meshLine} />
      <div className="container">
        <div className={`${styles.header} reveal`}>
          <span className={styles.label}>About Me</span>
          <h2 className={styles.heading}>
            Securing Digital <span className="gradient-text">Frontiers</span>
          </h2>
        </div>

        <div className={`${styles.grid} reveal`}>
          <div className={styles.bio}>
            <p>
              Cybersecurity Engineer with <strong>5+ years</strong> of experience securing
              and managing enterprise, financial, and hybrid cloud infrastructures. I specialize
              in <strong>Zero Trust architecture</strong>, firewall &amp; VPN management, DNS/DDI
              platforms, routing, switching, and network segmentation.
            </p>
            <p>
              Hands-on with Terraform, Ansible, Python, Zscaler ZTNA/Proxy, Trellix IPS,
              Imperva DAM/WAF, Symantec Endpoint Security, and core networking technologies.
              Currently protecting enterprise networks at <strong>JPMorgan Chase</strong>.
            </p>

            <div className={styles.education}>
              <div className={styles.eduIcon}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L1 7l9 5 9-5-9-5zM4 9.5v4.5c0 1.1 2.7 2 6 2s6-.9 6-2V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h4>Master of Science in Cyber Security</h4>
                <p>Yeshiva University, New York &mdash; 3.7 GPA</p>
              </div>
            </div>
          </div>

          <div className={styles.highlights}>
            {[
              {
                icon: '🛡️',
                title: 'Zero Trust Architecture',
                desc: 'Designed network segmentation across hybrid cloud & on-prem, reducing lateral movement risk by 40%',
              },
              {
                icon: '⚡',
                title: 'Security Automation',
                desc: 'Automated firewall policy provisioning with Terraform & Ansible, cutting deployment errors by 70%',
              },
              {
                icon: '🔍',
                title: 'Threat Detection',
                desc: 'Developed Splunk detections mapped to MITRE ATT&CK, increasing coverage of high-risk TTPs by 32%',
              },
              {
                icon: '☁️',
                title: 'Cloud Security',
                desc: 'Integrated AWS/Azure policy-as-code guardrails, blocking 90% of non-compliant deployments',
              },
            ].map((item, i) => (
              <div key={i} className={styles.highlightCard}>
                <span className={styles.highlightIcon}>{item.icon}</span>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
