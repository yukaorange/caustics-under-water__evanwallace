uniform float uIntensity;
uniform float uTime;

varying vec3 vEye;
varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec3 vPosition;

float PI = 3.14159265359;
float TWO_PI = 6.28318530718;

#include "./utils/fresnel.glsl"
#include "./utils/cnoise.glsl"

void main() {
  vec3 color = vec3(1.0);
  float alpha = 1.0;

  //fresnel
  float fresnel = calcFresnel(vEye, vNormal);

  alpha = fresnel * uIntensity;

  // fresnel

  //curtain
  float distFromAxis = length(vPosition.xz);

  float angle = atan(vPosition.z, vPosition.x);

  float randomSeed = sin(uTime * 0.165) + sin(uTime * 0.211) + sin(uTime + 0.345) * 0.5 + 0.5;

  float noise = cnoise(vPosition.zzz * angle);

  float numRays = 12.0;

  float rayAngle = mod(angle + uTime * 0.1, TWO_PI / numRays) - (TWO_PI / numRays * 0.5);

  float rayIntensity = smoothstep(0.5, 0.0, abs(rayAngle));

  float lateralGradient = smoothstep(0.0, 0.3, abs(rayAngle * noise * 0.8));

  float wave = sin(distFromAxis * 2.0 - (sin(uTime) * 0.5 + 0.5)) * 0.5 + 0.5;

  float decay = pow(vWorldPos.y * 0.6, 1.2);

  alpha = alpha * wave;
  alpha = alpha * rayIntensity;
  alpha = alpha * lateralGradient;
  alpha = alpha * decay;

  //curtain

  gl_FragColor = vec4(color, alpha);
}
