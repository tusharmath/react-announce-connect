# react-announce-connect [![Build Status](https://travis-ci.org/tusharmath/react-announce-connect.svg?branch=master)](https://travis-ci.org/tusharmath/react-announce-connect)

A [react-announce](https://github.com/tusharmath/react-announce) plugin that applies an observable onto the component state.

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
