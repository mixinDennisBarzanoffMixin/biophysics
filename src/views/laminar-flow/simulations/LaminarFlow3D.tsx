import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useInViewport } from '@/hooks/use-in-viewport'

interface LaminarFlow3DProps {
  radius: number
  pressure: number
  viscosity: number
  length: number
}

const PARTICLE_COUNT = 10000 // GPU-driven particle positioning
const VISUAL_RADIUS_SCALE = 0.05
const LENGTH_SCALE = 0.1

// Vertex Shader: Handles particle positioning
const vertexShader = `
  uniform float uTime;
  uniform float uRadius;
  uniform float uPressure;
  uniform float uViscosity;
  uniform float uLength;
  uniform float uVelocityScale;
  
  attribute vec4 aParticleData; // x: rNormalized, y: theta, z: zNormalized, w: randomOffset

  varying vec3 vColor;
  varying float vSpeed;
  varying float vRNorm;

  void main() {
    float rNorm = aParticleData.x;
    float theta = aParticleData.y;
    float zStart = aParticleData.z;
    float randomOffset = aParticleData.w;

    // Physical Constants
    float visualRadius = uRadius * ${VISUAL_RADIUS_SCALE};
    float visualLength = max(uLength * ${LENGTH_SCALE}, 1.0); // Avoid divide by zero
    
    // Match the same Poiseuille terms used in the 2D sim:
    // v(r) = (ΔP / (4 μ L)) * R^2 * (1 - (r/R)^2) * scale
    float denom = max(4.0 * uViscosity * uLength, 0.001);
    float velocity = (uPressure / denom) * (uRadius * uRadius) * (1.0 - rNorm * rNorm) * uVelocityScale;
    
    // Calculate new Z position
    // z = (zStart + velocity * time) % 1.0 (normalized)
    float zCurrent = mod(zStart + (velocity * uTime) / visualLength, 1.0);
    
    // Map back to 3D cylinder coordinates
    // Center the cylinder on Z axis from -L/2 to L/2
    float zWorld = (zCurrent - 0.5) * visualLength;
    float rWorld = rNorm * visualRadius;
    
    // Build positions in cylinder local space where the axis is Y (Three.js cylinder default).
    // The parent group rotates this cylinder (and the blood) onto the world axis we want.
    float yWorld = zWorld;

    // Match THREE.CylinderGeometry convention (theta=0 at +Z):
    // x = r * sin(theta), z = r * cos(theta)
    float xWorld = rWorld * sin(theta);
    float zWorld2 = rWorld * cos(theta);
    
    vec3 instancePos = vec3(xWorld, yWorld, zWorld2);
    
    // Pass speed to fragment shader for coloring
    vSpeed = velocity;
    vRNorm = rNorm;
    
    // Standard instance transform + vertex position
    // gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    // But since we are manually calculating instancePos, we add it to the vertex position
    
    vec3 transformed = position + instancePos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`

// Fragment Shader: Handles coloring
const fragmentShader = `
  varying float vSpeed;
  varying float vRNorm;
  
  void main() {
    // Make faster particles slightly brighter/yellower
    // float intensity = 0.5 + vSpeed * 5.0; 
    // vec3 color = mix(vec3(0.8, 0.1, 0.1), vec3(1.0, 0.3, 0.2), clamp(vSpeed * 0.1, 0.0, 1.0));
    
    // Simple red blood cell color
    vec3 color = vec3(0.93, 0.26, 0.26); // #ef4444

    // Slightly darker near the centerline (r -> 0)
    float edgeFactor = smoothstep(0.0, 1.0, vRNorm); // 0 at center, 1 at wall
    // More pronounced center darkening
    float shade = mix(0.65, 1.0, pow(edgeFactor, 0.85));
    color *= shade;
    
    // Simple lighting (fake dot product)
    vec3 light = normalize(vec3(1.0, 1.0, 1.0));
    // We don't have normals from vertex shader properly transformed here without more work,
    // so let's stick to flat nice color or simulate basic shading
    
    gl_FragColor = vec4(color, 1.0);
  }
`

function BloodFlow({ radius, pressure, viscosity, length }: LaminarFlow3DProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  // Generate static particle data once
  const particleData = useMemo(() => {
    const data = new Float32Array(PARTICLE_COUNT * 4)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i4 = i * 4
      data[i4] = Math.sqrt(Math.random()) // rNormalized (square root for uniform area distribution)
      data[i4 + 1] = Math.random() * Math.PI * 2 // theta
      data[i4 + 2] = Math.random() // zNormalized (0 to 1)
      data[i4 + 3] = Math.random() // random offset
    }
    return data
  }, [])
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uRadius.value = radius
      materialRef.current.uniforms.uPressure.value = pressure
      materialRef.current.uniforms.uViscosity.value = viscosity
      materialRef.current.uniforms.uLength.value = length
      materialRef.current.uniforms.uVelocityScale.value = 0.01
    }
  })

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uRadius: { value: radius },
    uPressure: { value: pressure },
    uViscosity: { value: viscosity },
    uLength: { value: length },
    uVelocityScale: { value: 0.01 },
  }), []) // Empty deps, we update in useFrame

  return (
    <instancedMesh args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[0.12, 8, 8]}>
        <instancedBufferAttribute 
          attach="attributes-aParticleData" 
          args={[particleData, 4]} 
        />
      </sphereGeometry>
      <shaderMaterial 
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </instancedMesh>
  )
}

export const LaminarFlow3D = ({ radius, pressure, viscosity, length }: LaminarFlow3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInViewport(containerRef, { rootMargin: '250px' })
  const visualRadius = radius * VISUAL_RADIUS_SCALE
  const visualLength = Math.max(length * LENGTH_SCALE, 1.0)
  const sceneScale = Math.max(visualLength, visualRadius * 2)
  const minDistance = Math.max(sceneScale * 0.75, 1.5)
  const maxDistance = Math.max(sceneScale * 4, 12)

  return (
    <div ref={containerRef} className="w-full h-[500px] bg-white rounded-lg overflow-hidden border border-slate-200 relative">
      <div className="absolute top-4 left-4 z-10 text-slate-800 pointer-events-none">
        <h3 className="font-bold">3D Laminar Flow (GPU Accelerated)</h3>
        <p className="text-sm">10,000 Particles simulated in Vertex Shader</p>
      </div>
      {inView ? (
        <Canvas dpr={[1, 2]}>
          <color attach="background" args={['#ffffff']} />
          <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />

          {/* Vessel + blood share the same rotated space */}
          <group rotation={[Math.PI/2, 0, 0]}>
            <BloodFlow radius={radius} pressure={pressure} viscosity={viscosity} length={length} />
            <mesh>
              <cylinderGeometry
                args={[
                  radius * VISUAL_RADIUS_SCALE,
                  radius * VISUAL_RADIUS_SCALE,
                  length * LENGTH_SCALE,
                  32,
                  1,
                  true,
                ]}
              />
              <meshPhysicalMaterial
                color="#88ccff"
                transparent
                opacity={0.15}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </group>

          <OrbitControls minDistance={minDistance} maxDistance={maxDistance} />
          <gridHelper args={[20, 20, 0xd1d5db, 0xe5e7eb]} />
        </Canvas>
      ) : (
        <div className="h-full w-full grid place-items-center text-sm text-slate-500">
          3D view paused while offscreen
        </div>
      )}
    </div>
  )
}
