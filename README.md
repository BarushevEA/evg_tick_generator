<h1 align=center style="color: saddlebrown">
EVG tick generator
</h1>
<p align=center>
EVG Tick Generator - is a light library for simple use.
</p>

## Installation

### Node.js
`EVG tick generator` is available on [npm](http://npmjs.org). To install it, type:

    $ npm install evg_tick_generator

### Browser
```html
<script src="https://unpkg.com/evg_tick_generator/repo/tgr_min.js"></script>
```

## What is EVG Tick Generator?
_The EVG Tick Generator_ is a powerful and flexible library for creating and managing timers and events in a web environment. 

`GInterval` and `GTimeout` work in both **Node.js** context and **browser** context. Meanwhile, 

`GAnimationFrame` uses the requestAnimationFrame method, which is only available in a **browser** context, therefore it can only be used in a **browser**.

The following interfaces are available for use:

### IGenerator
The main interface for managing generators. It contains the following methods:

* `state`: Returns the current state of the generator.
* `subscribeOnState(callback)`: Subscribes to the generator's state changes.
* `subscribeOnProcess(callback)`: Subscribes to the generation process.
* `start()`: Starts the generator.
* `stop()`: Stops the generator.
* `destroy()`: Destroys the generator and all related resources.

### ITimeout
ITimeout creates a timeout and allows managing its status. It contains the following method:

* `setTimeout(delay)`: Sets the timeout delay.

### IInterval
IInterval is designed to create an interval timer, and it allows managing its status. It contains the following method:

* `setInterval(delay)`: Sets the timeout delay.

### IRequestAnimationFrame
IRequestAnimationFrame provides functionality to create and manage animation loops using the `browser's` requestAnimationFrame method. It contains the following methods:

* `setFPS(num)`: Sets the frames per second rate for animation loops.
* `set60fps()`: Sets the frames per second rate to 60 for animation loops.
* `set30fps()`: Sets the frames per second rate to 30 for animation loops.
* `setDefault()`: Sets the frames per second rate to a "default" value for animation loops.

## Usage Examples

#### Imports for **Node.js** + TS
```typescript
import {GTimeout} from "./tick_generator/src/TickGenerator/GTimeout";
import {GInterval} from "./tick_generator/src/TickGenerator/GInterval";
import {GAnimationFrame} from "./tick_generator/src/TickGenerator/GAnimationFrame";
```

### Creating and using a timer
```typescript
// Example of using ITimeout

// 1 create an instance of GTimeout
const timeout = new GTimeout();
// 2 set the time interval in milliseconds
timeout.setTimeout(1000);
// 3 add a listener
// 3.1 you can listen to the full list of states
const subscriber1 = timeout.subscribeOnState(
    state => {
        console.log("subscriber1:", state);
    }
);
// 3.2 you can also listen only to the timeout event specified by the time interval
const subscriber2 = timeout.subscribeOnProcess(
    state => {
        console.log("subscriber2:", state);
    }
);
// 3.3 you can have as many subscribers as needed
// 4 start the event
timeout.start();
// 5 if necessary we can stop the event prematurely
timeout.stop();
// 6 if you perform a start then the event will work and all subscribers will be called according to subscriptions
// 7 if subscribers are not needed you can unsubscribe them
subscriber1.unsubscribe();
subscriber2.unsubscribe();
// 8 if there is no need in the GTimeout instance it can be destroyed
timeout.destroy();
// 9 when the instance is destroyed, all subscriptions are automatically removed, further use of the instance is not possible
// 10 you can check the state of the instance in two ways
console.log(timeout.state);
console.log(timeout.isDestroyed());
```

### Creating and using an ordered timer
```typescript
// 1 create an instance of GTimeoutOrdered
const timeout = new GTimeoutOrdered();
timeout.setTimeout(1000);
// 2 all methods are identical to GTimeout, but there is an important difference - 
// you can adjust the order of listeners call
// 2.1 let's create two listeners subscribed to the main timeout cycle events
const subscriber1 = timeout.subscribeOnProcess(
    state => {
        console.log("subscriber1:", state);
    }
);
const subscriber2 = timeout.subscribeOnProcess(
    state => {
        console.log("subscriber2:", state);
    }
);
// with such a subscription, it's obvious that the subscriber1 will be executed first, and the subscriber2 will be executed second
// but sometimes there is a need to change the order of execution, and doing so is very easy
// 3 by default, subscribers have order = 0, we can set it in the order we need
subscriber1.order = 2;
subscriber2.order = 1;
// that's it, now after start, subscriber2 will get its call first
// there is another peculiarity of GTimeoutOrdered, when unsubscribing subscribers
// the order of call of the remaining subscribers, unlike GTimeout, remains the same.
```

* Note, you can set the generator values whenever you like, but they will only be applied if the generator was stopped after completing its current task or by the stop command, and then started by the start command.

### Creating and using an interval generator
```typescript
// Example of using IInterval

// 1 create an instance of GInterval
const interval = new GInterval();
// the rest of the actions are similar to GTimeout usage
```
### Creating and using an ordered interval generator

```typescript
// Example of using IInterval

// 1 create an instance of GIntervalOrdered
const interval = new GIntervalOrdered();
// the rest of the actions are similar to GTimeoutOrdered usage
```
* Note, you can set the generator values whenever you like, but they will only be applied if the generator was stopped after by the stop command, and then started by the start command.

### Creating and using an animation loop
```typescript
// Example of using IRequestAnimationFrame

// 1 create an instance of GAnimationFrame
const animationFrame = new GAnimationFrame();
// unlike the previous examples, this generator adapts to the browser page rendering
// therefore, you can set event generation using
// setFPS(num)
// set60fps()
// set30fps()
// setDefault()
// the rest of the actions are similar to GTimeout and GTimeout usage
```
### Creating and using an animation loop

```typescript
// Example of using IRequestAnimationFrame

// 1 create an instance of GAnimationFrameOrdered
const interval = new GAnimationFrameOrdered();
// the rest of the actions are similar to GTimeoutOrdered usage
```
* Note, you can set the generator values whenever you like, but they will only be applied if the generator was stopped after by the stop command, and then started by the start command.

## License

MIT
