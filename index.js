/**
 * Created by tushar.mathur on 19/12/15.
 */

'use strict'

const announce = require('react-announce')
const rx = require('rx')
const createDeclarative = announce.createDeclarative
const Observable = rx.Observable
const createStream = (stream, key) => stream
  .distinctUntilChanged(x => x, (a, b) => a === b)
  .map(value => ({[key]: value}))

exports.connect = selector => component => {
  return createDeclarative(function (stream, dispose, selector) {
    dispose(
      Observable
        .merge(Object.keys(selector).map(x => createStream(selector[x], x)))
        .subscribe(x => this.setState(x))
    )
  })(selector)(component)
}
