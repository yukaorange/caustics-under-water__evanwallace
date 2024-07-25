varying float vHeight;

void main() {
  vec3 color = vec3(vHeight);

  gl_FragColor = vec4(color, 1.0);
}