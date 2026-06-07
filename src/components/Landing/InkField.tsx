import { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`

// A slow, dark, domain-warped flow field — the landing's refined signature. Faint warm
// variation and ember blooms over the near-black canvas, with a soft glow that follows the
// cursor. Deliberately low-contrast: atmosphere, not a focal point.
const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uAspect;
  uniform vec3 uBg;
  uniform vec3 uAccent;
  varying vec2 vUv;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.0 + 7.0; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 p = vec2((uv.x - 0.5) * uAspect, uv.y - 0.5);
    float t = uTime * 0.035;

    // domain warp for slow, organic flow
    vec2 q = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 + vec2(5.2, 1.3) - t));
    float f = fbm(p * 1.7 + q * 1.1 + t);

    vec3 col = uBg;
    col += (f - 0.45) * 0.07 * vec3(1.0, 0.9, 0.74);     // faint warm variation
    col = mix(col, uAccent * 0.5, smoothstep(0.64, 0.96, f) * 0.10); // ember blooms

    // soft cursor glow
    float md = length(vec2((uv.x - uMouse.x) * uAspect, uv.y - uMouse.y));
    col += uAccent * 0.13 * smoothstep(0.5, 0.0, md);

    // gentle vignette to settle the edges
    col *= 0.82 + 0.18 * smoothstep(1.25, 0.15, length(p));

    gl_FragColor = vec4(col, 1.0);
  }
`

function resolveColor(css: string, fallback: [number, number, number]): [number, number, number] {
  try {
    const c = document.createElement('canvas')
    c.width = c.height = 1
    const ctx = c.getContext('2d')
    if (!ctx) return fallback
    ctx.fillStyle = '#000'
    ctx.fillStyle = css
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    return [r / 255, g / 255, b / 255]
  } catch {
    return fallback
  }
}

/** Renders the animated field. Returns null under reduced motion (Landing shows a static gradient). */
export default function InkField({ reduced }: { reduced: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (reduced || !host) return

    let renderer: Renderer
    try {
      renderer = new Renderer({ alpha: false, dpr: Math.min(window.devicePixelRatio, 1.5) })
    } catch {
      return
    }
    const gl = renderer.gl
    const canvas = gl.canvas as HTMLCanvasElement
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'
    host.appendChild(canvas)

    const css = getComputedStyle(document.documentElement)
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: [0.5, 0.5] },
        uAspect: { value: 1 },
        uBg: { value: resolveColor(css.getPropertyValue('--bg').trim(), [0.1, 0.08, 0.06]) },
        uAccent: { value: resolveColor(css.getPropertyValue('--accent').trim(), [0.85, 0.66, 0.35]) },
      },
    })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      program.uniforms.uAspect.value = window.innerWidth / window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const target = [0.5, 0.5]
    const onMove = (e: PointerEvent) => {
      target[0] = e.clientX / window.innerWidth
      target[1] = 1 - e.clientY / window.innerHeight
    }
    window.addEventListener('pointermove', onMove)

    let raf = 0
    let running = true
    const loop = (now: number) => {
      const m = program.uniforms.uMouse.value as number[]
      m[0] += (target[0] - m[0]) * 0.05 // eased cursor follow
      m[1] += (target[1] - m[1]) * 0.05
      program.uniforms.uTime.value = now / 1000
      renderer.render({ scene: mesh })
      if (running) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVisibility)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      canvas.remove()
    }
  }, [reduced])

  return <div ref={hostRef} className="inkfield" aria-hidden="true" />
}
