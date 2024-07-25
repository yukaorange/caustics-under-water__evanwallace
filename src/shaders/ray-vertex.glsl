uniform float uTime;

varying vec3 vEye;
varying vec3 vNormal;
varying vec3 vWorldPos;

#include "./utils/cnoise.glsl";

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);

  vWorldPos = worldPosition.xyz;

  vEye = normalize(worldPosition.xyz - cameraPosition);

  vec3 pos = position;

  pos.x += sin(length(pos.y + uTime * 0.1) + uTime * 1.2) * 0.14;

  vNormal = normalMatrix * normal;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}