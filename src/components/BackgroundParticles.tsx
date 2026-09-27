import React, { useEffect, useRef } from 'react';

interface PlexusNode {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  glowColor: string;
  alpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  isHub: boolean;
  hubRingRadius: number;
  hubRingAlpha: number;
}

interface SignalPacket {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
}

interface GeometricShape {
  x: number;
  y: number;
  z: number;
  size: number;
  vx: number;
  vy: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  vRotX: number;
  vRotY: number;
  vRotZ: number;
  type: 'cube' | 'octahedron' | 'tetrahedron' | 'diamond';
  color: string;
  alpha: number;
}

interface SkyscraperWindow {
  relX: number;
  relY: number;
  w: number;
  h: number;
  isLit: boolean;
  color: string;
  pulseOffset: number;
}

interface Skyscraper {
  x: number;
  width: number;
  height: number;
  layer: number; // 0 = distant silhouette, 1 = midground, 2 = hero foreground
  roofType: 'spire' | 'stepped' | 'antenna' | 'diagonal' | 'flat_helipad' | 'arch';
  neonTrimColor: string;
  glowColor: string;
  windowType: 'grid' | 'vertical_bars' | 'horizontal_bands' | 'cyber_matrix';
  windows: SkyscraperWindow[];
  antennaHeight: number;
  beaconColor: string;
  beaconPhase: number;
  beaconSpeed: number;
  hasSearchlight: boolean;
  searchlightBaseAngle: number;
  searchlightSpeed: number;
  searchlightColor: string;
  trussStyle: 'cross' | 'horizontal' | 'chevron' | 'none';
}

