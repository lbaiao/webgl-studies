#version 300 es

// an attribute will receive data from a buffer
in vec4 a_position;
uniform mat4 u_matrix;
uniform float u_fixXScale;

vec4 fixCanvasScale(vec4 pos) {
	return vec4(pos.x * u_fixXScale, pos.y, pos.z, pos.w);
}

// all shaders have a main function
void main() {
	// gl_Position is a special variable a vertex shader
	// is responsible for setting	

	vec4 position = u_matrix * a_position;
	position = fixCanvasScale(position);

	// gl_Position = vec4(position, 0, 1);
	gl_Position = position;
}
