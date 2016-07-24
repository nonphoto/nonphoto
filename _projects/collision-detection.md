---
layout: project
title: Collision Detection
tags:
- code
---

Collision detection is a common problem in game development, but it has many solutions. In the 2D realm your options can lie anywhere between dead-simple [tile-based detection](https://en.wikipedia.org/wiki/Tile-based_video_game) to all-purpose [physics libraries](http://box2d.org). However, I noticed that there were few solutions that handled slopes, gravity, and friction as well as a physics library, but were still relatively light-weight. Since I was planning on making a 2D platformer with a level-editor, I took this as an opportunity to roll my own.

I tried to think about the problem in a novel way. Instead of detecting collisions between arbitrary shapes, I only check rectangles against lines. This is a nice abstraction because most game entities are roughly rectangle-shaped, and most game levels are really just a collection of lines. Since I can construct any shape by drawing lines end to end, I actually have more descriptive power this way, and it's actually quite fast because the algorithm only checks against lines that are visible on-screen.

I use [Verlet integration](https://en.wikipedia.org/wiki/Verlet_integration) to make the entity's movement feel weighty. If the entity intersects with a line, the line moves the entity back outside the line in the direction of the line's normal. This is similar to the system used in one of my favorite 2D games, [N](http://www.thewayoftheninja.org/nv2.html), except their system checks against tiles, not lines.

![Demo 00]({{ site.url }}/assets/{{ page.slug }}/demo-00.gif)

Notice that the entity will slide down slopes because diagonal lines will push the entity sideways as gravity pulls it downward. The collision only occurs in one direction, so if the entity intersects a line from below, it is not affected. This makes it easy to create one-way platforms.

![Demo 01]({{ site.url }}/assets/{{ page.slug }}/demo-01.gif)

You can also draw new lines in real-time!

![Demo 02]({{ site.url }}/assets/{{ page.slug }}/demo-02.gif)

You can edit existing lines by dragging the ends. The ends snap to each other so there's no gap or overlap.

![Demo 03]({{ site.url }}/assets/{{ page.slug }}/demo-03.gif)

I implemented line deletion by checking for intersections with another rectangle.

![Demo 04]({{ site.url }}/assets/{{ page.slug }}/demo-04.gif)

I'm still surprised how similar the results are to [Line Rider](http://www.linerider.org/play.php), but hopefully I can turn this into a full game someday. The Lua [source code](https://github.com/nonphoto/denizen/blob/master/terrain.lua) is available, but I haven't documented it, so it might be more helpful to check out the [N collision tutorials](http://www.metanetsoftware.com/technique/tutorialA.html) if you're still curious.
