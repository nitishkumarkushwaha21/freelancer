import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Html, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { team } from '../../data/siteData';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const STAGE_BG = '#f2ebe1';

function createWoodTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#c9a66b';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 90; i++) {
    const y = (i / 90) * size;
    ctx.strokeStyle = `rgba(${88 + Math.random() * 40}, ${62 + Math.random() * 28}, ${32 + Math.random() * 18}, ${0.12 + Math.random() * 0.2})`;
    ctx.lineWidth = 0.8 + Math.random() * 2.2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(
      size * 0.25,
      y + (Math.random() - 0.5) * 10,
      size * 0.75,
      y + (Math.random() - 0.5) * 10,
      size,
      y + (Math.random() - 0.5) * 6
    );
    ctx.stroke();
  }

  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.fillStyle = `rgba(${70 + Math.random() * 50}, ${50 + Math.random() * 35}, ${25 + Math.random() * 20}, 0.06)`;
    ctx.fillRect(x, y, 1, 1 + Math.random() * 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3.5, 2.8);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

const CLOSED_ANGLE = (Math.PI / 2) * 0.985;
const OPEN_ANGLE = -0.28;

const BASE_W = 2.4;
const BASE_D = 1.6;
const BASE_H = 0.08;
const LID_W = BASE_W;
const LID_H = BASE_D * 0.95;
const LID_T = 0.06;
const SCREEN_W = LID_W * 0.9;
const SCREEN_H = LID_H * 0.86;
const SCREEN_PX_W = 680;
const SCREEN_PX_H = Math.round(SCREEN_PX_W * (SCREEN_H / SCREEN_W));
const HTML_DISTANCE = 1.72;
const LAPTOP_Y = 0.22;

const LID_SHELL = '#323a4a';
const CHASSIS_DARK = '#2a3140';
const BASE_DECK = '#454d62';
const EDGE_LIGHT = '#5c6678';
const BEZEL_OUTER = '#252b38';
const BEZEL_INNER = '#3d4556';

const BOOT_LINES = ['$ builtbywho --team', '> loading agency.config ... ok', '> starting 4 developer processes'];

const edgeMat = { metalness: 0.55, roughness: 0.32 };

function CameraRig({ progressRef, startOpen }) {
  const camRef = useRef();

  useFrame(() => {
    const cam = camRef.current;
    if (!cam) return;

    const p = progressRef.current;
    const camDolly = smoothstep(0.05, 0.55, p);
    const camSettle = smoothstep(0.65, 1.0, p);

    const y = lerp(1.72, 1.28, camDolly);
    const z = lerp(4.5, 3.15, camDolly);
    const settleY = lerp(y, 1.22, camSettle);
    const settleZ = lerp(z, 2.9, camSettle);
    const lookY = lerp(0.48, 0.62, camDolly);
    const settleLookY = lerp(lookY, 0.66, camSettle);

    cam.position.set(0, settleY, settleZ);
    cam.lookAt(0, settleLookY, -0.06);
    cam.fov = lerp(40, 36, camSettle);
    cam.updateProjectionMatrix();
  });

  return (
    <PerspectiveCamera
      ref={camRef}
      makeDefault
      fov={startOpen ? 36 : 40}
      position={startOpen ? [0, 1.22, 2.9] : [0, 1.72, 4.5]}
    />
  );
}

