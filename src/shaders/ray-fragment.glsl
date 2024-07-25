uniform float uIntensity;
uniform float uTime;

varying vec3 vEye;
varying vec3 vNormal;
varying vec3 vWorldPos;

#include "./utils/fresnel.glsl"

void main() {
  vec3 color = vec3(1.0);

  float fresnel = calcFresnel(vEye, vNormal);

  float alpha = pow(fresnel * 0.1, 1.1);

  alpha = fresnel * uIntensity;

  float decay = pow(vWorldPos.y * 0.16, 3.8);

  color *= fresnel;

  alpha *= decay;

  gl_FragColor = vec4(color, alpha);
}
