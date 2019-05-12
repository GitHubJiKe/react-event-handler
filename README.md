# react-event-handler

> 帮助你轻松的解决父子组件间事件控制的烦恼

## Demo 
[Demo.gif](https://c1.boldseas.com/image/react-eventhandler.gif)

## Usage

> npm i -S @peteryuan/react-eventhandler

> (我也不想挂名，奈何npm上已经有一个react-event-handler库，所以publish的时候一直403，后来查了资料，才改成了这样，并且在发布的时候要使用 npm publish --access public 明确指出发布为public，因为npm 对于私人的包发布维护是收费的，所以。。。穷屌丝只能如此。)

## 示例代码

### 父组件

```javascript
import React, { useState } from "react";
import "./App.css";
import Child1 from "./components/Child1";
import Child1_1 from "./components/Child1_1";
import { ReactEventHandler } from "@peteryuan/react-eventhandler";
function App() {
  const [state, setstate] = useState({ count: 0 });

  const onAdd = () => setstate({ count: ++state.count });
  const onSubtract = () => setstate({ count: --state.count });
  ReactEventHandler.on({ moduleName: "App", eventName: "add" }, onAdd);
  ReactEventHandler.on(
    { moduleName: "App", eventName: "subtract" },
    onSubtract
  );
  return (
    <div className="App">
      <h1>App</h1>
      <h1>{state.count}</h1>
      <div>
        <button
          className="btn"
          onClick={() => {
            console.log(Child1.$reh);
            Child1.$reh.emit("add");
          }}
        >
          add Child1 的数字
        </button>
        <button
          className="btn"
          onClick={() => {
            console.log(Child1.$reh);
            Child1.$reh.emit("subtract");
          }}
        >
          subtract Child1 的数字
        </button>
        <button
          className="btn"
          onClick={() => {
            console.log(Child1_1.$reh);
            Child1_1.$reh.emit("add");
          }}
        >
          add Child1_1 的数字
        </button>
        <button
          className="btn"
          onClick={() => {
            console.log(Child1_1.$reh);
            Child1_1.$reh.emit("subtract");
          }}
        >
          subtract Child1_1 的数字
        </button>
      </div>
      <br />
      <Child1 />
    </div>
  );
}

export default App;
```

### 子组件

```javascript
import React from "react";
import {
  useReactEventHandler,
  ReactEventHandler
} from "@peteryuan/react-eventhandler";
import Child1_1 from "./Child1_1";

class Child1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    Child1.$reh.on("add", this.onAdd);
    Child1.$reh.on("subtract", this.onSubtract);
  }

  onAdd = () => this.setState({ count: ++this.state.count });

  onSubtract = () => this.setState({ count: --this.state.count });

  render() {
    return (
      <div style={{ border: "1px solid blue", height: 600, margin: 20 }}>
        <h2>组件名：Child1</h2>
        <h1>{this.state.count}</h1>
        <Child1_1 />
        <br />
        <button
          onClick={() => {
            console.log(ReactEventHandler);
            ReactEventHandler.emit({ moduleName: "App", eventName: "add" });
          }}
        >
          add App 的数字
        </button>
        <button
          onClick={() => {
            console.log(ReactEventHandler);
            ReactEventHandler.emit({
              moduleName: "App",
              eventName: "subtract"
            });
          }}
        >
          subtract App 的数字
        </button>
        <button onClick={() => Child1_1.$reh.emit("add")}>
          add Child1_1 的数字
        </button>
        <button onClick={() => Child1_1.$reh.emit("subtract")}>
          subtract Child1_1 的数字
        </button>
      </div>
    );
  }
}

export default useReactEventHandler(Child1);
```

#### 子组件的子组件

```javascript
import React, { useState } from "react";
import {
  useReactEventHandler,
  ReactEventHandler
} from "@peteryuan/react-eventhandler";
import Child1 from "./Child1";

const Child1_1 = () => {
  const [state, setstate] = useState({ count: 0 });
  const onAdd = () => setstate({ count: ++state.count });
  const onSubtract = () => setstate({ count: --state.count });
  Child1_1.$reh.on("add", onAdd);
  Child1_1.$reh.on("subtract", onSubtract);
  return (
    <div
      style={{ border: "1px solid green", width: 300, height: 300, margin: 20 }}
    >
      <h3>组件名：Child1_1</h3>
      <h1>{state.count}</h1>
      <button
        onClick={() =>
          ReactEventHandler.emit({ moduleName: "App", eventName: "add" })
        }
      >
        add App 的数字
      </button>
      <button
        onClick={() =>
          ReactEventHandler.emit({ moduleName: "App", eventName: "subtract" })
        }
      >
        subtract App 的数字
      </button>
      <button onClick={() => Child1.$reh.emit("add")}>add Child1 的数字</button>
      <button onClick={() => Child1.$reh.emit("subtract")}>
        subtract Child1 的数字
      </button>
    </div>
  );
};

export default useReactEventHandler(Child1_1);
```
