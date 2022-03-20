#version 300 es

// an attribute will receive data from a buffer
in vec4 a_position;
uniform vec4 u_translation;
// uniform float u_rotation;
uniform float u_rotation;

// all shaders have a main function
void main() {
	// gl_Position is a special variable a vertex shader
	// is responsible for setting
	// gl_Position = a_position * u_scale;
	// float sinTheta = sin(u_rotation);
	// float cosTheta = cos(u_rotation)

	vec4 rotatedPosition = vec4(
		a_position.x * cos(u_rotation) + a_position.y * sin(u_rotation),
		a_position.x * (-sin(u_rotation)) + a_position.y * cos(u_rotation),
		0, 1
	);	

	vec4 position = rotatedPosition + u_translation;
	gl_Position = position;
}

