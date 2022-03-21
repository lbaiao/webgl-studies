#version 300 es

// an attribute will receive data from a buffer
in vec4 a_position;
uniform vec4 u_translation;
// uniform float u_rotation;
uniform float u_rotation;
uniform float u_fixXScale;
uniform vec2 u_scale;

vec4 fixCanvasScale(vec4 pos) {
	return vec4(
		pos.x * u_fixXScale,
		pos.y, 0, 1);
}

vec4 rotate(vec4 pos) {
	return vec4(
		pos.x * cos(u_rotation) + pos.y * sin(u_rotation),
		pos.x * (-sin(u_rotation)) + pos.y * cos(u_rotation),
		0, 1
	);
}

// all shaders have a main function
void main() {
	// gl_Position is a special variable a vertex shader
	// is responsible for setting
	vec4 position;

	// scaling
	position = vec4(a_position.x * u_scale.x, a_position.y * u_scale.y * u_fixXScale, 0, 1);
	position = fixCanvasScale(position);

	// rotation
	position = rotate(position);
	position = fixCanvasScale(position);

	// translation
	position += u_translation;
	gl_Position = position;
}



