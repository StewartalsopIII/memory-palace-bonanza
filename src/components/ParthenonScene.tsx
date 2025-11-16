"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import memoryRegistrars from "@/memory-objects";
import type { MemoryObjectConfig } from "@/memory-objects/types";

type StatusValue = {
  text: string;
  ok: boolean | null;
};

interface DebugStatus {
  webgl: StatusValue;
  renderer: StatusValue;
  modelsLoaded: number;
  fps: number;
  sceneChildren: number;
  sceneMessage: string;
}

declare global {
  interface Window {
    DEBUG?: Record<string, unknown>;
    addMemoryObject?: (config: MemoryObjectConfig) => void;
  }
}

const PARTHENON_MODEL_PATH = "/models/parthenon.glb";

const panelRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "1rem",
};

const labelStyle: CSSProperties = {
  fontWeight: 600,
  color: "#9be7ff",
};

const valueStyle = (ok: boolean | null): CSSProperties => ({
  color: ok === null ? "#f5f5f5" : ok ? "#3ddc97" : "#ff6b6b",
  fontWeight: 600,
});

const overlayStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "auto",
  color: "#f5f5f5",
  background: "linear-gradient(180deg, rgba(3,7,18,0.85), rgba(5,12,25,0.6))",
  textAlign: "center",
  padding: "2rem",
};

const debugPanelStyle: CSSProperties = {
  position: "absolute",
  top: "1rem",
  right: "1rem",
  background: "rgba(0,0,0,0.8)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  padding: "0.75rem 1rem",
  fontSize: "0.85rem",
  fontFamily: "'JetBrains Mono', 'SFMono-Regular', Menlo, monospace",
  zIndex: 10,
  minWidth: "220px",
};

const infoPanelStyle: CSSProperties = {
  position: "absolute",
  bottom: "1.5rem",
  left: "1.5rem",
  background: "rgba(3,7,18,0.7)",
  padding: "1rem",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.1)",
  maxWidth: "320px",
  fontSize: "0.9rem",
  lineHeight: 1.4,
};

