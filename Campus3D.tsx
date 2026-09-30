"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Language, Course } from "@/types/academy";
import { translations } from "@/lib/translations";
import { 
  Terminal, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  Gamepad2, 
  Palette, 
  Database, 
  Compass, 
  Maximize2, 
  Sparkles,
  ArrowRight,
  Move
} from "lucide-react";

interface Campus3DProps {
  language: Language;
  courses: Course[];
  onOpenCourse: (courseSlug: string) => void;
  onEnterLesson?: (lessonId: number) => void;
  onAddToast: (title: string, message?: string, xp?: number) => void;
}

interface LabObjectConfig {
  slug: string;
  labId: string;
  nameKey: "enterPythonLab" | "enterWebLab" | "enterAiLab" | "enterCyberLab" | "enterGameLab" | "enterUiUxStudio" | "enterDbLab";
  titleKey: "pythonLabTitle" | "webLabTitle" | "aiLabTitle" | "cyberLabTitle" | "gameLabTitle" | "uiUxStudioTitle" | "dbLabTitle";
  x: number;
  z: number;
  color: number;
  glowColor: number;
  iconName: string;
  accentClass: string;
}

const LAB_CONFIGS: LabObjectConfig[] = [
  { slug: "python", labId: "python-lab", nameKey: "enterPythonLab", titleKey: "pythonLabTitle", x: -22, z: -12, color: 0x10b981, glowColor: 0x34d399, iconName: "Terminal", accentClass: "from-emerald-500 to-teal-700" },
  { slug: "web-dev", labId: "web-lab", nameKey: "enterWebLab", titleKey: "webLabTitle", x: 0, z: -24, color: 0x06b6d4, glowColor: 0x38bdf8, iconName: "Globe", accentClass: "from-cyan-500 to-blue-600" },
  { slug: "ai", labId: "ai-lab", nameKey: "enterAiLab", titleKey: "aiLabTitle", x: 22, z: -12, color: 0xa855f7, glowColor: 0xc084fc, iconName: "Cpu", accentClass: "from-purple-600 to-pink-600" },
  { slug: "cybersecurity", labId: "cyber-lab", nameKey: "enterCyberLab", titleKey: "cyberLabTitle", x: 22, z: 14, color: 0xef4444, glowColor: 0xf87171, iconName: "ShieldCheck", accentClass: "from-red-600 to-rose-700" },
  { slug: "game-dev", labId: "game-lab", nameKey: "enterGameLab", titleKey: "gameLabTitle", x: 0, z: 24, color: 0xf59e0b, glowColor: 0xfbbf24, iconName: "Gamepad2", accentClass: "from-amber-500 to-orange-600" },
  { slug: "ui-ux", labId: "ui-ux-studio", nameKey: "enterUiUxStudio", titleKey: "uiUxStudioTitle", x: -22, z: 14, color: 0xec4899, glowColor: 0xf472b6, iconName: "Palette", accentClass: "from-fuchsia-500 to-pink-600" },
  { slug: "database", labId: "db-lab", nameKey: "enterDbLab", titleKey: "dbLabTitle", x: 0, z: 0, color: 0x6366f1, glowColor: 0x818cf8, iconName: "Database", accentClass: "from-indigo-600 to-blue-800" },
];

