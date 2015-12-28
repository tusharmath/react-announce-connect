/**
 * Created by tushar.mathur on 19/12/15.
 */

'use strict'

const announce = require('react-announce')
const rx = require('rx')
const _ = require('lodash')
const createDeclarative = announce.createDeclarative
const Observable = rx.Observable

const createStream = (stream, key) => stream
  .filter(x => x !== undefined)
  .distinctUntilChanged()
  .map(value => ({[key]: value}))

const transformToBehaviorSubject = (m, v, k) => {
  m[k] = new rx.BehaviorSubject()
  v.subscribe(m[k])
}
exports.connect = _.curry((selector, component) => {

  // Map to a bSubject so that the latest values are available if component mounts later
  const newSelector = _.transform(selector, transformToBehaviorSubject, {})
  return createDeclarative(function (stream, dispose, selector) {
    dispose(
      Observable
        .merge(_.map(selector, createStream))
        .subscribe(x => this.setState(x))
    )
  })(newSelector, component)
})
