float calcFresnel(vec3 eyeVector, vec3 worldNormal) {
  return pow(1.0 + dot(eyeVector, worldNormal), 2.5);
}