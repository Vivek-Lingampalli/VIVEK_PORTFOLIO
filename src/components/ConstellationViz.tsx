import React, { useRef, useEffect, useCallback } from 'react';
import styles from './ConstellationViz.module.css';

/* ─── Types ─── */
interface Node {
  id: number;
  x: number; // 0-1 fraction of canvas
  y: number;
  label: string;
  category: 'secops' | 'netsec' | 'cloud' | 'monitoring' | 'automation';
  radius: number;
}

interface Connection {
  from: number;
  to: number;
}

interface Particle {
  connectionIndex: number;
  t: number; // 0-1 progress along connection
  speed: number;
  size: number;
}

/* ─── Category Colors ─── */
const CATEGORY_COLORS: Record<Node['category'], { main: string; glow: string; rgb: string }> = {
  secops:     { main: '#6366f1', glow: 'rgba(99,102,241,0.5)',  rgb: '99,102,241' },
  netsec:     { main: '#8b5cf6', glow: 'rgba(139,92,246,0.5)',  rgb: '139,92,246' },
  cloud:      { main: '#06b6d4', glow: 'rgba(6,182,212,0.5)',   rgb: '6,182,212' },
  monitoring: { main: '#10b981', glow: 'rgba(16,185,129,0.5)',   rgb: '16,185,129' },
  automation: { main: '#f59e0b', glow: 'rgba(245,158,11,0.5)',   rgb: '245,158,11' },
};

const CATEGORY_LABELS: Record<Node['category'], string> = {
  secops: 'Security Ops',
  netsec: 'Network Security',
  cloud: 'Cloud Security',
  monitoring: 'SIEM & Monitoring',
  automation: 'Automation & Tools',
};

/* ─── Nodes — positions as fractions of canvas ─── */
const NODES: Node[] = [
  // Security Operations (indigo)
  { id: 1,  x: 0.08, y: 0.18, label: 'SOC',              category: 'secops',     radius: 24 },
  { id: 2,  x: 0.20, y: 0.30, label: 'Threat Detection',  category: 'secops',     radius: 20 },
  { id: 3,  x: 0.06, y: 0.48, label: 'MITRE ATT&CK',     category: 'secops',     radius: 18 },
  { id: 4,  x: 0.18, y: 0.58, label: 'Incident Response', category: 'secops',     radius: 20 },

  // Network Security (violet)
  { id: 5,  x: 0.35, y: 0.12, label: 'Palo Alto',         category: 'netsec',     radius: 22 },
  { id: 6,  x: 0.45, y: 0.28, label: 'Zero Trust',        category: 'netsec',     radius: 26 },
  { id: 7,  x: 0.30, y: 0.42, label: 'IDS / IPS',         category: 'netsec',     radius: 18 },
  { id: 8,  x: 0.42, y: 0.55, label: 'Zscaler',           category: 'netsec',     radius: 20 },
  { id: 9,  x: 0.28, y: 0.72, label: 'VPN / NAC',         category: 'netsec',     radius: 18 },

  // Cloud Security (cyan)
  { id: 10, x: 0.60, y: 0.15, label: 'AWS Security',      category: 'cloud',      radius: 24 },
  { id: 11, x: 0.72, y: 0.30, label: 'Azure Sentinel',    category: 'cloud',      radius: 20 },
  { id: 12, x: 0.58, y: 0.45, label: 'GCP Security',      category: 'cloud',      radius: 18 },
  { id: 13, x: 0.68, y: 0.60, label: 'Cloud Armor',       category: 'cloud',      radius: 18 },

  // SIEM & Monitoring (emerald)
  { id: 14, x: 0.88, y: 0.20, label: 'Splunk',            category: 'monitoring', radius: 26 },
  { id: 15, x: 0.92, y: 0.42, label: 'QRadar',            category: 'monitoring', radius: 20 },
  { id: 16, x: 0.82, y: 0.55, label: 'FortiSIEM',         category: 'monitoring', radius: 18 },

  // Automation & Tools (amber)
  { id: 17, x: 0.48, y: 0.78, label: 'Terraform',         category: 'automation', radius: 22 },
  { id: 18, x: 0.62, y: 0.82, label: 'Ansible',           category: 'automation', radius: 20 },
  { id: 19, x: 0.35, y: 0.88, label: 'Python',            category: 'automation', radius: 24 },
  { id: 20, x: 0.78, y: 0.78, label: 'CyberArk',          category: 'automation', radius: 20 },
];

/* ─── Connections ─── */
const CONNECTIONS: Connection[] = [
  // SecOps cluster
  { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }, { from: 1, to: 4 },
  // SecOps → NetSec
  { from: 2, to: 6 }, { from: 2, to: 7 }, { from: 4, to: 7 },
  // NetSec cluster
  { from: 5, to: 6 }, { from: 6, to: 7 }, { from: 7, to: 8 }, { from: 8, to: 9 }, { from: 5, to: 7 },
  // NetSec → Cloud
  { from: 6, to: 10 }, { from: 6, to: 12 }, { from: 8, to: 12 },
  // Cloud cluster
  { from: 10, to: 11 }, { from: 11, to: 12 }, { from: 12, to: 13 }, { from: 10, to: 12 },
  // Cloud → Monitoring
  { from: 10, to: 14 }, { from: 11, to: 14 }, { from: 11, to: 15 }, { from: 12, to: 16 },
  // Monitoring cluster
  { from: 14, to: 15 }, { from: 15, to: 16 },
  // Automation cluster
  { from: 17, to: 18 }, { from: 18, to: 19 }, { from: 17, to: 19 }, { from: 18, to: 20 },
  // Automation → others
  { from: 9, to: 19 }, { from: 9, to: 17 }, { from: 13, to: 20 }, { from: 13, to: 17 },
  { from: 16, to: 20 }, { from: 8, to: 17 },
];

