import React, { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    setTitleVisible(true);
  }, []);

  // Neural network animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    interface Node {
      x: number; y: number; vx: number; vy: number;
      radius: number; baseAlpha: number; pulseOffset: number;
      color: number; // 0=indigo, 1=cyan, 2=violet
    }

    interface Pulse {
      fromIdx: number; toIdx: number; progress: number; speed: number; color: number;
    }

    const CONNECTION_DIST = 200;
    const NODE_COUNT = 90;
    const PULSE_CHANCE = 0.003;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let w = 0, h = 0;
    let mouseX = -1000, mouseY = -1000;

    const colors = [
      [99, 102, 241],   // indigo
      [6, 182, 212],    // cyan
      [139, 92, 246],   // violet
    ];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      nodes = [];
      pulses = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1,
          baseAlpha: Math.random() * 0.5 + 0.3,
          pulseOffset: Math.random() * Math.PI * 2,
          color: Math.floor(Math.random() * 3),
        });
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouse);

    let frame: number;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const time = t * 0.001;

      // Move nodes
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        // Gentle mouse repulsion
        const dx = n.x - mouseX, dy = n.y - mouseY;
        const md = Math.sqrt(dx * dx + dy * dy);
        if (md < 150 && md > 0) {
          const force = (150 - md) / 150 * 0.8;
          n.vx += (dx / md) * force * 0.05;
          n.vy += (dy / md) * force * 0.05;
        }
        // Dampen velocity
        n.vx *= 0.998; n.vy *= 0.998;
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
            const c = colors[a.color];
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();

            // Spawn pulse
            if (Math.random() < PULSE_CHANCE) {
              pulses.push({
                fromIdx: i, toIdx: j,
                progress: 0, speed: 0.008 + Math.random() * 0.012,
                color: a.color,
              });
            }
          }
        }
      }

      // Draw pulses (data traveling along connections)
      pulses = pulses.filter(p => {
        p.progress += p.speed;
        if (p.progress > 1) return false;
        const a = nodes[p.fromIdx], b = nodes[p.toIdx];
        const px = a.x + (b.x - a.x) * p.progress;
        const py = a.y + (b.y - a.y) * p.progress;
        const c = colors[p.color];
        const glow = ctx.createRadialGradient(px, py, 0, px, py, 6);
        glow.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},0.8)`);
        glow.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        return true;
      });

      // Draw nodes
      nodes.forEach(n => {
        const pulse = Math.sin(time * 2 + n.pulseOffset) * 0.3 + 0.7;
        const alpha = n.baseAlpha * pulse;
        const c = colors[n.color];

        // Glow
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius * 4);
        glow.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${alpha * 0.4})`);
        glow.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
        ctx.fill();
      });

      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <section id="home" className={styles.hero}>
      <canvas ref={canvasRef} className={styles.starfield} />
      <div className={styles.gradientOrb} />
      <div className={styles.gradientOrb2} />

      <div className={`${styles.content} ${titleVisible ? styles.visible : ''}`}>
        <h1 className={styles.title}>
          <span className={styles.greeting}>Hello, I&apos;m</span>
          <span className={styles.name}>
            Vivek <span className="gradient-text">Lingampalli</span>
          </span>
        </h1>

        <p className={styles.subtitle}>Cyber Security Engineer</p>

        <p className={styles.description}>
          5+ years securing enterprise, financial &amp; hybrid cloud infrastructures.
          Specialized in Zero Trust architecture, SIEM engineering, and security automation.
        </p>

        <div className={styles.actions}>
          <a href="#experience" className={styles.btnPrimary}>
            View Experience
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#contact" className={styles.btnSecondary}>
            Get in Touch
          </a>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>5+</span>
            <span className={styles.statLabel}>Years Experience</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>4</span>
            <span className={styles.statLabel}>Enterprise Clients</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>5</span>
            <span className={styles.statLabel}>Certifications</span>
          </div>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <div className={styles.scrollMouse}>
          <div className={styles.scrollDot} />
        </div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
}