function StageEnvironment() {
  const woodMap = useMemo(() => createWoodTexture(), []);

  useEffect(() => {
    return () => woodMap.dispose();
  }, [woodMap]);

  const tableW = 5.8;
  const tableD = 4.4;
  const tableY = 0;

  return (
    <>
      <fog attach="fog" args={[STAGE_BG, 7, 16]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.012, 0]} receiveShadow>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial color="#e8e0d4" roughness={0.98} metalness={0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, tableY, 0]} receiveShadow>
        <planeGeometry args={[tableW, tableD]} />
        <meshStandardMaterial
          map={woodMap}
          color="#d4b896"
          roughness={0.68}
          metalness={0.04}
        />
      </mesh>
      <mesh position={[0, tableY - 0.022, tableD / 2 - 0.02]}>
        <boxGeometry args={[tableW, 0.044, 0.07]} />
        <meshStandardMaterial color="#7a5c32" roughness={0.82} metalness={0.05} />
      </mesh>
      <mesh position={[-tableW / 2 + 0.02, tableY - 0.018, 0]}>
        <boxGeometry args={[0.04, 0.036, tableD]} />
        <meshStandardMaterial color="#8b6838" roughness={0.8} metalness={0.05} />
      </mesh>
      <mesh position={[tableW / 2 - 0.02, tableY - 0.018, 0]}>
        <boxGeometry args={[0.04, 0.036, tableD]} />
        <meshStandardMaterial color="#8b6838" roughness={0.8} metalness={0.05} />
      </mesh>
    </>
  );
}

function Keyboard() {
  const rows = 5;
  const cols = 14;
  const areaW = BASE_W * 0.86;
  const areaD = BASE_D * 0.42;
  const keyW = (areaW / cols) * 0.78;
  const keyD = (areaD / rows) * 0.7;

  return (
    <group>
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        return (
          <mesh
            key={i}
            position={[
              -areaW / 2 + (c + 0.5) * (areaW / cols),
              BASE_H + 0.008,
              -BASE_D * 0.16 + (r + 0.5) * (areaD / rows),
            ]}
          >
            <boxGeometry args={[keyW, 0.01, keyD]} />
            <meshStandardMaterial color="#161922" roughness={0.55} metalness={0.15} />
          </mesh>
        );
      })}
    </group>
  );
}

