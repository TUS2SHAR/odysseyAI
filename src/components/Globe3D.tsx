import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Compass, Zap, Globe as GlobeIcon, MapPin, Radio, Sparkles } from 'lucide-react';

interface CityNode {
  name: string;
  lat: number;
  lng: number;
  country: string;
  prompt: string;
  tag: string;
}

const GLOBAL_NODES: CityNode[] = [
  { name: 'Paris', lat: 48.8566, lng: 2.3522, country: 'France', tag: 'Art & Seine Cruise', prompt: '3 days in Paris exploring impressionist museums, Montmartre cafes, and a sunset Seine river dinner cruise.' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan', tag: 'Neon & Street Food', prompt: '4 days in Tokyo exploring Asakusa shrines, Shibuya Sky, Harajuku street food, and Akihabara gadgets.' },
  { name: 'Amalfi Coast', lat: 40.634, lng: 14.6027, country: 'Italy', tag: 'Coastal Retreat', prompt: '3 days in Amalfi Coast with cliffside limoncello tasting, Capri boat tour, and seaside dining.' },
  { name: 'Barcelona', lat: 41.3851, lng: 2.1734, country: 'Spain', tag: 'Gaudi & Tapas', prompt: '3 days in Barcelona exploring Gaudi architecture, Gothic Quarter tapas crawl, and beach sunset drinks.' },
  { name: 'New York', lat: 40.7128, lng: -74.006, country: 'USA', tag: 'Skyline & Broadway', prompt: '3 days in New York City with Central Park picnic, Broadway show, and rooftop dining.' },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357, country: 'Egypt', tag: 'Pyramids & Nile', prompt: '3 days in Cairo exploring Giza Pyramids, Egyptian Museum, and Khan el-Khalili bazaar.' },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia', tag: 'Harbour & Beaches', prompt: '3 days in Sydney exploring Opera House, Bondi beach walk, and harbour cruises.' },
  { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729, country: 'Brazil', tag: 'Copacabana & Corcovado', prompt: '3 days in Rio de Janeiro visiting Christ the Redeemer, Sugarloaf Mountain, and Copacabana sunset.' },
];

interface Globe3DProps {
  onSelectPrompt: (prompt: string) => void;
}

