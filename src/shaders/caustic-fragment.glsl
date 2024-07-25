uniform float uLightIntensity;

varying vec2 vUv;
varying vec3 vOldPos;
varying vec3 vNewPos;

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

void main() {
  float beforeArea = length(dFdx(vOldPos)) *
    length(dFdy(vNewPos));

  float afterArea = length(dFdx(vNewPos)) *
    length(dFdy(vNewPos));

  vec3 color = vec3(beforeArea / afterArea) * uLightIntensity;//to emit caustic pattern

  float dist = distance(vec2(0.0), vUv * 2.0 - 1.0);//for caustic fadeout

  color = color * (1.0 - smoothstep(0.0, 1.0, dist));//for causitc fadeout

  color = color + luma(color);

  gl_FragColor = vec4(color, 1.0);
}