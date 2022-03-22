export const vertex_shader_2d_300es_matrix = "#version 300 es\r\n\r\n\r\nin vec4 a_position;\r\nuniform mat3 u_matrix;\r\nuniform float u_fixXScale;\r\n\r\nvec4 fixCanvasScale(vec4 pos) {\r\n return vec4(pos.x * u_fixXScale, pos.y, 1, 1);\r\n}\r\n\r\n\r\nvoid main() {\r\n \r\n \r\n \r\n \r\n \r\n \r\n \r\n \r\n \r\n\r\n\r\n vec4 position = vec4((u_matrix * vec3(a_position.xy, 1)).xy, 0, 1);\r\n \r\n position = fixCanvasScale(position);\r\n\r\n \r\n gl_Position = position;\r\n}\r\n"