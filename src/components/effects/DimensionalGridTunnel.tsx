import { useEffect, useRef } from "react"
import * as THREE from "three"

const vertexShader = `
  uniform float uTime;
  uniform vec2 uFrequency;
  uniform vec2 uAmplitude;
  uniform float uDensity;
  uniform float uStrength;
  uniform float uCameraZ;
  uniform float uMouseX;
  uniform float uMouseY;
  uniform float uMouseSmoothX;
  uniform float uMouseSmoothY;
  uniform float uSpeed;
  varying vec2 vUv;
  varying vec2 vLine;
  varying float vCenter;
  varying float vDepth;
  #define PI 3.141592653589793
  vec3 getCenter(vec3 p) {
    float x = floor(p.x / uDensity) * uDensity + uDensity * 0.5;
    float y = floor(p.y / uDensity) * uDensity + uDensity * 0.5;
    float z = floor(p.z / uDensity) * uDensity + uDensity * 0.5;
    return vec3(x, y, z);
  }
  vec3 getWave(vec3 center) {
    float wx = sin(center.x * uFrequency.x + uTime * 0.5) * uAmplitude.x;
    float wy = cos(center.y * uFrequency.y + uTime * 0.3) * uAmplitude.y;
    return vec3(wx, wy, 0.0);
  }
  vec3 getAnimation(vec3 center) {
    float flow = mod(uTime * uSpeed * 20.0, 20.0);
    return vec3(0.0, 0.0, -flow);
  }
  vec3 getY(float z, float x) {
    float val = sin(z * 0.5 + uTime * 0.2) * cos(x * 0.3 + uTime * 0.15) * 0.02;
    return vec3(0.0, val, 0.0);
  }
  void main() {
    vUv = uv;
    vLine = uv * uDensity;
    vCenter = distance(uv, vec2(0.5));
    vDepth = (uCameraZ - position.z) / uCameraZ;
    vec3 toCenter = getCenter(position);
    vec3 wave = getWave(toCenter);
    vec3 animation = getAnimation(toCenter);
    vec3 newPosition = position + wave + animation;
    vec3 y = getY(newPosition.z, newPosition.x);
    newPosition += y;
    float tiltX = uMouseSmoothY * 0.3;
    float tiltY = -uMouseSmoothX * 0.3;
    vec3 tilted = newPosition;
    tilted.y = newPosition.y * cos(tiltX) - newPosition.z * sin(tiltX);
    tilted.z = newPosition.y * sin(tiltX) + newPosition.z * cos(tiltX);
    vec3 finalPos = tilted;
    finalPos.x = tilted.x * cos(tiltY) + tilted.z * sin(tiltY);
    finalPos.z = -tilted.x * sin(tiltY) + tilted.z * cos(tiltY);
    float strength = uStrength * (1.0 - vCenter);
    finalPos.x *= 1.0 + strength * 0.1;
    finalPos.y *= 1.0 + strength * 0.1;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  varying vec2 vLine;
  varying float vCenter;
  varying float vDepth;
  float getVisibility(float line, float center) {
    float v = smoothstep(1.0, 0.0, pow(abs(line), 2.0));
    v *= pow(center, 4.0);
    return v;
  }
  void main() {
    vec2 center = vec2(vCenter);
    float horizontalLine = getVisibility(vLine.x, center.x);
    float verticalLine = getVisibility(vLine.y, center.y);
    vec3 lineColor = vec3(0.0, 0.9, 1.0);
    vec3 borderColor = vec3(0.615, 0.305, 0.86);
    float leftBorder = smoothstep(0.01, 0.0, vUv.x);
    float rightBorder = smoothstep(0.99, 1.0, vUv.x);
    gl_FragColor = vec4(
      (lineColor * verticalLine * 0.3 + lineColor * horizontalLine + borderColor * leftBorder + borderColor * rightBorder)
      * (vDepth + 0.5) + 0.05,
      1.0
    );
  }
`

export default function DimensionalGridTunnel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, smoothX: 0, smoothY: 0 })
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color("#06060D")

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 4.5

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    renderer.domElement.style.display = "block"
    container.appendChild(renderer.domElement)

    const geometry = new THREE.PlaneGeometry(12, 12, 80, 80)
    const material = new THREE.ShaderMaterial({
      vertexShader, fragmentShader,
      uniforms: {
        uFrequency: new THREE.Uniform(new THREE.Vector2(2, 4)),
        uAmplitude: new THREE.Uniform(new THREE.Vector2(0.05, 0.05)),
        uDensity: new THREE.Uniform(1),
        uStrength: new THREE.Uniform(1),
        uDeepPurple: new THREE.Uniform(1),
        uOpacity: new THREE.Uniform(0.08),
        uCameraZ: new THREE.Uniform(4.5),
        uTime: new THREE.Uniform(0),
        uMouseX: new THREE.Uniform(0),
        uMouseY: new THREE.Uniform(0),
        uMouseSmoothX: new THREE.Uniform(0),
        uMouseSmoothY: new THREE.Uniform(0),
        uSpeed: new THREE.Uniform(0.01),
      },
      side: THREE.DoubleSide, transparent: true,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = -Math.PI * 0.4
    scene.add(mesh)

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth - 0.5
      mouseRef.current.y = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener("mousemove", onMouseMove)

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", onResize)

    const clock = new THREE.Clock()
    const animate = () => {
      const elapsed = clock.getElapsedTime()
      const s = 0.05
      mouseRef.current.smoothX += (mouseRef.current.x - mouseRef.current.smoothX) * s
      mouseRef.current.smoothY += (mouseRef.current.y - mouseRef.current.smoothY) * s
      material.uniforms.uTime.value = elapsed
      material.uniforms.uMouseX.value = mouseRef.current.x
      material.uniforms.uMouseY.value = mouseRef.current.y
      material.uniforms.uMouseSmoothX.value = mouseRef.current.smoothX
      material.uniforms.uMouseSmoothY.value = mouseRef.current.smoothY
      renderer.render(scene, camera)
      frameRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div ref={containerRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, background: "#06060D" }} />
  )
}
