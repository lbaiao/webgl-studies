#version 300 es

// an attribute will receive data from a buffer
in vec4 a_position;
uniform vec4 u_translation;

// all shaders have a main function
void main() {
	// gl_Position is a special variable a vertex shader
	// is responsible for setting
	// gl_Position = a_position * u_scale;

	vec4 position = a_position + u_translation;
	gl_Position = position;
}

