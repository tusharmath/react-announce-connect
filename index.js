/**
 * Created by tushar.mathur on 19/12/15.
 */

'use strict'

const createDeclarative = require('react-announce').createDeclarative
const Observable = require('rx').Observable
const _ = require('lodash')

const reducer = (m, v) => {
  m[v.key] = v.value
  return m
}

const createStream = (stream, key) => stream
  .filter(x => x !== undefined)
  .distinctUntilChanged()
  .map(value => ({key, value}))

exports.connect = createDeclarative(function (stream, dispose, selector) {
  dispose(
    Observable
      .combineLatest(_.map(selector, createStream))
      .map(x => _.reduce(x, reducer, {}))
      .subscribe(x => this.setState(x))
  )
})
