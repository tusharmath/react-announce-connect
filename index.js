/**
 * Created by tushar.mathur on 19/12/15.
 */

'use strict'

const createDeclarative = require('react-announce').createDeclarative
const Observable = require('rx').Observable
const _ = require('lodash')

const createStream = (stream, key) => stream
  .filter(x => x !== undefined)
  .distinctUntilChanged()
  .map(value => ({[key]: value}))

exports.connect = createDeclarative(function (stream, dispose, selector) {
  dispose(
    Observable
      .merge(_.map(selector, createStream))
      .subscribe(x => this.setState(x))
  )
})
