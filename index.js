/**
 * Created by tushar.mathur on 19/12/15.
 */

'use strict'

const announce = require('react-announce')
const rx = require('rx')
const createDeclarative = announce.createDeclarative
const Observable = rx.Observable
const ignore = {}
const createStream = (stream, key) => stream
  .filter(x => x !== ignore)
  .distinctUntilChanged()
  .map(value => ({[key]: value}))

const transformToBehaviorSubject = (memory, stream, key) => {
  memory[key] = new rx.BehaviorSubject(ignore)
  stream
    .filter(x => x !== undefined)
    .subscribe(memory[key])
}

exports.connect = selector => component => {
  // Map to a bSubject so that the latest values are available if component mounts later
  const newSelector = Object.keys(selector).reduce((m, k) => {
    transformToBehaviorSubject(m, selector[k], k)
    return m
  }, {})

  return createDeclarative(function (stream, dispose, selector) {
    dispose(
      Observable
        .merge(Object.keys(selector).map(x => createStream(selector[x], x)))
        .subscribe(x => this.setState(x))
    )
  })(newSelector)(component)
}
