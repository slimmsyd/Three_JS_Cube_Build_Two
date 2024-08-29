import {
        Vector2,
        Vector3
} from 'three';



const GradientShader = {

	name: 'GradientShader',

	uniforms: {
        'u_resolution': { value: new Vector2( window.innerWidth/2, window.innerHeight/2 ) },
        'u_colorA': { value: new Vector3( 1.0,0.0,0.0 ) },
        'u_colorB': { value: new Vector3( 0.0,0.0,1.0 ) },
        'u_colorC': { value: new Vector3( 0.4,0.0,1.0 ) },
        'u_colorD': { value: new Vector3( 0.0,1.0,0.0 ) },
        'u_opacity': { value: 0.8 }
	},

	vertexShader: /* glsl */`

        varying vec2 vUv;
        void main()	{
            vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,

	fragmentShader: /* glsl */`

        uniform vec2 u_resolution;
        uniform vec3 u_colorA;
        uniform vec3 u_colorB;
        uniform vec3 u_colorC;
        uniform vec3 u_colorD;
        uniform float u_opacity;

        void main() {

            vec2 uv = gl_FragCoord.xy/u_resolution.xy*0.5;

            float smoth = (sin(uv.x * 1.3) * cos(uv.x)) * 1.0;
            float smoth3 = sin(uv.x);
            float smoth2 = sin(uv.y);

            vec3 col = mix(mix(u_colorA, u_colorB,smoth2), mix(u_colorC, u_colorD, smoth3),smoth); 
            vec3 colr = mix(u_colorA, u_colorB, smoth); 
            
            gl_FragColor = vec4(col,u_opacity);

        }`

};

const GradientGreyShader = {

	name: 'GradientGreyShader',

	uniforms: {
        'u_resolution': { value: new Vector2( window.innerWidth/2, window.innerHeight/2) },
        'u_colorA': { value: new Vector3( 0.15,0.15,0.15 ) },
        'u_colorB': { value: new Vector3( 0.525,0.525,0.525 ) },
        'u_opacity': { value: 1.0 }
	},

	vertexShader: /* glsl */`

        varying vec2 vUv;
        void main()	{
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,

	fragmentShader: /* glsl */`

        #ifdef GL_ES
        precision mediump float;
        #endif

        #define PI 3.14159265359

        uniform vec2 u_resolution;
        uniform vec3 u_colorA;
        uniform vec3 u_colorB;
        uniform float u_opacity;

        const float adjust = -0.05;

        void main() {
            vec2 st = gl_FragCoord.xy/u_resolution;

            vec3 color = vec3(0.0);

            vec3 pct = vec3((st.y + (1.0-pow(st.x,0.5)))/2.5 + adjust);

            color = mix(u_colorA, u_colorB, pct);
            color.r += 0.003 * ((1.0 - st.y) + st.x);
            color.g += 0.003 * st.x;

            gl_FragColor = vec4(color,u_opacity);
        }`

};

export { GradientShader, GradientGreyShader };