const ParthenonScene = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [protocolWarning, setProtocolWarning] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Setting up renderer...");
  const [sceneReady, setSceneReady] = useState(false);
  const [debugStatus, setDebugStatus] = useState<DebugStatus>({
    webgl: { text: "Checking...", ok: null },
    renderer: { text: "Init...", ok: null },
    modelsLoaded: 0,
    fps: 0,
    sceneChildren: 0,
    sceneMessage: "Waiting for models...",
  });

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    if (window.location.protocol === "file:") {
      setProtocolWarning(
        "This project must be served from a local web server. Run `npm install` then `npm run dev` and open http://localhost:3000."
      );
      return;
    }

    let animationFrame: number | null = null;
    const setStatus = (partial: Partial<DebugStatus>) => {
      setDebugStatus((prev) => ({
        ...prev,
        ...partial,
      }));
    };

    const debugLog = (message: string, ok = true) => {
      console[ok ? "log" : "warn"](`${ok ? "✓" : "✗"} ${message}`);
    };

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    debugLog("Scene created");

    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 12, 36);
    debugLog(`Camera created at ${camera.position.toArray().map((n) => n.toFixed(1)).join(", ")}`);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    });

    try {
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
    } catch (err) {
      console.error("Failed to configure renderer", err);
    }

    if (!(renderer && renderer.domElement)) {
      setStatus({
        webgl: { text: "NOT SUPPORTED", ok: false },
        renderer: { text: "INIT FAILED", ok: false },
        sceneMessage: "WebGL not available in this browser",
      });
      setLoadingMessage("WebGL not supported");
      return () => undefined;
    }

    containerRef.current.appendChild(renderer.domElement);
    setStatus({
      webgl: { text: "Supported ✓", ok: true },
      renderer: { text: "Active ✓", ok: true },
      sceneMessage: "Renderer ready",
    });
    debugLog(
      `Renderer attached (${renderer.domElement.width}x${renderer.domElement.height})`
    );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI * 0.49;
    debugLog("Orbit controls ready");

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight.position.set(25, 35, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);
    debugLog("Lighting configured");

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(240, 240),
      new THREE.MeshStandardMaterial({ color: 0xd4c5a9 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);
    debugLog("Ground plane ready");

    const loader = new GLTFLoader();
    let modelsLoaded = 0;
    const markModelLoaded = () => {
      modelsLoaded += 1;
      setStatus({
        modelsLoaded,
        sceneMessage: `${modelsLoaded} model${modelsLoaded === 1 ? "" : "s"} loaded`,
      });
    };

    const addMemoryObject = (config: MemoryObjectConfig) => {
      const {
        name,
        modelPath,
        position = [0, 0, 0],
        rotation = [0, 0, 0],
        scale = 1,
      } = config;

      debugLog(`Loading memory object: ${name} (${modelPath})`);
      loader.load(
        modelPath,
        (gltf) => {
          const model = gltf.scene;
          model.position.set(position[0], position[1], position[2]);
          model.rotation.set(rotation[0], rotation[1], rotation[2]);
          if (typeof scale === "number") {
            model.scale.setScalar(scale);
          } else {
            model.scale.set(scale[0] ?? 1, scale[1] ?? 1, scale[2] ?? 1);
          }

          model.traverse((node) => {
            if ((node as THREE.Mesh).isMesh) {
              const mesh = node as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
            }
          });

          scene.add(model);
          markModelLoaded();
          debugLog(`Memory object ready: ${name}`);
        },
        undefined,
        (error) => {
          console.error(`Failed to load memory object ${name}`, error);
          setStatus({
            sceneMessage: `Error loading ${name}. Check console.`,
          });
        }
      );
    };

    const addTestCubeHelper = (x = 0, y = 5, z = 0) => {
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 5),
        new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff })
      );
      cube.position.set(x, y, z);
      cube.castShadow = true;
      scene.add(cube);
      debugLog(`Helper cube added at ${cube.position.toArray().join(", ")}`);
      return cube;
    };

    window.DEBUG = {
      scene,
      camera,
      renderer,
      THREE,
      addTestCube: addTestCubeHelper,
      addMemoryObject,
      loader,
    };
    window.addMemoryObject = addMemoryObject;
    debugLog("window.DEBUG populated");

    const adjustCameraForModel = (model: THREE.Object3D) => {
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const distance = maxDim * 1.6;
      camera.position.set(distance * 0.5, distance * 0.4, distance);
      camera.lookAt(center);
      controls.target.copy(center);
      debugLog(`Camera adjusted for Parthenon bounds (${size
        .toArray()
        .map((v) => v.toFixed(1))
        .join("x")})`);
    };

    const loadParthenon = () => {
      loader.load(
        PARTHENON_MODEL_PATH,
        (gltf) => {
          const parthenon = gltf.scene;
          parthenon.traverse((node) => {
            if ((node as THREE.Mesh).isMesh) {
              const mesh = node as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
            }
          });

          scene.add(parthenon);
          markModelLoaded();
          adjustCameraForModel(parthenon);
          setLoadingMessage("Parthenon ready");
          setTimeout(() => setSceneReady(true), 400);
        },
        (xhr) => {
          if (xhr.total) {
            const percent = ((xhr.loaded / xhr.total) * 100).toFixed(0);
            setLoadingMessage(`Loading Parthenon ${percent}%`);
            if (Number(percent) % 20 === 0) {
              debugLog(`Parthenon load ${percent}%`);
            }
          } else {
            setLoadingMessage("Loading Parthenon...");
          }
        },
        (error) => {
          console.error("Failed to load Parthenon", error);
          setLoadingMessage("Failed to load Parthenon. Check console.");
          setStatus({
            sceneMessage: "Parthenon not loaded",
          });
          setTimeout(() => setSceneReady(true), 400);
        }
      );
    };

    setTimeout(loadParthenon, 100);

    memoryRegistrars.forEach((register) => register(addMemoryObject));

    let frameCount = 0;
    let lastTime = performance.now();
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);

      frameCount += 1;
      const now = performance.now();
      if (now - lastTime > 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        setStatus({
          fps,
          sceneChildren: scene.children.length,
        });
        frameCount = 0;
        lastTime = now;
      }

      if (frameCount === 1) {
        debugLog("First frame rendered");
        debugLog(`Triangles: ${renderer.info.render.triangles}`);
      }
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      if (window.DEBUG) {
        delete window.DEBUG;
      }
      if (window.addMemoryObject) {
        delete window.addMemoryObject;
      }
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {protocolWarning && (
        <div style={overlayStyle}>
          <h2>⚠️ Local Server Required</h2>
          <p>{protocolWarning}</p>
        </div>
      )}

      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {!sceneReady && !protocolWarning && (
        <div style={overlayStyle}>
          <h2>Loading Parthenon Memory Workshop...</h2>
          <p>{loadingMessage}</p>
          <small>Check the debug panel and browser console for status updates.</small>
        </div>
      )}

      {!protocolWarning && (
        <div style={debugPanelStyle}>
          <div style={panelRowStyle}>
            <span style={labelStyle}>WebGL</span>
            <span style={valueStyle(debugStatus.webgl.ok)}>{debugStatus.webgl.text}</span>
          </div>
          <div style={panelRowStyle}>
            <span style={labelStyle}>Renderer</span>
            <span style={valueStyle(debugStatus.renderer.ok)}>
              {debugStatus.renderer.text}
            </span>
          </div>
          <div style={panelRowStyle}>
            <span style={labelStyle}>Models</span>
            <span style={{ color: "#f5f5f5" }}>{debugStatus.modelsLoaded}</span>
          </div>
          <div style={panelRowStyle}>
            <span style={labelStyle}>FPS</span>
            <span style={{ color: "#f5f5f5" }}>{debugStatus.fps}</span>
          </div>
          <div style={panelRowStyle}>
            <span style={labelStyle}>Scene Children</span>
            <span style={{ color: "#f5f5f5" }}>{debugStatus.sceneChildren}</span>
          </div>
          <div style={{ marginTop: "0.5rem", color: "#c5c5c5" }}>
            {debugStatus.sceneMessage}
          </div>
        </div>
      )}

      {!protocolWarning && (
        <div style={infoPanelStyle}>
          <h3>Parthenon Memory Workshop</h3>
          <p style={{ marginBottom: "0.5rem" }}>
            Use your mouse or trackpad to orbit, drag with right mouse button to pan, and scroll to zoom.
          </p>
          <p>
            Type <code>window.DEBUG</code> in the console for helper functions, or run{" "}
            <code>window.addMemoryObject(&#123;...&#125;)</code> for quick tests.
          </p>
        </div>
      )}
    </div>
  );
};

export default ParthenonScene;
