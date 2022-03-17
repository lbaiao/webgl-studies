//#version 300 es

// an attribute will receive data from a buffer
attribute vec4 a_position;
uniform vec4 u_scale;

// all shaders have a main function
void main() {
	// gl_Position is a special variable a vertex shader
	// is responsible for setting
	// gl_Position = a_position * u_scale;
	gl_Position = a_position;
}

