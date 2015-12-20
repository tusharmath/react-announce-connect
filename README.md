# react-announce-connect
Applies an observable onto the component state

### Install

```
npm i react-announce-connect --save
```

### Example
The following example will display the time and get updated every 100ms 

```javascript

import {connect} from 'react-announce-connect'
import {Observable} from 'rx'

const timer = Observable.interval(100).map(() => new Date())

@connect({time})
class Timer extends Component {

  render () {
    return (
      <div>{this.state.time}</div>
    )
  }
}

```