export const BackgroundParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse coordinates for gentle interactive attraction
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 200,
      isActive: false
    };

    let skyscrapers: Skyscraper[] = [];

    // Helper to generate futuristic procedural skyscrapers with slow lighting
    const generateSkyscrapers = (w: number, h: number) => {
      const buildings: Skyscraper[] = [];
      
      const neonTrimPalette = [
        { trim: '#10b981', glow: 'rgba(16, 185, 129, 0.95)', win: 'rgba(110, 231, 183, ' }, // Emerald
        { trim: '#06b6d4', glow: 'rgba(6, 182, 212, 0.95)', win: 'rgba(103, 232, 249, ' },  // Cyan
        { trim: '#34d399', glow: 'rgba(52, 211, 153, 0.95)', win: 'rgba(167, 243, 208, ' }, // Cyber Mint
        { trim: '#f59e0b', glow: 'rgba(245, 158, 11, 0.95)', win: 'rgba(253, 230, 138, ' },  // Amber Gold
        { trim: '#ef4444', glow: 'rgba(239, 68, 68, 0.95)', win: 'rgba(252, 165, 165, ' },  // Ruby Red
      ];

      // LAYER 0: Distant Background Silhouette Towers (dense, tall, atmospheric)
      let currentX = -30;
      while (currentX < w + 60) {
        const bWidth = Math.random() * 55 + 50;
        const bHeight = Math.random() * (h * 0.42) + (h * 0.28);
        const palette = neonTrimPalette[Math.floor(Math.random() * neonTrimPalette.length)];

        buildings.push({
          x: currentX,
          width: bWidth,
          height: bHeight,
          layer: 0,
          roofType: Math.random() > 0.4 ? 'antenna' : 'spire',
          neonTrimColor: palette.trim,
          glowColor: palette.glow,
          windowType: 'grid',
          windows: [],
          antennaHeight: Math.random() * 40 + 20,
          beaconColor: Math.random() > 0.5 ? '#ef4444' : '#10b981',
          beaconPhase: Math.random() * Math.PI * 2,
          beaconSpeed: 0.006 + Math.random() * 0.008, // Slow gentle pulsing
          hasSearchlight: Math.random() < 0.15,
          searchlightBaseAngle: -Math.PI / 2 + (Math.random() - 0.5) * 0.6,
          searchlightSpeed: 0.0012 + Math.random() * 0.0015, // Very slow searchlight sweep
          searchlightColor: palette.glow,
          trussStyle: 'none'
        });

        currentX += bWidth - (Math.random() * 18 + 8);
      }

      // LAYER 1: Midground Cyber Towers with Window Grids & Architecture
      currentX = -20;
      while (currentX < w + 50) {
        const bWidth = Math.random() * 70 + 65;
        const bHeight = Math.random() * (h * 0.38) + (h * 0.20);
        const palette = neonTrimPalette[Math.floor(Math.random() * neonTrimPalette.length)];
        const roofChoices: Array<'spire' | 'stepped' | 'antenna' | 'diagonal' | 'flat_helipad' | 'arch'> = [
          'spire', 'stepped', 'antenna', 'diagonal', 'flat_helipad', 'arch'
        ];
        const roofType = roofChoices[Math.floor(Math.random() * roofChoices.length)];

        // Generate procedural window matrix
        const winList: SkyscraperWindow[] = [];
        const winCols = Math.max(3, Math.floor(bWidth / 14));
        const winRows = Math.max(8, Math.floor(bHeight / 18));
        const colSpacing = bWidth / (winCols + 1);
        const rowSpacing = bHeight / (winRows + 2);

        for (let r = 1; r <= winRows; r++) {
          for (let c = 1; c <= winCols; c++) {
            if (Math.random() > 0.32) {
              winList.push({
                relX: c * colSpacing - 3,
                relY: r * rowSpacing,
                w: Math.random() > 0.5 ? 5 : 3.5,
                h: Math.random() > 0.5 ? 8 : 5,
                isLit: true,
                color: palette.win,
                pulseOffset: Math.random() * Math.PI * 2
              });
            }
          }
        }

        buildings.push({
          x: currentX,
          width: bWidth,
          height: bHeight,
          layer: 1,
          roofType,
          neonTrimColor: palette.trim,
          glowColor: palette.glow,
          windowType: Math.random() > 0.4 ? 'grid' : 'vertical_bars',
          windows: winList,
          antennaHeight: Math.random() * 55 + 25,
          beaconColor: Math.random() > 0.5 ? '#ef4444' : '#34d399',
          beaconPhase: Math.random() * Math.PI * 2,
          beaconSpeed: 0.007 + Math.random() * 0.008, // Slow gentle pulsing
          hasSearchlight: Math.random() < 0.25,
          searchlightBaseAngle: -Math.PI / 2 + (Math.random() - 0.5) * 0.8,
          searchlightSpeed: 0.0010 + Math.random() * 0.0015, // Very slow searchlight sweep
          searchlightColor: palette.glow,
          trussStyle: Math.random() > 0.5 ? 'cross' : 'chevron'
        });

        currentX += bWidth - (Math.random() * 22 + 12);
      }

      // LAYER 2: Foreground Mega-Skyscrapers with High-Intensity Neon Trims & Searchlights
      currentX = 15;
      while (currentX < w + 80) {
        const bWidth = Math.random() * 95 + 85;
        const bHeight = Math.random() * (h * 0.45) + (h * 0.22);
        const palette = neonTrimPalette[Math.floor(Math.random() * neonTrimPalette.length)];
        const roofChoices: Array<'spire' | 'stepped' | 'antenna' | 'diagonal' | 'flat_helipad'> = [
          'spire', 'stepped', 'antenna', 'diagonal', 'flat_helipad'
        ];
        const roofType = roofChoices[Math.floor(Math.random() * roofChoices.length)];

        // Generate procedural high-contrast windows
        const winList: SkyscraperWindow[] = [];
        const winCols = Math.max(4, Math.floor(bWidth / 16));
        const winRows = Math.max(10, Math.floor(bHeight / 20));
        const colSpacing = bWidth / (winCols + 1);
        const rowSpacing = bHeight / (winRows + 2);

        for (let r = 1; r <= winRows; r++) {
          for (let c = 1; c <= winCols; c++) {
            if (Math.random() > 0.38) {
              winList.push({
                relX: c * colSpacing - 4,
                relY: r * rowSpacing,
                w: 6,
                h: 9,
                isLit: true,
                color: palette.win,
                pulseOffset: Math.random() * Math.PI * 2
              });
            }
          }
        }

        buildings.push({
          x: currentX,
          width: bWidth,
          height: bHeight,
          layer: 2,
          roofType,
          neonTrimColor: palette.trim,
          glowColor: palette.glow,
          windowType: 'cyber_matrix',
          windows: winList,
          antennaHeight: Math.random() * 70 + 40,
          beaconColor: '#ef4444',
          beaconPhase: Math.random() * Math.PI * 2,
          beaconSpeed: 0.008 + Math.random() * 0.008, // Slow gentle pulsing
          hasSearchlight: Math.random() < 0.4,
          searchlightBaseAngle: -Math.PI / 2 + (Math.random() - 0.5) * 0.9,
          searchlightSpeed: 0.0009 + Math.random() * 0.0014, // Very slow searchlight sweep
          searchlightColor: palette.glow,
          trussStyle: 'cross'
        });

        currentX += bWidth + (Math.random() * 65 + 35);
      }

      return buildings;
    };

    const handleResize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      skyscrapers = generateSkyscrapers(width, height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isActive = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.isActive = true;
      }
    };

    const handleMouseLeave = () => {
      mouse.isActive = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    handleResize();

    // Palettes for nodes and neon mesh
    const nodePalettes = [
      { fill: '#10b981', glow: 'rgba(16, 185, 129, 0.85)', core: '#6ee7b7' },   // Neon Emerald
      { fill: '#34d399', glow: 'rgba(52, 211, 153, 0.85)', core: '#a7f3d0' },   // Cyber Mint
      { fill: '#06b6d4', glow: 'rgba(6, 182, 212, 0.8)', core: '#67e8f9' },     // Neon Cyan
      { fill: '#f59e0b', glow: 'rgba(245, 158, 11, 0.85)', core: '#fde68a' },   // Amber Gold
      { fill: '#ef4444', glow: 'rgba(239, 68, 68, 0.8)', core: '#fca5a5' },     // Ruby Crimson
    ];

    // Initialize Network Nodes
    const nodeCount = Math.max(35, Math.min(85, Math.floor((width * height) / 18000)));
    const nodes: PlexusNode[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const isHub = i % 9 === 0;
      const palette = isHub 
        ? nodePalettes[i % 2 === 0 ? 0 : 3] // Emerald or Amber for major hubs
        : nodePalettes[Math.floor(Math.random() * nodePalettes.length)];
      
      const x = Math.random() * width;
      const y = Math.random() * height;
      const baseRadius = isHub ? Math.random() * 2.5 + 3.5 : Math.random() * 1.8 + 1.2;

      nodes.push({
        x,
        y,
        originX: x,
        originY: y,
        vx: (Math.random() - 0.5) * 0.2, // Slower gentle drift
        vy: (Math.random() - 0.5) * 0.2,
        radius: baseRadius,
        baseRadius,
        color: palette.fill,
        glowColor: palette.glow,
        alpha: Math.random() * 0.4 + 0.5,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.006, // Slower pulse
        isHub,
        hubRingRadius: baseRadius * 2,
        hubRingAlpha: 0.8
      });
    }

    // Active Traveling Data Signal Packets along Plexus lines (Slow light pulses)
    const signals: SignalPacket[] = [];
    const maxSignals = 12;

    // Geometric 3D wireframe floating polygons
    const shapes: GeometricShape[] = [];
    const shapeCount = Math.max(4, Math.min(8, Math.floor(width / 260)));
    const shapeTypes: Array<'cube' | 'octahedron' | 'tetrahedron' | 'diamond'> = [
      'cube', 'octahedron', 'tetrahedron', 'diamond'
    ];

    for (let i = 0; i < shapeCount; i++) {
      shapes.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.7,
        z: Math.random() * 200 - 100,
        size: Math.random() * 26 + 20,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: (Math.random() - 0.5) * 0.003, // Slow rotation
        vRotY: (Math.random() - 0.5) * 0.003,
        vRotZ: (Math.random() - 0.5) * 0.002,
        type: shapeTypes[i % shapeTypes.length],
        color: i % 3 === 0 ? 'rgba(52, 211, 153, ' : i % 3 === 1 ? 'rgba(245, 158, 11, ' : 'rgba(6, 182, 212, ',
        alpha: Math.random() * 0.18 + 0.10
      });
    }

    // 3D Projection Helper for Geometric Wireframe Shapes
    const project3D = (x: number, y: number, z: number, rx: number, ry: number, rz: number, scale: number) => {
      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;

      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      const x2 = x * cosY + z1 * sinY;
      const z2 = -x * sinY + z1 * cosY;

      const cosZ = Math.cos(rz), sinZ = Math.sin(rz);
      const x3 = x2 * cosZ - y1 * sinZ;
      const y3 = x2 * sinZ + y1 * cosZ;

      const distance = 350;
      const fov = distance / (distance + z2 + 100);
      return {
        x: x3 * scale * fov,
        y: y3 * scale * fov,
        z: z2
      };
    };

    // Draw Geometric 3D Polyhedron
    const drawGeometricShape = (s: GeometricShape) => {
      ctx.save();
      ctx.translate(s.x, s.y);

      let vertices: Array<[number, number, number]> = [];
      let edges: Array<[number, number]> = [];

      if (s.type === 'cube') {
        vertices = [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
          [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
        ];
        edges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7]
        ];
      } else if (s.type === 'octahedron') {
        vertices = [
          [0, -1.3, 0], [0, 1.3, 0],
          [-1, 0, -1], [1, 0, -1], [1, 0, 1], [-1, 0, 1]
        ];
        edges = [
          [0, 2], [0, 3], [0, 4], [0, 5],
          [1, 2], [1, 3], [1, 4], [1, 5],
          [2, 3], [3, 4], [4, 5], [5, 2]
        ];
      } else if (s.type === 'diamond') {
        vertices = [
          [0, -1.4, 0], [0, 1.4, 0],
          [-1.1, 0, 0], [1.1, 0, 0], [0, 0, -1.1], [0, 0, 1.1]
        ];
        edges = [
          [0, 2], [0, 3], [0, 4], [0, 5],
          [1, 2], [1, 3], [1, 4], [1, 5],
          [2, 4], [4, 3], [3, 5], [5, 2]
        ];
      } else { // Tetrahedron
        vertices = [
          [1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]
        ];
        edges = [
          [0, 1], [0, 2], [0, 3],
          [1, 2], [2, 3], [3, 1]
        ];
      }

      const projected = vertices.map(v => 
        project3D(v[0], v[1], v[2], s.rotX, s.rotY, s.rotZ, s.size)
      );

      ctx.beginPath();
      for (const [i, j] of edges) {
        const p1 = projected[i];
        const p2 = projected[j];
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
      }
      ctx.strokeStyle = `${s.color}${s.alpha})`;
      ctx.lineWidth = 1.0;
      ctx.stroke();

      for (const p of projected) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${s.alpha * 1.4})`;
        ctx.fill();
      }

      ctx.restore();
    };

    // Draw Subtle Abstract Geometric Neon Mesh Grid at base
    const drawNeonMeshGrid = (time: number) => {
      const gridSpacingX = Math.max(70, Math.floor(width / 14));
      const gridSpacingY = Math.max(70, Math.floor(height / 12));
      const cols = Math.ceil(width / gridSpacingX) + 1;
      const rows = Math.ceil(height / gridSpacingY) + 1;

      ctx.save();
      ctx.lineWidth = 0.5;

      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        const yBase = r * gridSpacingY;
        for (let c = 0; c < cols; c++) {
          const xBase = c * gridSpacingX;
          const wave = Math.sin(time * 0.0003 + c * 0.4 + r * 0.3) * 10 + 
                       Math.cos(time * 0.0004 + r * 0.5) * 6;
          const y = yBase + wave;
          if (c === 0) {
            ctx.moveTo(xBase, y);
          } else {
            ctx.lineTo(xBase, y);
          }
        }
        const rowAlpha = (0.025 + 0.012 * Math.sin(time * 0.0004 + r * 0.5));
        ctx.strokeStyle = `rgba(16, 185, 129, ${rowAlpha})`;
        ctx.stroke();
      }

      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        const xBase = c * gridSpacingX;
        for (let r = 0; r < rows; r++) {
          const yBase = r * gridSpacingY;
          const wave = Math.sin(time * 0.0003 + c * 0.4 + r * 0.3) * 10 + 
                       Math.cos(time * 0.0004 + r * 0.5) * 6;
          const y = yBase + wave;
          if (r === 0) {
            ctx.moveTo(xBase, y);
          } else {
            ctx.lineTo(xBase, y);
          }
        }
        const colAlpha = (0.022 + 0.012 * Math.cos(time * 0.0003 + c * 0.4));
        ctx.strokeStyle = `rgba(6, 182, 212, ${colAlpha})`;
        ctx.stroke();
      }

      ctx.restore();
    };

    // Draw Glowing Futuristic Neon Skyscrapers (Reduced Opacity by 40% -> 0.60 global multiplier)
    const drawSkyscrapers = (time: number) => {
      ctx.save();
      // Apply exact 40% opacity reduction across all background skyscrapers
      ctx.globalAlpha = 0.60;

      for (const b of skyscrapers) {
        const topY = height - b.height;
        const bWidth = b.width;
        const bX = b.x;

        // Building Body Silhouette Fill with reduced deep tones
        const bodyGradient = ctx.createLinearGradient(0, topY, 0, height);
        if (b.layer === 0) {
          bodyGradient.addColorStop(0, 'rgba(4, 12, 18, 0.55)');
          bodyGradient.addColorStop(1, 'rgba(2, 6, 10, 0.75)');
        } else if (b.layer === 1) {
          bodyGradient.addColorStop(0, 'rgba(6, 18, 24, 0.65)');
          bodyGradient.addColorStop(1, 'rgba(3, 8, 14, 0.85)');
        } else {
          bodyGradient.addColorStop(0, 'rgba(8, 22, 30, 0.75)');
          bodyGradient.addColorStop(1, 'rgba(4, 10, 16, 0.90)');
        }

        ctx.fillStyle = bodyGradient;

        // Render roof shapes
        ctx.beginPath();
        if (b.roofType === 'spire') {
          ctx.moveTo(bX, height);
          ctx.lineTo(bX, topY + 25);
          ctx.lineTo(bX + bWidth / 2, topY);
          ctx.lineTo(bX + bWidth, topY + 25);
          ctx.lineTo(bX + bWidth, height);
        } else if (b.roofType === 'stepped') {
          ctx.moveTo(bX, height);
          ctx.lineTo(bX, topY + 30);
          ctx.lineTo(bX + 10, topY + 30);
          ctx.lineTo(bX + 10, topY + 15);
          ctx.lineTo(bX + bWidth / 2, topY);
          ctx.lineTo(bX + bWidth - 10, topY + 15);
          ctx.lineTo(bX + bWidth - 10, topY + 30);
          ctx.lineTo(bX + bWidth, topY + 30);
          ctx.lineTo(bX + bWidth, height);
        } else if (b.roofType === 'diagonal') {
          ctx.moveTo(bX, height);
          ctx.lineTo(bX, topY + 35);
          ctx.lineTo(bX + bWidth, topY);
          ctx.lineTo(bX + bWidth, height);
        } else if (b.roofType === 'arch') {
          ctx.moveTo(bX, height);
          ctx.lineTo(bX, topY + 20);
          ctx.quadraticCurveTo(bX + bWidth / 2, topY - 10, bX + bWidth, topY + 20);
          ctx.lineTo(bX + bWidth, height);
        } else {
          // Flat with helipad rim
          ctx.moveTo(bX, height);
          ctx.lineTo(bX, topY);
          ctx.lineTo(bX + bWidth, topY);
          ctx.lineTo(bX + bWidth, height);
        }
        ctx.closePath();
        ctx.fill();

        // Neon Glowing Edges & Architectural Outlines (Softened)
        const edgeAlpha = b.layer === 2 ? 0.55 : b.layer === 1 ? 0.35 : 0.20;
        ctx.strokeStyle = b.glowColor.replace('0.95', `${edgeAlpha}`);
        ctx.lineWidth = b.layer === 2 ? 1.3 : 0.85;
        ctx.stroke();

        // High-Intensity Laser Highlight at Topmost Ridge
        ctx.beginPath();
        if (b.roofType === 'spire') {
          ctx.moveTo(bX, topY + 25);
          ctx.lineTo(bX + bWidth / 2, topY);
          ctx.lineTo(bX + bWidth, topY + 25);
        } else if (b.roofType === 'stepped') {
          ctx.moveTo(bX + 10, topY + 15);
          ctx.lineTo(bX + bWidth / 2, topY);
          ctx.lineTo(bX + bWidth - 10, topY + 15);
        } else if (b.roofType === 'diagonal') {
          ctx.moveTo(bX, topY + 35);
          ctx.lineTo(bX + bWidth, topY);
        } else {
          ctx.moveTo(bX, topY);
          ctx.lineTo(bX + bWidth, topY);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${b.layer === 2 ? 0.45 : 0.25})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // Architectural Cross-Truss / Structural Neon Bracing
        if (b.trussStyle === 'cross' && b.layer >= 1) {
          ctx.beginPath();
          const trussSegments = 4;
          const segmentHeight = (height - topY) / trussSegments;
          for (let s = 0; s < trussSegments; s++) {
            const sy = topY + s * segmentHeight + 35;
            const ey = sy + segmentHeight;
            if (ey < height) {
              ctx.moveTo(bX + 4, sy);
              ctx.lineTo(bX + bWidth - 4, ey);
              ctx.moveTo(bX + bWidth - 4, sy);
              ctx.lineTo(bX + 4, ey);
            }
          }
          ctx.strokeStyle = b.glowColor.replace('0.95', '0.08');
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }

        // Draw Lit Matrix Windows (Slow, relaxing shimmer)
        if (b.windows.length > 0) {
          for (const win of b.windows) {
            const winY = topY + win.relY + 30;
            if (winY < height - 20) {
              // Very slow window shimmer
              const winPulse = Math.sin(time * 0.0004 + win.pulseOffset);
              const winAlpha = 0.25 + winPulse * 0.18;
              ctx.fillStyle = `${win.color}${winAlpha})`;
              ctx.fillRect(bX + win.relX, winY, win.w, win.h);

              if (win.pulseOffset > 4.8) {
                ctx.fillStyle = `rgba(255, 255, 255, ${winAlpha * 0.65})`;
                ctx.fillRect(bX + win.relX + 1, winY + 1, win.w - 2, win.h - 2);
              }
            }
          }
        }

        // Rooftop Antenna Spire
        const spireX = bX + bWidth / 2;
        const antennaTopY = topY - b.antennaHeight;

        ctx.beginPath();
        ctx.moveTo(spireX, topY);
        ctx.lineTo(spireX, antennaTopY);
        ctx.strokeStyle = b.glowColor.replace('0.95', '0.45');
        ctx.lineWidth = 1.0;
        ctx.stroke();

        // Slow Pulsing Neon Beacon Strobe
        b.beaconPhase += b.beaconSpeed; // Slow speed (0.006 - 0.016)
        const beaconIntensity = (Math.sin(b.beaconPhase) + 1) / 2;
        if (beaconIntensity > 0.35) {
          const strobeRadius = (b.layer === 2 ? 3.0 : 2.0) + beaconIntensity * 1.5;
          
          ctx.beginPath();
          ctx.arc(spireX, antennaTopY, strobeRadius * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = b.beaconColor === '#ef4444' 
            ? `rgba(239, 68, 68, ${beaconIntensity * 0.35})`
            : `rgba(52, 211, 153, ${beaconIntensity * 0.35})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(spireX, antennaTopY, strobeRadius, 0, Math.PI * 2);
          ctx.fillStyle = b.beaconColor;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(spireX, antennaTopY, strobeRadius * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }

        // Very Slow Skyward Scanning Searchlight
        if (b.hasSearchlight) {
          // Slow sweep angle
          const sweepAngle = b.searchlightBaseAngle + Math.sin(time * b.searchlightSpeed) * 0.40;
          const beamLength = Math.max(300, height * 0.65);
          const beamEndX = spireX + Math.cos(sweepAngle) * beamLength;
          const beamEndY = antennaTopY + Math.sin(sweepAngle) * beamLength;

          const beamGrad = ctx.createLinearGradient(spireX, antennaTopY, beamEndX, beamEndY);
          beamGrad.addColorStop(0, b.searchlightColor.replace('0.95', '0.24'));
          beamGrad.addColorStop(0.35, b.searchlightColor.replace('0.95', '0.08'));
          beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.beginPath();
          ctx.moveTo(spireX - 2.5, antennaTopY);
          ctx.lineTo(beamEndX - 30, beamEndY);
          ctx.lineTo(beamEndX + 30, beamEndY);
          ctx.lineTo(spireX + 2.5, antennaTopY);
          ctx.closePath();
          ctx.fillStyle = beamGrad;
          ctx.fill();
        }
      }

      ctx.restore();
    };

    let lastTime = performance.now();

    // Main Render Loop
    const render = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Abstract Neon Mesh Grid in deep background (Slow wave)
      drawNeonMeshGrid(now);

      // 2. Draw Futuristic Neon Glow Skyscraper Skyline (40% reduced opacity & slow light motion)
      drawSkyscrapers(now);

      // 3. Draw 3D Floating Geometric Wireframe Polyhedra (Slow majestic tumble)
      for (const shape of shapes) {
        shape.x += shape.vx;
        shape.y += shape.vy;
        shape.rotX += shape.vRotX;
        shape.rotY += shape.vRotY;
        shape.rotZ += shape.vRotZ;

        if (shape.x < -60) shape.x = width + 60;
        if (shape.x > width + 60) shape.x = -60;
        if (shape.y < -60) shape.y = height * 0.7 + 60;
        if (shape.y > height * 0.7 + 60) shape.y = -60;

        drawGeometricShape(shape);
      }

      // Max connection distance for glowing plexus lines
      const maxDistance = Math.min(160, Math.max(110, width / 9));
      const connectedPairs: Array<{ i: number; j: number; dist: number }> = [];

      // 4. Update Network Node Positions & Interactivity (Gentle, slow drift)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        node.x += node.vx;
        node.y += node.vy;

        if (mouse.isActive) {
          const mdx = node.x - mouse.x;
          const mdy = node.y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < mouse.radius && mDist > 0) {
            const force = (1 - mDist / mouse.radius) * 1.2;
            node.x += (mdx / mDist) * force;
            node.y += (mdy / mDist) * force;
          }
        }

        if (node.x < 10) { node.x = 10; node.vx *= -1; }
        if (node.x > width - 10) { node.x = width - 10; node.vx *= -1; }
        if (node.y < 10) { node.y = 10; node.vy *= -1; }
        if (node.y > height - 10) { node.y = height - 10; node.vy *= -1; }

        node.pulsePhase += node.pulseSpeed;
        const pulse = Math.sin(node.pulsePhase);
        node.radius = node.baseRadius + pulse * (node.isHub ? 1.2 : 0.6);
      }

      // 5. Calculate Glowing Plexus Connections
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            connectedPairs.push({ i, j, dist });
          }
        }
      }

      // 6. Draw Glowing Plexus Lines
      ctx.save();
      for (const pair of connectedPairs) {
        const n1 = nodes[pair.i];
        const n2 = nodes[pair.j];
        const opacity = (1 - pair.dist / maxDistance);

        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = n1.isHub || n2.isHub 
          ? `rgba(52, 211, 153, ${opacity * 0.32})`
          : `rgba(16, 185, 129, ${opacity * 0.20})`;
        ctx.lineWidth = n1.isHub || n2.isHub ? 1.6 : 0.9;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.20})`;
        ctx.lineWidth = 0.55;
        ctx.stroke();
      }
      ctx.restore();

      // Spawn occasional data signal packets (Very slow moving)
      if (connectedPairs.length > 0 && signals.length < maxSignals && Math.random() < 0.04) {
        const randomPair = connectedPairs[Math.floor(Math.random() * connectedPairs.length)];
        signals.push({
          fromNode: randomPair.i,
          toNode: randomPair.j,
          progress: 0,
          speed: 0.0018 + Math.random() * 0.0025, // Very slow light stream
          color: Math.random() > 0.3 ? '#6ee7b7' : '#fde68a'
        });
      }

      // 7. Draw Traveling Neon Signal Packets (Slow gliding lights)
      for (let sIdx = signals.length - 1; sIdx >= 0; sIdx--) {
        const sig = signals[sIdx];
        sig.progress += sig.speed;

        if (sig.progress >= 1) {
          signals.splice(sIdx, 1);
          continue;
        }

        const n1 = nodes[sig.fromNode];
        const n2 = nodes[sig.toNode];
        if (!n1 || !n2) {
          signals.splice(sIdx, 1);
          continue;
        }

        const sigX = n1.x + (n2.x - n1.x) * sig.progress;
        const sigY = n1.y + (n2.y - n1.y) * sig.progress;

        ctx.beginPath();
        ctx.arc(sigX, sigY, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = sig.color;
        ctx.shadowColor = sig.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 8. Draw Network Connection Dots (Nodes) & Concentric Radar Rings
      for (const node of nodes) {
        const pulse = (Math.sin(node.pulsePhase) + 1) / 2;

        if (node.isHub) {
          node.hubRingRadius += 0.08; // Very slow expanding radar wave
          node.hubRingAlpha = Math.max(0, 1 - (node.hubRingRadius / (node.baseRadius * 4.5)));

          if (node.hubRingRadius > node.baseRadius * 4.5) {
            node.hubRingRadius = node.baseRadius;
            node.hubRingAlpha = 0.7;
          }

          ctx.beginPath();
          ctx.arc(node.x, node.y, node.hubRingRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(52, 211, 153, ${node.hubRingAlpha * 0.35})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(node.x, node.y, node.baseRadius * 2.4, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(52, 211, 153, ${0.12 + pulse * 0.15})`;
          ctx.lineWidth = 0.75;
          ctx.setLineDash([2, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 2.0, 0, Math.PI * 2);
        ctx.fillStyle = node.glowColor.replace('0.85', `${0.15 + pulse * 0.20}`);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(1, node.radius * 0.45), 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Deep Atmosphere Gradient Mesh Backing */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.18),transparent_70%),radial-gradient(ellipse_60%_50%_at_85%_75%,rgba(239,68,68,0.12),transparent_60%),radial-gradient(ellipse_50%_40%_at_15%_65%,rgba(6,182,212,0.10),transparent_50%)]" 
      />

      {/* High-Performance Canvas for Neon Skyscrapers, Plexus, Dots & 3D Geometry */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-90"
      />

      {/* Cyber Grid Accent Layer */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
    </div>
  );
};
