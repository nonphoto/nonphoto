---
layout: project
title: Sky Simulation
tags:
- code
---

This project is a GLSL shader that approximates the visual effects of atmospheric scattering and clouds. I completed this project with [Benji Jones](https://github.com/benjijones) as a midterm assignment for Computational Graphics at Williams College. Graphics shaders and atmospheric scattering are both pretty complicated topics, but I'll try write a quick overview here. If you want more information, check out the [Github repository](https://github.com/nonphoto/atmospheric-scattering).

![Looped animation]({{ site.url }}/assets/{{ page.slug }}/video.gif)

The shader is composed of two parts: an atmosphere shader that works by simulating the scattering of light particles in the atmosphere, and a cloud shader that draws clouds by simulating how light from the atmosphere shader scatters in a density field. The shader produces an image with a technique called [ray casting](https://en.wikipedia.org/wiki/Volume_ray_casting), which projects a ray out from the focal point of a virtual camera for each pixel of the rendering surface, and calculates the color of light coming from equally spaced points along the ray.

Earth's atmosphere is composed of billions of tiny particles, and all of these particles scatter light to varying degrees. This is how we can see the sky; light from the sun enters the atmosphere and hits some point in the volume of the atmosphere that scatters it toward your eye. We do a primary ray-cast to calculate the light scattered toward the camera, and a secondary ray-cast to calculate the light that directly reaches each point in the first ray-cast.

Like the atmosphere, clouds are a semi-transparent volume. Unlike the atmosphere, clouds have a much greater variation in density. We didn't want to do any modeling, so we used a noise function to generate an infinite field of clouds. Clouds are translucent, but they are dense enough to cast shadows on themselves. For this reason, rays from the camera penetrate through the cloud, and each step along the ray calculates how much that point is in shadow.
