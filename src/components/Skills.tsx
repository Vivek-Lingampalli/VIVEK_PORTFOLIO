import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import styles from './Skills.module.css';

const ConstellationViz = dynamic(() => import('./ConstellationViz'), { ssr: false });

const SKILL_GROUPS = [
  {
    title: 'SOC / Security Operations',
    skills: ['SOC Operations', 'Threat Detection & Incident Response', 'MITRE ATT&CK', 'Threat Intelligence', 'Log Analysis', 'Packet Analysis'],
  },
  {
    title: 'Identity & Zero Trust',
    skills: ['Azure AD (Entra ID)', 'RBAC / MFA / SSO', 'Conditional Access', 'CyberArk PAM', 'Azure AD Connect'],
  },
  {
    title: 'SIEM Platforms',
    skills: ['Splunk', 'IBM QRadar', 'ArcSight', 'FortiSIEM', 'RSA Archer', 'LogRhythm'],
  },
  {
    title: 'Cloud Security',
    skills: ['AWS GuardDuty / Security Hub', 'Azure Sentinel / Defender', 'GCP Security Command Center', 'Cloud Armor', 'Chronicle SIEM'],
  },
  {
    title: 'Network Security',
    skills: ['Palo Alto NGFW', 'Zscaler ZIA/ZTNA', 'IDS/IPS', 'OSPF / BGP', 'VLANs / STP', 'NAC'],
  },
  {
    title: 'Automation & Compliance',
    skills: ['Terraform', 'Ansible', 'Python', 'NIST / FIPS', 'HIPAA / PCI-DSS', 'ISO 27001'],
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.05 }
    );
    const els = sectionRef.current?.querySelectorAll('.reveal');
    els?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className={styles.section} ref={sectionRef}>
      <div className="container">
        <div className={`${styles.header} reveal`}>
          <span className={styles.label}>Skills</span>
          <h2 className={styles.heading}>
            Technical <span className="gradient-text">Constellation</span>
          </h2>
          <p className={styles.subtitle}>
            Hover over the constellation to explore my technical expertise across security domains.
          </p>
        </div>

        <div className={`reveal`}>
          <ConstellationViz />
        </div>

        <div className={`${styles.grid} reveal`}>
          {SKILL_GROUPS.map((group, i) => (
            <div key={i} className={styles.group}>
              <h3 className={styles.groupTitle}>{group.title}</h3>
              <div className={styles.skillTags}>
                {group.skills.map((skill, j) => (
                  <span key={j} className={styles.skillTag}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
