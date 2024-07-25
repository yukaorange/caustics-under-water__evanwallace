varying float vHeight;

#include './utils/fbm.glsl'

void main() {
  vec3 pos = position;

  pos.z += fbm(position * 5.1) * 2.0;

  pos.z += cnoise(position + 5.2) * 1.5;

  vHeight = pos.z;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}