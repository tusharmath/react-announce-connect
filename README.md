# react-announce-connect [![Build Status](https://travis-ci.org/tusharmath/react-announce-connect.svg?branch=master)](https://travis-ci.org/tusharmath/react-announce-connect)

A [react-announce](https://github.com/tusharmath/react-announce) declarative that applies an observable onto the component state.

### Install

```
npm i react-announce-connect --save
```

### Timer example

The following example will display the time and get updated every 100ms.

```javascript
import {connect} from 'react-announce-connect'
import {Observable} from 'rx'
import {Component} from 'react'

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

### Responsive font-size example
Creating responsive Layouts. This will auto select the font-size based on the screen size.

```javascript
import {connect} from 'react-announce-connect'
import {Observable} from 'rx'
import {Component} from 'react'

const windowEvents = Observable.fromCallback(window.addEventListner)
const responsive = windowEvents('resize')
  .debounce(300)
  .pluck('target', 'innerWidth')
  .map(x => {
    /* Extra small devices (phones, less than 768px) */
    if(x < 768){ return 'xs' }
    
    /* Small devices (tablets, 768px and up) */
    if(x < 992){ return 'sm' }
    
    /* Medium devices (desktops, 992px and up) */
    if(x < 1200){ return 'md' }
    
    /* Large devices (large desktops, 1200px and up) */
    return 'lg'
  })

@connect({responsive})
class Heading extends Component {
  render () {
    
    const style = {
      fontSize: {
        xs: 10
        sm: 12,
        md: 14,
        lg: 18
      }[this.state.screen]
    }
  
    return (
      <div style={style}>Hello World!</div>
    )
  }
}

```

