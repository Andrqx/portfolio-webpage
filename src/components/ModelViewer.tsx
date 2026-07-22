"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

type ModelViewerProps = {
  /** Path to a .glb/.gltf file under /public, e.g. "/models/chassis.glb". */
  src: string;
  className?: string;
  background?: string;
};

/**
 * Minimal Three.js viewer for CAD-exported models. Most CAD tools
 * (SolidWorks, Fusion 360, etc.) can export directly to glTF/GLB, or a
 * STEP/IGES file can be converted via FreeCAD or Blender. Drop the
 * exported .glb under /public/models and point `src` at it.
 *
 * Not wired into any page yet — there's no model to show. Once you have
 * one, render <ModelViewer src="/models/whatever.glb" className="h-96" />
 * wherever it belongs (e.g. a project detail page).
 */
export default function ModelViewer({
  src,
  className,
  background = "#08080a",
}: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(background);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      1000
    );
    camera.position.set(4, 3, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(5, 10, 7);
    scene.add(key);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    let model: THREE.Object3D | null = null;
    const loader = new GLTFLoader();
    loader.load(
      src,
      (gltf) => {
        model = gltf.scene;
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error("ModelViewer: failed to load", src, error);
      }
    );

    let raf = 0;
    const tick = () => {
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      const { clientWidth, clientHeight } = container;
      if (clientHeight === 0) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      if (model) scene.remove(model);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [src, background]);

  return <div ref={containerRef} className={className} />;
}