/* ─── Component ─── */
export default function ConstellationViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  // Initialize particles
  const initParticles = useCallback(() => {
    const particles: Particle[] = [];
    for (let i = 0; i < CONNECTIONS.length; i++) {
      const count = Math.random() > 0.5 ? 2 : 1;
      for (let j = 0; j < count; j++) {
        particles.push({
          connectionIndex: i,
          t: Math.random(),
          speed: 0.001 + Math.random() * 0.002,
          size: 1.5 + Math.random() * 1.5,
        });
      }
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    initParticles();

    // Resize
    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking
    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    container.addEventListener('mousemove', handleMouse);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    let startTime = performance.now();

    const draw = (timestamp: number) => {
      const elapsed = (timestamp - startTime) / 1000;
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, w, h);

      // Get actual node positions
      const positions = NODES.map(n => ({
        x: n.x * w,
        y: n.y * h,
      }));

      // ─── Draw connections ───
      CONNECTIONS.forEach((conn) => {
        const fromNode = NODES.find(n => n.id === conn.from)!;
        const toNode = NODES.find(n => n.id === conn.to)!;
        const fromPos = positions[NODES.indexOf(fromNode)];
        const toPos = positions[NODES.indexOf(toNode)];

        // Mid-point for proximity check
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;
        const distMouse = Math.hypot(mx - midX, my - midY);
        const proximity = Math.max(0, 1 - distMouse / 200);

        const alpha = 0.06 + proximity * 0.2;
        const color = CATEGORY_COLORS[fromNode.category];

        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.strokeStyle = `rgba(${color.rgb}, ${alpha})`;
        ctx.lineWidth = 1 + proximity * 1;
        ctx.stroke();
      });

      // ─── Draw particles ───
      particlesRef.current.forEach(particle => {
        particle.t += particle.speed;
        if (particle.t > 1) particle.t -= 1;

        const conn = CONNECTIONS[particle.connectionIndex];
        const fromNode = NODES.find(n => n.id === conn.from)!;
        const toNode = NODES.find(n => n.id === conn.to)!;
        const fromPos = positions[NODES.indexOf(fromNode)];
        const toPos = positions[NODES.indexOf(toNode)];

        const px = fromPos.x + (toPos.x - fromPos.x) * particle.t;
        const py = fromPos.y + (toPos.y - fromPos.y) * particle.t;

        const distMouse = Math.hypot(mx - px, my - py);
        const proximity = Math.max(0, 1 - distMouse / 200);

        const color = CATEGORY_COLORS[fromNode.category];
        const alpha = 0.3 + proximity * 0.5;

        ctx.beginPath();
        ctx.arc(px, py, particle.size + proximity * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.rgb}, ${alpha})`;
        ctx.fill();
      });

      // ─── Draw nodes ───
      NODES.forEach((node, i) => {
        const pos = positions[i];
        const color = CATEGORY_COLORS[node.category];

        // Mouse proximity
        const dist = Math.hypot(mx - pos.x, my - pos.y);
        const proximity = Math.max(0, 1 - dist / 180);

        // Breathing animation
        const breath = Math.sin(elapsed * 1.5 + node.id * 0.7) * 0.15;
        const scale = 1 + breath + proximity * 0.3;
        const r = node.radius * scale;

        // Outer glow
        if (proximity > 0.05) {
          const glowGrad = ctx.createRadialGradient(pos.x, pos.y, r, pos.x, pos.y, r * 3);
          glowGrad.addColorStop(0, `rgba(${color.rgb}, ${0.2 * proximity})`);
          glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, r * 3, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();
        }

        // Node body
        const grad = ctx.createRadialGradient(pos.x - r * 0.3, pos.y - r * 0.3, 0, pos.x, pos.y, r);
        grad.addColorStop(0, `rgba(${color.rgb}, ${0.35 + proximity * 0.4})`);
        grad.addColorStop(1, `rgba(${color.rgb}, ${0.08 + proximity * 0.15})`);

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Border
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${color.rgb}, ${0.3 + proximity * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        const labelAlpha = 0.5 + proximity * 0.5;
        const fontSize = Math.min(11 + proximity * 3, 14);
        ctx.font = `500 ${fontSize}px Inter, -apple-system, sans-serif`;
        ctx.fillStyle = `rgba(226,232,240, ${labelAlpha})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, pos.x, pos.y);
      });

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', handleMouse);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [initParticles]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container} ref={containerRef}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
      {/* Legend */}
      <div className={styles.legend}>
        {(Object.keys(CATEGORY_LABELS) as Node['category'][]).map(cat => (
          <div key={cat} className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ background: CATEGORY_COLORS[cat].main }}
            />
            <span className={styles.legendLabel}>{CATEGORY_LABELS[cat]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
