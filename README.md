# react-native-skia-example

Example project for debugging and showcasing purposes on react-native-skia

## Current content

- Floating balls: A 3d simulation of an artpiece of balls hanging by a thread in the Dark Matter museum in Berlin. Gesture handler supports changing the viewing angle and the amplitude of the sinusoidal movement.
- Compass: points north + gives direction to a generated target nearby.
- Maze: Ball in a maze game. This showcases running a gameloop on react-native-skia. (performs quite poor on Android at the moment)
- Flappy: Flappy Bird example. This showcases running a gameloop on react-native-skia.
- Springboard: test to make a iOS-like springboard where icons can be dragged around.
- Mount: Skia canvas mounting example. Showcase for performance when mounting lots of new canvasses simultaneously.
- BackdropBlur: This shows the application of a 'blurring-badge' on an image.
- Resize: This was a test to troubleshoot canvas scaling behaviour (this was animated previously)
- makeImageFromView snapshot test: This showcases the ability to snapshot a view and render it on a canvas.
