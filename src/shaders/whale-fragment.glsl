#include <output_fragment>

float stripes = mod(vWorldPosition.x * vWorldPosition.y * 20.0 + uTime * 1., 1.0);

stripes = pow(stripes, 3.56);

stripes = smoothstep(0.0, 0.5, stripes);

vec3 normalized_normal = normalize(vMyNormal);

if(! gl_FrontFacing) {
normalized_normal *= - 1.0;
}

vec3 viewDirection = normalize(vWorldPosition - cameraPosition);

float fresnel = dot(viewDirection, normalized_normal) + 1.0;

fresnel = pow(fresnel, 2.0);

float holographic = stripes * fresnel;

holographic += fresnel * 1.2;

float falloff = smoothstep(0.8, 0.0, fresnel);

holographic *= falloff;

vec3 color = vec3(1.0);

color = uColor.rgb;

gl_FragColor = vec4(color, holographic);