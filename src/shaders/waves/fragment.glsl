precision mediump float;

varying vec2 vUv;
varying float vElevation;

void main() {
    vec3 color = vec3(vUv, 1.0);
    color *= vElevation * 2.0 + 0.5;
    gl_FragColor = vec4(color, 1.0);
}