import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <span className={styles.logo}>V<span className="gradient-text">L</span></span>
            <p className={styles.tagline}>
              Securing digital frontiers with precision and expertise.
            </p>
          </div>

          <nav className={styles.nav}>
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#experience">Experience</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className={styles.social}>
            <h4>Connect</h4>
            <a href="mailto:Vivekling07@gmail.com">Email</a>
            <a href="https://www.linkedin.com/in/vivek-lingampalli" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/Vivek-Lingampalli" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} Vivek Lingampalli. All rights reserved.</p>
          <p className={styles.credit}>Designed with precision &amp; purpose.</p>
        </div>
      </div>
    </footer>
  );
}
