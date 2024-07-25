uniform float uTime;
uniform float uWave1;
uniform float uWave2;

varying vec2 vUv;

varying vec3 vOldPos;
varying vec3 vNewPos;

#include "./utils/cnoise.glsl"

void main() {
  vUv = uv;

  vec3 pos = position;

  float decay = smoothstep(0.0, 0.3, length(pos.xy));

  pos.z += sin(length(pos + uTime * 0.1) * uWave1 - uTime * 0.1) * decay * 0.5;

  pos.z += cnoise(position.xzz * uWave2 + uTime * 0.1) * decay * 0.5;

  vOldPos = position;

  vNewPos = pos;

  gl_Position = vec4(position, 1.0);
}