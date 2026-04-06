import React, { useEffect, useRef } from 'react';
import styles from './Experience.module.css';

interface ExperienceItem {
  company: string;
  client?: string;
  role: string;
  location: string;
  period: string;
  highlights: string[];
  tags: string[];
}

const EXPERIENCES: ExperienceItem[] = [
  {
    company: 'JPMorgan Chase',
    role: 'Cyber Security Engineer',
    location: 'New York',
    period: 'Sep 2024 — Present',
    highlights: [
      'Conduct cybersecurity assessments of JPMC Enterprise Networks including General Support Systems for A&A',
      'Execute Risk Management Framework (RMF) aligned with DoD Instruction 8510.01, NIST SP Rev 4',
      'Develop and implement DISA STIG Test Plans to assess security features within accreditation boundary',
      'Perform ACAS security scans to evaluate network devices, applications, and OS for STIG compliance',
      'Review firewall policies, IPS/IDS configurations ensuring FIPS 140-2 compliance',
      'Engineered CyberArk PAM solutions for privileged account governance and secure access workflows',
    ],
    tags: ['RMF', 'NIST', 'CyberArk', 'ACAS', 'STIG', 'FIPS 140-2'],
  },
  {
    company: 'AT&T',
    role: 'Cyber Security Engineer',
    location: 'New York',
    period: 'Nov 2023 — Aug 2024',
    highlights: [
      'Designed Zero Trust network segmentation across hybrid cloud & on-prem, reducing lateral movement risk by 40%',
      'Automated Palo Alto NGFW policy provisioning with Terraform & Ansible, cutting deployment errors by 70%',
      'Deployed Zscaler Internet Access (ZIA) as secure web proxy, blocking 95% of malicious traffic',
      'Developed Splunk detections mapped to MITRE ATT&CK, increasing detection coverage by 32%',
      'Integrated AWS/Azure policy-as-code guardrails, blocking 90% of non-compliant cloud deployments',
      'Directed vulnerability remediation for 5,000+ assets, achieving >95% SLA compliance',
    ],
    tags: ['Zero Trust', 'Terraform', 'Splunk', 'Zscaler', 'Palo Alto', 'MITRE ATT&CK'],
  },
  {
    company: 'Meta Infotech',
    role: 'Cyber Security Engineer',
    location: 'India',
    period: 'Dec 2022 — Jul 2023',
    highlights: [
      'Designed network security architectures with firewalls, IDS/IPS, and secure segmentation',
      'Led deployment and tuning of network security controls to prevent unauthorized access and data exfiltration',
      'Engineered data protection strategies using Symantec and RSA DLP across endpoints and networks',
      'Integrated security telemetry into SIEM platforms for centralized monitoring and incident investigation',
    ],
    tags: ['IDS/IPS', 'DLP', 'SIEM', 'Network Security'],
  },
  {
    company: 'Dolf Technologies',
    role: 'Cyber Security Analyst',
    location: 'India',
    period: 'Jan 2019 — Nov 2022',
    highlights: [
      'Installed and maintained enterprise security infrastructure including firewalls, SIEM, and endpoint protection',
      'Designed VPN architectures ensuring encrypted connectivity and access control policy adherence',
      'Conducted risk assessments and vulnerability reviews to identify security gaps',
      'Collaborated with infrastructure and network teams to resolve security issues impacting availability',
    ],
    tags: ['Firewalls', 'SIEM', 'VPN', 'Risk Assessment', 'Endpoint Security'],
  },
];

export default function Experience() {
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
      { threshold: 0.05 }
    );
    const els = sectionRef.current?.querySelectorAll('.reveal');
    els?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" className={styles.section} ref={sectionRef}>
      <div className="container">
        <div className={`${styles.header} reveal`}>
          <span className={styles.label}>Experience</span>
          <h2 className={styles.heading}>
            Professional <span className="gradient-text">Journey</span>
          </h2>
        </div>

        <div className={styles.timeline}>
          {EXPERIENCES.map((exp, i) => (
            <div key={i} className={`${styles.timelineItem} reveal`}>
              <div className={styles.timelineLine}>
                <div className={styles.timelineDot} />
              </div>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.company}>{exp.company}</h3>
                    <p className={styles.role}>{exp.role}</p>
                  </div>
                  <div className={styles.meta}>
                    <span className={styles.period}>{exp.period}</span>
                    <span className={styles.location}>{exp.location}</span>
                  </div>
                </div>
                <ul className={styles.highlights}>
                  {exp.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
                <div className={styles.tags}>
                  {exp.tags.map((tag, j) => (
                    <span key={j} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