export default function Campus3D({ language, courses, onOpenCourse, onAddToast }: Campus3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  const [activeLab, setActiveLab] = useState<LabObjectConfig | null>(null);
  const [cameraMode, setCameraMode] = useState<"orbit" | "first" | "top">("orbit");
  const [isNearAnyLab, setIsNearAnyLab] = useState(false);
  const [userPos, setUserPos] = useState({ x: 0, z: 8 });

  // Store references for three.js scene loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const playerPosRef = useRef(new THREE.Vector3(0, 1.2, 9));
  const keysPressedRef = useRef<{ [key: string]: boolean }>({});
  const labMeshesRef = useRef<THREE.Group[]>([]);
  const activeLabRef = useRef<LabObjectConfig | null>(null);

  // Sync ref
  useEffect(() => {
    activeLabRef.current = activeLab;
  }, [activeLab]);

  // Handle Action to Enter Lab
  const handleEnterLab = useCallback((lab: LabObjectConfig) => {
    onAddToast(
      language === "RU" ? `Вход в ${t[lab.titleKey]}` : language === "UZ" ? `${t[lab.titleKey]}ga kirish` : `Entering ${t[lab.titleKey]}`,
      language === "RU" ? "Загрузка учебных модулей и песочницы..." : "Loading modules & syllabus...",
      10
    );
    onOpenCourse(lab.slug);
  }, [language, t, onAddToast, onOpenCourse]);

  // Quick teleport to lab position
  const teleportToLab = (lab: LabObjectConfig) => {
    // Move player in front of the lab
    const targetZ = lab.z > 0 ? lab.z - 5 : lab.z + 5;
    playerPosRef.current.set(lab.x, 1.2, targetZ);
    setUserPos({ x: lab.x, z: targetZ });
    setActiveLab(lab);
    setIsNearAnyLab(true);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.015);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(0, 16, 26);
    camera.lookAt(0, 0, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x223355, 1.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Central cyber crystal beacon light
    const centerPointLight = new THREE.PointLight(0x06b6d4, 3, 50);
    centerPointLight.position.set(0, 8, 0);
    scene.add(centerPointLight);

    // 5. Cyber Floor Grid
    const floorGeo = new THREE.PlaneGeometry(90, 90, 60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x070d1d,
      roughness: 0.8,
      metalness: 0.3,
      wireframe: false,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid helper with cyan neon lines
    const gridHelper = new THREE.GridHelper(90, 45, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // Cyber boundary perimeter rings
    const ringGeo = new THREE.RingGeometry(42, 42.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    scene.add(ring);

    // 6. Build the 7 3D Academy Labs
    const labGroups: THREE.Group[] = [];

    LAB_CONFIGS.forEach((config) => {
      const labGroup = new THREE.Group();
      labGroup.position.set(config.x, 0, config.z);
      labGroup.userData = { config };

      // Base Platform
      const baseGeo = new THREE.CylinderGeometry(4.2, 4.6, 0.8, 8);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.8,
        roughness: 0.2,
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = 0.4;
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      labGroup.add(baseMesh);

      // Glowing Base Ring
      const glowRingGeo = new THREE.TorusGeometry(4.5, 0.12, 16, 32);
      const glowRingMat = new THREE.MeshBasicMaterial({ color: config.glowColor });
      const glowRingMesh = new THREE.Mesh(glowRingGeo, glowRingMat);
      glowRingMesh.rotation.x = Math.PI / 2;
      glowRingMesh.position.y = 0.8;
      labGroup.add(glowRingMesh);

      // Main Architectural Structure
      let mainBuildingMesh: THREE.Mesh;
      if (config.slug === "database") {
        // Multi-tier Database Cylinder Tower
        const cylGeo = new THREE.CylinderGeometry(2.4, 2.6, 5.2, 16);
        const cylMat = new THREE.MeshStandardMaterial({
          color: 0x1e1b4b,
          metalness: 0.7,
          roughness: 0.3,
        });
        mainBuildingMesh = new THREE.Mesh(cylGeo, cylMat);
        mainBuildingMesh.position.y = 3.2;

        // Data Rings
        for (let i = 1; i <= 3; i++) {
          const dRingGeo = new THREE.TorusGeometry(2.7, 0.08, 12, 24);
          const dRingMat = new THREE.MeshBasicMaterial({ color: config.glowColor });
          const dRing = new THREE.Mesh(dRingGeo, dRingMat);
          dRing.rotation.x = Math.PI / 2;
          dRing.position.y = 1.5 + i * 1.0;
          labGroup.add(dRing);
        }
      } else if (config.slug === "ai") {
        // AI Neural Octahedron Hub
        const octGeo = new THREE.OctahedronGeometry(2.8, 1);
        const octMat = new THREE.MeshStandardMaterial({
          color: 0x3b0764,
          metalness: 0.9,
          roughness: 0.1,
          wireframe: false,
        });
        mainBuildingMesh = new THREE.Mesh(octGeo, octMat);
        mainBuildingMesh.position.y = 4.2;
      } else if (config.slug === "cybersecurity") {
        // Cyber Fortress Diamond
        const fortGeo = new THREE.ConeGeometry(2.8, 5.5, 4);
        const fortMat = new THREE.MeshStandardMaterial({
          color: 0x450a0a,
          metalness: 0.8,
          roughness: 0.2,
        });
        mainBuildingMesh = new THREE.Mesh(fortGeo, fortMat);
        mainBuildingMesh.position.y = 3.5;
      } else if (config.slug === "game-dev") {
        // Game Dev Hexagonal Spire
        const spireGeo = new THREE.CylinderGeometry(1.6, 2.5, 5.8, 6);
        const spireMat = new THREE.MeshStandardMaterial({
          color: 0x451a03,
          metalness: 0.7,
          roughness: 0.2,
        });
        mainBuildingMesh = new THREE.Mesh(spireGeo, spireMat);
        mainBuildingMesh.position.y = 3.5;
      } else {
        // Modern Tech Cube / Hub
        const boxGeo = new THREE.BoxGeometry(3.6, 4.4, 3.6);
        const boxMat = new THREE.MeshStandardMaterial({
          color: 0x0e2f44,
          metalness: 0.7,
          roughness: 0.3,
        });
        mainBuildingMesh = new THREE.Mesh(boxGeo, boxMat);
        mainBuildingMesh.position.y = 2.8;
      }

      mainBuildingMesh.castShadow = true;
      mainBuildingMesh.receiveShadow = true;
      labGroup.add(mainBuildingMesh);

      // Floating Hologram Prism at Top
      const holoGeo = new THREE.IcosahedronGeometry(1.0, 0);
      const holoMat = new THREE.MeshBasicMaterial({
        color: config.glowColor,
        wireframe: true,
      });
      const holoMesh = new THREE.Mesh(holoGeo, holoMat);
      holoMesh.position.y = 7.0;
      holoMesh.name = "hologram";
      labGroup.add(holoMesh);

      // Glowing Point Light for Lab
      const labLight = new THREE.PointLight(config.glowColor, 2, 14);
      labLight.position.set(0, 5, 0);
      labGroup.add(labLight);

      scene.add(labGroup);
      labGroups.push(labGroup);
    });

    labMeshesRef.current = labGroups;

    // 7. Cadet Player Character (Avatar Capsule & Neon Glow)
    const playerGroup = new THREE.Group();
    playerGroup.position.copy(playerPosRef.current);

    const cadetBodyGeo = new THREE.CapsuleGeometry(0.5, 1.2, 8, 16);
    const cadetBodyMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x0284c7,
      emissiveIntensity: 0.3,
    });
    const cadetBody = new THREE.Mesh(cadetBodyGeo, cadetBodyMat);
    cadetBody.position.y = 1.0;
    cadetBody.castShadow = true;
    playerGroup.add(cadetBody);

    // Glowing Visor
    const visorGeo = new THREE.BoxGeometry(0.55, 0.2, 0.4);
    const visorMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1.35, 0.3);
    playerGroup.add(visor);

    // Player Aura Light
    const playerLight = new THREE.PointLight(0x38bdf8, 1.5, 8);
    playerLight.position.set(0, 1.8, 0);
    playerGroup.add(playerLight);

    scene.add(playerGroup);

    // 8. Floating Cyber Ambient Particles
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 80;
      particlePos[i + 1] = Math.random() * 20 + 0.5;
      particlePos[i + 2] = (Math.random() - 0.5) * 80;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.25,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 9. Input Listeners (WASD, E, Click, Resize)
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key.toLowerCase()] = true;

      // Check 'E' key press to enter nearest lab
      if (e.key.toLowerCase() === "e" && activeLabRef.current) {
        handleEnterLab(activeLabRef.current);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Mouse Raycasting & Click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(labGroups, true);

      if (intersects.length > 0) {
        // Find top lab group
        let hitObj: THREE.Object3D | null = intersects[0].object;
        while (hitObj && !hitObj.userData?.config && hitObj.parent) {
          hitObj = hitObj.parent;
        }
        if (hitObj && hitObj.userData?.config) {
          const config = hitObj.userData.config as LabObjectConfig;
          teleportToLab(config);
        }
      }
    };

    renderer.domElement.addEventListener("click", handleCanvasClick);

    // Window Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // 10. Animation & Physics Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Rotate Holograms
      labGroups.forEach((group, idx) => {
        const holo = group.getObjectByName("hologram");
        if (holo) {
          holo.rotation.y += delta * 1.2;
          holo.rotation.x += delta * 0.5;
          holo.position.y = 6.8 + Math.sin(time * 2 + idx) * 0.3;
        }
      });

      // Move Floating Particles
      particles.rotation.y = time * 0.03;

      // Handle Character Movement (WASD)
      const moveSpeed = 14 * delta;
      let dx = 0;
      let dz = 0;
      const keys = keysPressedRef.current;

      if (keys["w"] || keys["arrowup"]) dz -= moveSpeed;
      if (keys["s"] || keys["arrowdown"]) dz += moveSpeed;
      if (keys["a"] || keys["arrowleft"]) dx -= moveSpeed;
      if (keys["d"] || keys["arrowright"]) dx += moveSpeed;

      if (dx !== 0 || dz !== 0) {
        playerPosRef.current.x = Math.max(-38, Math.min(38, playerPosRef.current.x + dx));
        playerPosRef.current.z = Math.max(-38, Math.min(38, playerPosRef.current.z + dz));
        setUserPos({ x: playerPosRef.current.x, z: playerPosRef.current.z });

        // Rotate player towards movement direction
        const angle = Math.atan2(dx, dz);
        playerGroup.rotation.y = angle;
      }

      playerGroup.position.x = playerPosRef.current.x;
      playerGroup.position.z = playerPosRef.current.z;

      // Camera Follow based on mode
      if (cameraMode === "orbit") {
        camera.position.x = playerPosRef.current.x;
        camera.position.y = 14;
        camera.position.z = playerPosRef.current.z + 16;
        camera.lookAt(playerPosRef.current.x, 2, playerPosRef.current.z);
      } else if (cameraMode === "first") {
        camera.position.x = playerPosRef.current.x;
        camera.position.y = 2.0;
        camera.position.z = playerPosRef.current.z;
        camera.lookAt(playerPosRef.current.x + Math.sin(playerGroup.rotation.y) * 10, 2.0, playerPosRef.current.z + Math.cos(playerGroup.rotation.y) * 10);
      } else {
        // Top-down Satellite Map
        camera.position.set(0, 52, 0.1);
        camera.lookAt(0, 0, 0);
      }

      // Proximity detection to Labs
      let closestLab: LabObjectConfig | null = null;
      let minDistance = 7.5; // Interaction radius

      LAB_CONFIGS.forEach((config) => {
        const dist = Math.hypot(
          playerPosRef.current.x - config.x,
          playerPosRef.current.z - config.z
        );
        if (dist < minDistance) {
          closestLab = config;
          minDistance = dist;
        }
      });

      if (closestLab !== activeLabRef.current) {
        setActiveLab(closestLab);
        setIsNearAnyLab(!!closestLab);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener("click", handleCanvasClick);
      }
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [cameraMode, handleEnterLab]);

  return (
    <div className="relative w-full h-[640px] lg:h-[720px] rounded-3xl overflow-hidden bg-slate-950 border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.15)] select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD: Title & Controls Banner */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-cyan-500/30 text-white shadow-lg pointer-events-auto">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              ASAD 3D Cyber Campus
            </div>
            <div className="text-xs text-slate-300">
              {t.clickHint}
            </div>
          </div>
        </div>

        {/* Camera Perspective Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-cyan-500/30 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setCameraMode("orbit")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              cameraMode === "orbit"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/40"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            {t.perspectiveOrbit}
          </button>
          <button
            type="button"
            onClick={() => setCameraMode("first")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              cameraMode === "first"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/40"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            {t.perspectiveFirst}
          </button>
          <button
            type="button"
            onClick={() => setCameraMode("top")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              cameraMode === "top"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/40"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            {t.perspectiveTop}
          </button>
        </div>
      </div>

      {/* Interactive Proximity Prompt HUD (CRITICAL: Shows E - ENTER LAB) */}
      {activeLab && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto animate-bounce">
          <button
            type="button"
            onClick={() => handleEnterLab(activeLab)}
            className="group relative flex items-center gap-3 px-6 py-3.5 bg-slate-950/90 backdrop-blur-xl border-2 border-cyan-400 rounded-2xl shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:bg-cyan-500 text-white hover:text-slate-950 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 group-hover:bg-slate-900 group-hover:text-cyan-400 font-extrabold text-sm border border-cyan-400/40">
              E
            </div>
            <div className="text-left">
              <div className="text-xs uppercase tracking-widest text-cyan-300 group-hover:text-slate-900 font-bold">
                {t[activeLab.nameKey]}
              </div>
              <div className="text-xs text-slate-300 group-hover:text-slate-800 font-medium">
                {t.pressEToEnter}
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-cyan-400 group-hover:text-slate-950 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Bottom Control Bar: WASD Help & Quick Teleport Chips */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none z-10">
        {/* Navigation Keybinds Helper */}
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 text-xs text-slate-300 shadow-lg pointer-events-auto">
          <Move className="w-4 h-4 text-cyan-400" />
          <span className="font-mono font-bold text-cyan-300">WASD</span>
          <span>{t.wasdKeys.split("—")[1] || "Walk"}</span>
          <span className="text-slate-600">|</span>
          <span className="font-mono font-bold text-amber-300">E</span>
          <span>{t.interactKey.split("—")[1] || "Interact"}</span>
        </div>

        {/* Quick Lab Teleport Buttons (All 7 Labs) */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-cyan-500/30 shadow-xl pointer-events-auto max-w-full overflow-x-auto">
          {LAB_CONFIGS.map((lab) => {
            const course = courses.find((c) => c.slug === lab.slug);
            const isTarget = activeLab?.slug === lab.slug;

            return (
              <button
                key={lab.slug}
                type="button"
                onClick={() => teleportToLab(lab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isTarget
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40"
                    : "bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700/50"
                }`}
                title={`Teleport to ${t[lab.titleKey]}`}
              >
                {lab.slug === "python" && <Terminal className="w-3.5 h-3.5 text-emerald-400" />}
                {lab.slug === "web-dev" && <Globe className="w-3.5 h-3.5 text-cyan-400" />}
                {lab.slug === "ai" && <Cpu className="w-3.5 h-3.5 text-purple-400" />}
                {lab.slug === "cybersecurity" && <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />}
                {lab.slug === "game-dev" && <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />}
                {lab.slug === "ui-ux" && <Palette className="w-3.5 h-3.5 text-pink-400" />}
                {lab.slug === "database" && <Database className="w-3.5 h-3.5 text-indigo-400" />}
                <span>{t[lab.titleKey]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
