<h1 align=center style="color: saddlebrown">
EVG tick generator
</h1>
<p align=center>
EVG tick generator - is a light library for simple use.
</p>

## What is EVG tick generator?

EVG tick generator - single entry point for listener calls at time intervals.

# Notes
The absolute accuracy of the time interval is not guaranteed.
Animation functions only work from the browser.

## Installation

### Node.js

`EVG tick generator` is available on [npm](http://npmjs.org). To install it, type:

    $ npm install evg_tick_generator

# Usage

### tsconfig.json

recommended value of the "strict" field in the configuration

```json
{
  "compilerOptions": {
    "strict": false
  }
}
```

## EVG tick generator simple usage

```ts
import {TickGenerator} from "evg_tick_generator/src/outLib/TickGenerator";

let counter1 = 0;
let counter2 = 0;
let counter3 = 0;

const listener1 = () => {
    console.log("listener1", counter1);
    if (++counter1 == 2) subscriber1.unsubscribe();
};
const listener2 = () => {
    console.log("listener2", ++counter2);
    subscriber2.unsubscribe();
};
const listener3 = () => console.log("listener3", ++counter3);

const generator = new TickGenerator();
const subscriber1 = generator.interval1000Subscribe(listener1);
const subscriber2 = generator.interval1000Subscribe(listener2);
generator.interval1000Subscribe(listener3);

generator.timeout(() => {
    generator.destroy();
}, 5100);

// Print to console:
// listener1 1
// listener2 1
// listener3 1
// listener1 2
// listener3 2
// listener3 3
// listener3 4
// listener3 5
```

## Methods

| method | will return | description                                           |
| :--- | :--- |:------------------------------------------------------|
| `.state` | EState | current state                                         |
| `.stateSubscribe(callback: ICallback<any>)` | ISubscriptionLike<any> | will listen state                                     |
| `.destroy()` | void | will destroy generator                                |
| `.animationState` | EState | current animation state                               |
| `.animationSubscribe(callback: ICallback<any>)` | ISubscriptionLike<any> | will generate ticks when the browser is ready to draw |
| `.animationBeforeSubscribe(callback: ICallback<any>)` | ISubscriptionLike<any> | will generate ticks before animation                  |
| `.animationAfterSubscribe(callback: ICallback<any>)` | ISubscriptionLike<any> | will generate ticks after animation                   |
| `.animationStateSubscribe(callback: ICallback<any>)` | ISubscriptionLike<any> | will listen animation state                           |
| `.runAnimation()` | void | will run animation ticks                              |
| `.stopAnimation()` | void | will stop all animation ticks                         |
| `.tickHandlerState` | EState | current time ticks state                              |
| `.interval10Subscribe(callback: ICallback<any>)` | ISubscriptionLike<any> | will generate ticks every 10 milliseconds             |
| `.interval100Subscribe(callback: ICallback<any>)` | ISubscriptionLike<any> | will generate ticks every 100 milliseconds            |
| `.interval500Subscribe(callback: ICallback<any>)` | ISubscriptionLike<any> | will generate ticks every 500 milliseconds            |
| `.interval1000Subscribe(callback: ICallback<any>)` | ISubscriptionLike<any> | will generate ticks every 1000 milliseconds           |
| `.intervalCustom(callback: ICallback<any>, delay: milliseconds)` | ISubscriptionLike<any> | will generate ticks every custom delays               |
| `.timeout(callback: ICallback<any>, delay: milliseconds)` | ISubscriptionLike<any> | will generate one tick by custom delay                |
| `.runTickHandler()` | void | will run time ticks                                   |
| `.stopTickHandler()` | void | will stop all time ticks                              |

## License

MIT