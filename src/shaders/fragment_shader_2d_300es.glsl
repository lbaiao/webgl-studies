#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision highp float;
out vec4 outColor;
uniform vec4 u_color;

void main() {
	// gl_FragColor is a special variable a fragment shader
	// is responsible for setting
	outColor = u_color;
}