export const Globe3D: React.FC<Globe3DProps> = ({ onSelectPrompt }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<CityNode>(GLOBAL_NODES[0]);
  const [hudLatency, setHudLatency] = useState(24);
  const [hudActiveNodes, setHudActiveNodes] = useState(148);

  useEffect(() => {
    // Simulate HUD metrics flicker
    const interval = setInterval(() => {
      setHudLatency(Math.floor(18 + Math.random() * 12));
      setHudActiveNodes(Math.floor(140 + Math.random() * 15));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Base Sphere
    const radius = 70;
    const sphereGeo = new THREE.SphereGeometry(radius, 64, 64);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x090e1a,
      emissive: 0x070b14,
      wireframe: false,
      shininess: 25,
      transparent: true,
      opacity: 0.95,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // 3. Holographic Grid Dot Points Layer
    const dotsGeo = new THREE.BufferGeometry();
    const dotPositions: number[] = [];
    const dotColors: number[] = [];

    const latCount = 60;
    const lngCount = 120;

    for (let lat = -90; lat <= 90; lat += 180 / latCount) {
      const phi = (90 - lat) * (Math.PI / 180);
      const radiusAtLat = radius * Math.sin(phi);

      for (let lng = -180; lng <= 180; lng += 360 / lngCount) {
        const theta = (lng + 180) * (Math.PI / 180);

        // Simple landmass mask simulation
        const isLand = (Math.sin(lat * 0.1) * Math.cos(lng * 0.08) > -0.2);
        if (!isLand && Math.random() > 0.3) continue;

        const x = -(radiusAtLat * Math.cos(theta));
        const z = radiusAtLat * Math.sin(theta);
        const y = radius * Math.cos(phi);

        dotPositions.push(x, y, z);

        const color = isLand ? new THREE.Color(0x6366f1) : new THREE.Color(0x1e293b);
        dotColors.push(color.r, color.g, color.b);
      }
    }

    dotsGeo.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));
    dotsGeo.setAttribute('color', new THREE.Float32BufferAttribute(dotColors, 3));

    const dotsMat = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const dotsMesh = new THREE.Points(dotsGeo, dotsMat);
    scene.add(dotsMesh);

    // 4. Atmospheric Outer Glow
    const atmosphereGeo = new THREE.SphereGeometry(radius * 1.15, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
          gl_FragColor = vec4(0.38, 0.4, 0.95, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphere);

    // Helper: Convert Lat/Lng to Vector3
    const latLngToVector3 = (lat: number, lng: number, r: number = radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // 5. Glowing City Markers & Rings
    const markerGroup = new THREE.Group();

    GLOBAL_NODES.forEach((node) => {
      const pos = latLngToVector3(node.lat, node.lng, radius + 1);

      // Marker Mesh
      const markerGeo = new THREE.SphereGeometry(2, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.position.copy(pos);
      markerGroup.add(markerMesh);

      // Outer Pulsing Ring
      const ringGeo = new THREE.RingGeometry(2.5, 4, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xec4899,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      markerGroup.add(ringMesh);
    });

    scene.add(markerGroup);

    // 6. Curved Bezier Data Arcs connecting cities
    const arcsGroup = new THREE.Group();
    for (let i = 0; i < GLOBAL_NODES.length; i++) {
      const start = latLngToVector3(GLOBAL_NODES[i].lat, GLOBAL_NODES[i].lng, radius);
      const nextIdx = (i + 1) % GLOBAL_NODES.length;
      const end = latLngToVector3(GLOBAL_NODES[nextIdx].lat, GLOBAL_NODES[nextIdx].lng, radius);

      // Calculate midpoint elevated above globe surface
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const dist = start.distanceTo(end);
      mid.setLength(radius + dist * 0.35);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(50);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);

      const arcMat = new THREE.LineBasicMaterial({
        color: 0x818cf8,
        transparent: true,
        opacity: 0.45,
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      arcsGroup.add(arcLine);
    }
    scene.add(arcsGroup);

    // 7. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x6366f1, 2.5);
    dirLight1.position.set(150, 150, 150);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xec4899, 1.2);
    dirLight2.position.set(-150, -100, -100);
    scene.add(dirLight2);

    // 8. Interactivity (Mouse Drag rotation & Inertia)
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const deltaX = e.clientX - mouseX;
      const deltaY = e.clientY - mouseY;

      targetRotationY += deltaX * 0.005;
      targetRotationX += deltaY * 0.005;

      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch events for mobile responsiveness
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isMouseDown = true;
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isMouseDown && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - mouseX;
        const deltaY = e.touches[0].clientY - mouseY;

        targetRotationY += deltaX * 0.005;
        targetRotationX += deltaY * 0.005;

        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };
    const onTouchEnd = () => {
      isMouseDown = false;
    };

    domElement.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    // 9. Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto rotation when idle
      if (!isMouseDown) {
        targetRotationY += 0.002;
      }

      sphere.rotation.y += (targetRotationY - sphere.rotation.y) * 0.05;
      sphere.rotation.x += (targetRotationX - sphere.rotation.x) * 0.05;
      dotsMesh.rotation.y = sphere.rotation.y;
      dotsMesh.rotation.x = sphere.rotation.x;
      markerGroup.rotation.y = sphere.rotation.y;
      markerGroup.rotation.x = sphere.rotation.x;
      arcsGroup.rotation.y = sphere.rotation.y;
      arcsGroup.rotation.x = sphere.rotation.x;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[420px] sm:h-[480px] rounded-3xl overflow-hidden glass-card border border-indigo-500/30 shadow-2xl">
      
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Cyber HUD Overlay Top Left */}
      <div className="absolute top-4 left-4 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-md space-y-1 select-none pointer-events-none">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
            3D Holographic Mission Control
          </span>
        </div>
        <div className="text-xs font-bold text-white flex items-center space-x-2">
          <Radio className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
          <span>Active Globe Coordinates</span>
        </div>
        <div className="flex items-center space-x-3 text-[10px] text-slate-400 pt-0.5">
          <span>Latency: <strong className="text-indigo-300 font-mono">{hudLatency}ms</strong></span>
          <span>Nodes: <strong className="text-pink-400 font-mono">{hudActiveNodes}</strong></span>
        </div>
      </div>

      {/* Selected City Tooltip Card (Bottom Right) */}
      <div className="absolute bottom-4 right-4 max-w-xs w-full p-4 rounded-2xl glass-card border border-indigo-500/40 backdrop-blur-xl space-y-2.5 shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <MapPin className="h-4 w-4 text-pink-400" />
            <h3 className="text-sm font-bold text-white">{selectedNode.name}</h3>
            <span className="text-[10px] text-slate-400">({selectedNode.country})</span>
          </div>
          <span className="text-[9px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
            {selectedNode.tag}
          </span>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
          "{selectedNode.prompt}"
        </p>

        <button
          type="button"
          onClick={() => onSelectPrompt(selectedNode.prompt)}
          className="w-full py-2 px-3 rounded-xl bg-gradient-accent text-xs font-bold text-white flex items-center justify-center space-x-1.5 shadow-lg hover:scale-105 transition-all"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Generate Plan for {selectedNode.name}</span>
        </button>
      </div>

      {/* Global Node Selector Chips (Top Right) */}
      <div className="absolute top-4 right-4 hidden md:flex flex-wrap gap-1.5 max-w-sm justify-end">
        {GLOBAL_NODES.map((node) => (
          <button
            key={node.name}
            type="button"
            onClick={() => setSelectedNode(node)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
              selectedNode.name === node.name
                ? 'bg-gradient-accent text-white shadow-md'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {node.name}
          </button>
        ))}
      </div>

    </div>
  );
};
