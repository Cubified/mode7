# mode7

A pure-Javascript perspective transform (a la SNES Mode 7).

## Demo

[Try online](https://cubified.github.io/mode7/)

![Demo](https://github.com/Cubified/mode7/raw/master/demo.gif)

## Explanation

There is a bit of information in `mode7.js` and a more detailed explanation in `mode7_worker.js`, but here is another explanation of the effect:

![Explanation](https://github.com/Cubified/mode7/raw/master/expl.png)

In sum, the illusion of depth arises out of the z coordinate of a pixel in 3d space being related to its y coordinate in 2d space -- the closer a pixel is to the camera, the larger it will appear in the view window. Additionally, the angle of depression between the camera and a given pixel is also determined by that pixel's y value in 2d space -- the farther a given pixel is from the camera, the closer its angle of depression will be to 0.

## Using `mode7.js`

While `demo.js` provides a simple example of a usecase, the barebones is as follows:

```
let m7 = new mode7({
  img_tag: [an HTML <img> tag],      /* mode7 only needs one of these two lines */
  img_data: [an ImageData() object],

  canvas: [an HTML <canvas> tag]     /* this cannot be only a rendering context due to the way this variable is transferred to the worker */
});

m7.update({
  camera_x_pos,  /* x position of camera in both 2d and 3d space */
  camera_y_pos,  /* y position of camera in 2d space, equivalent of z position of camera in 3d space */
  camera_height, /* y position of camera in 3d space */
  horizon,       /* typically 1/2 of the input image's height */
  theta          /* rotation around the y axis in 3d space */
});

m7.stop();  /* pause the render update loop inside the worker */
...
m7.start(); /* restart the render update loop */
```
