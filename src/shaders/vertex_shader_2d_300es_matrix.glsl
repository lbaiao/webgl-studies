#version 300 es

// an attribute will receive data from a buffer
in vec4 a_position;
uniform mat3 u_matrix;
uniform float u_fixXScale;

vec4 fixCanvasScale(vec4 pos) {
	return vec4(pos.x * u_fixXScale, pos.y, 1, 1);
}

// all shaders have a main function
void main() {
	// gl_Position is a special variable a vertex shader
	// is responsible for setting	
	// vec4 position = vec4(a_position.xyz * u_matrix, 1);
	// if (u_matrix[2][0] == 0.0) {
	// 	gl_Position = vec4(.5, .5, 0, 1);
	// } 
	// else {
	// 	gl_Position = vec4(a_position.x + u_matrix[2][0], a_position.y + u_matrix[2][1], 0, 1);
	// }


	vec4 position = vec4((u_matrix * vec3(a_position.xy, 1)).xy, 0, 1);
	// vec2 position = (u_matrix * vec3(a_position, 1)).xy;
	position = fixCanvasScale(position);

	// gl_Position = vec4(position, 0, 1);
	gl_Position = position;
}
