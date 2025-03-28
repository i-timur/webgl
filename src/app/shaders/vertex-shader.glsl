#version 300 es

in vec3 a_position;

uniform mediump float uPointSize;
uniform float uAngle;

void main() {
  gl_PointSize = uPointSize;
  gl_Position = vec4(
  cos(uAngle) * 0.8 + a_position.x,
  sin(uAngle) * 0.8 + a_position.y,
  a_position.z,
  1.0
  );
}