function Laptop({ progressRef, onScreenState, bootProgress, teamProgress, startOpen, idle }) {
  const rootRef = useRef();
  const lidRef = useRef();
  const screenMatRef = useRef();
  const screenGlowRef = useRef();
  const localBoot = useRef(-1);
  const localTeam = useRef(-1);

  useFrame((state) => {
    const p = progressRef.current;

    const lidOpen = smoothstep(0.05, 0.45, p);
    const screenOn = smoothstep(0.32, 0.52, p);
    const bootT = smoothstep(0.42, 0.62, p);
    const teamT = smoothstep(0.62, 1.0, p);

    if (rootRef.current && idle) {
      rootRef.current.position.y = LAPTOP_Y + Math.sin(state.clock.elapsedTime * 0.65) * 0.01;
    }

    if (lidRef.current) {
      lidRef.current.rotation.x = lerp(CLOSED_ANGLE, OPEN_ANGLE, lidOpen);
    }

    if (screenMatRef.current) {
      screenMatRef.current.emissiveIntensity = lerp(0, 0.06, screenOn);
    }

    if (screenGlowRef.current) {
      screenGlowRef.current.intensity = lerp(0, 0.15, screenOn);
    }

    if (Math.abs(bootT - localBoot.current) > 0.01 || Math.abs(teamT - localTeam.current) > 0.01) {
      localBoot.current = bootT;
      localTeam.current = teamT;
      onScreenState({ boot: bootT, team: teamT, progress: p });
    }
  });

  const edgeT = 0.01;

  return (
    <group ref={rootRef} position={[0, LAPTOP_Y, 0]} scale={[0.86, 0.86, 0.86]}>
      <mesh position={[0, BASE_H / 2, 0]}>
        <boxGeometry args={[BASE_W, BASE_H, BASE_D]} />
        <meshStandardMaterial color={CHASSIS_DARK} metalness={0.5} roughness={0.4} />
      </mesh>

      <mesh position={[0, BASE_H + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[BASE_W * 0.97, BASE_D * 0.97]} />
        <meshStandardMaterial color={BASE_DECK} metalness={0.38} roughness={0.4} />
      </mesh>

      <mesh position={[-BASE_W / 2 + edgeT / 2, BASE_H / 2, 0]}>
        <boxGeometry args={[edgeT, BASE_H * 1.1, BASE_D * 0.98]} />
        <meshStandardMaterial color={EDGE_LIGHT} {...edgeMat} />
      </mesh>
      <mesh position={[BASE_W / 2 - edgeT / 2, BASE_H / 2, 0]}>
        <boxGeometry args={[edgeT, BASE_H * 1.1, BASE_D * 0.98]} />
        <meshStandardMaterial color={EDGE_LIGHT} {...edgeMat} />
      </mesh>

      <Keyboard />

      <mesh position={[0, BASE_H + 0.004, BASE_D * 0.28]}>
        <boxGeometry args={[0.72, 0.006, 0.42]} />
        <meshStandardMaterial color="#353d4d" metalness={0.35} roughness={0.45} />
      </mesh>

      <mesh position={[0, BASE_H + 0.01, -BASE_D / 2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.028, 0.028, BASE_W * 0.92, 12]} />
        <meshStandardMaterial color={CHASSIS_DARK} metalness={0.7} roughness={0.28} />
      </mesh>

      <group
        position={[0, BASE_H, -BASE_D / 2]}
        ref={lidRef}
        rotation={[startOpen ? OPEN_ANGLE : CLOSED_ANGLE, 0, 0]}
      >
        <mesh position={[0, LID_H / 2, 0]}>
          <boxGeometry args={[LID_W, LID_H, LID_T]} />
          <meshStandardMaterial color={LID_SHELL} metalness={0.52} roughness={0.34} />
        </mesh>

        <mesh position={[0, LID_H - edgeT / 2, LID_T / 2]}>
          <boxGeometry args={[LID_W * 0.98, edgeT, edgeT]} />
          <meshStandardMaterial color={EDGE_LIGHT} {...edgeMat} />
        </mesh>
        <mesh position={[-LID_W / 2 + edgeT / 2, LID_H / 2, LID_T / 2]}>
          <boxGeometry args={[edgeT, LID_H * 0.96, edgeT]} />
          <meshStandardMaterial color={EDGE_LIGHT} {...edgeMat} />
        </mesh>
        <mesh position={[LID_W / 2 - edgeT / 2, LID_H / 2, LID_T / 2]}>
          <boxGeometry args={[edgeT, LID_H * 0.96, edgeT]} />
          <meshStandardMaterial color={EDGE_LIGHT} {...edgeMat} />
        </mesh>

        <mesh position={[0, LID_H / 2, LID_T / 2 + 0.001]}>
          <planeGeometry args={[LID_W * 0.96, LID_H * 0.93]} />
          <meshStandardMaterial color={BEZEL_OUTER} roughness={0.48} metalness={0.25} />
        </mesh>

        <mesh position={[0, LID_H / 2, LID_T / 2 + 0.002]}>
          <planeGeometry args={[SCREEN_W + 0.08, SCREEN_H + 0.06]} />
          <meshStandardMaterial color={BEZEL_INNER} roughness={0.42} metalness={0.3} />
        </mesh>

        <mesh position={[0, LID_H / 2, LID_T / 2 + 0.003]}>
          <planeGeometry args={[SCREEN_W, SCREEN_H]} />
          <meshStandardMaterial
            ref={screenMatRef}
            color="#050608"
            emissive="#080c14"
            emissiveIntensity={0}
            roughness={0.65}
            metalness={0.05}
          />
        </mesh>

        <pointLight
          ref={screenGlowRef}
          position={[0, LID_H / 2, 0.35]}
          color="#22d3ee"
          distance={2.5}
          intensity={0}
        />

        <Html
          transform
          occlude
          position={[0, LID_H / 2, LID_T / 2 + 0.012]}
          distanceFactor={HTML_DISTANCE}
          zIndexRange={[20, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <TeamScreen bootProgress={bootProgress} teamProgress={teamProgress} />
        </Html>
      </group>
    </group>
  );
}

function bootLineSlices(bootProgress) {
  const visibleChars = Math.floor(bootProgress * BOOT_LINES.join('\n').length * 1.6);
  return BOOT_LINES.map((line, index) => {
    const used = BOOT_LINES.slice(0, index).join('').length;
    const remaining = visibleChars - used;
    return remaining <= 0 ? '' : line.slice(0, Math.max(0, remaining));
  });
}

function TeamScreen({ bootProgress, teamProgress }) {
  if (bootProgress <= 0.02 && teamProgress <= 0.02) return null;

  if (teamProgress <= 0.02) {
    const shownLines = bootLineSlices(bootProgress);
    const blink = bootProgress > 0.05 && Math.floor(bootProgress * 12) % 2 === 0;

    return (
      <div
        className="team-screen team-screen-boot"
        style={{ width: SCREEN_PX_W, height: SCREEN_PX_H }}
      >
        {BOOT_LINES.map((line, index) => (
          <div key={line} className="team-screen-boot-line">
            {shownLines[index]}
          </div>
        ))}
        {blink ? <span className="team-screen-cursor" /> : null}
      </div>
    );
  }

  return (
    <div className="team-screen" style={{ width: SCREEN_PX_W, height: SCREEN_PX_H }}>
      <div className="team-screen-boot-line">$ builtbywho --team</div>
      <div className="team-screen-boot-line team-screen-heading">meet the team</div>
      <div className="team-screen-grid">
        {team.map((dev, i) => {
          const cardStart = i / 4;
          const cardEnd = cardStart + 0.55 / 4;
          const local = smoothstep(cardStart, cardEnd, teamProgress);
          if (local <= 0.02) return <div key={dev.name} />;

          return (
            <div
              key={dev.name}
              className="team-screen-card"
              style={{
                opacity: local,
                transform: `translateY(${(1 - local) * 18}px)`,
              }}
            >
              {dev.image ? (
                <img src={dev.image} alt={dev.name} className="team-screen-avatar-img" />
              ) : (
                <div className="team-screen-avatar" style={{ background: dev.color }}>
                  {dev.initial || dev.name.charAt(0)}
                </div>
              )}
              <div className="team-screen-name">{dev.name}</div>
              <div className="team-screen-role">{dev.role}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.48} color="#fff8f0" />
      <directionalLight position={[4, 8, 5]} intensity={1.35} color="#fffdf8" />
      <directionalLight position={[-5, 4, 3]} intensity={0.42} color="#e8eef8" />
      <directionalLight position={[-3, 3, -4]} intensity={0.28} color="#ff1e3c" />
      <directionalLight position={[3, 5, -5]} intensity={0.18} color="#c8d0e0" />
    </>
  );
}

export default function LaptopTeamExperience({ lockedProgress = null }) {
  const wrapperRef = useRef(null);
  const progressRef = useRef(lockedProgress ?? 0);
  const [screenState, setScreenState] = useState({
    boot: lockedProgress == null ? 0 : 1,
    team: lockedProgress == null ? 0 : 1,
    progress: lockedProgress ?? 0,
  });

  useEffect(() => {
    if (lockedProgress != null) {
      progressRef.current = lockedProgress;
      return undefined;
    }

    const trigger = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    return () => trigger.kill();
  }, [lockedProgress]);

  const p = screenState.progress;
  const hintOpacity = lockedProgress != null || p >= 0.08 ? 0 : 1;

  return (
    <section
      ref={wrapperRef}
      className={`team-stage${lockedProgress != null ? ' team-stage-static' : ''}`}
    >
      <div className="team-stage-sticky">
        <div className="team-canvas-wrap">
          <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: false }}>
            <color attach="background" args={[STAGE_BG]} />
            <StageEnvironment />
            <CameraRig progressRef={progressRef} startOpen={lockedProgress != null} />
            <Lights />
            <Laptop
              progressRef={progressRef}
              onScreenState={setScreenState}
              bootProgress={screenState.boot}
              teamProgress={screenState.team}
              startOpen={lockedProgress != null}
              idle={lockedProgress == null}
            />
            <ContactShadows
              position={[0, LAPTOP_Y, 0]}
              opacity={0.45}
              scale={6.5}
              blur={2.8}
              far={2.5}
              color="#3d2a18"
            />
          </Canvas>
        </div>

        <div className="team-scroll-hint" style={{ opacity: hintOpacity }}>
          <span>scroll to open</span>
          <span className="team-scroll-hint-bar" />
        </div>
      </div>
    </section>
  );
}
