export const vertex_shader_2d_300es_translation = "#version 300 es\r\n\r\n\r\nin vec4 a_position;\r\nuniform vec4 u_translation;\r\n\r\n\r\nvoid main() {\r\n \r\n \r\n \r\n\r\n vec4 position = a_position + u_translation;\r\n gl_Position = position;\r\n}\r\n\r\n"