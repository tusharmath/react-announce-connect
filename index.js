/**
 * Created by tushar.mathur on 19/12/15.
 */

'use strict'

import {createDeclarative} from 'react-announce'
import {Observable} from 'rx'
import {map, reduce} from 'lodash'

const reducer = (m, v) => {
  m[v.key] = v.value
  return m
}

const createStream = (stream, key) => stream
  .filter(x => x !== undefined)
  .distinctUntilChanged()
  .map(value => ({key, value}))

export const connect = createDeclarative(function (stream, dispose, selector) {
  const readableStream = Observable.combineLatest(map(selector, createStream)).map(x => reduce(x, reducer, {}))
  dispose(stream
    .filter(x => x.event === 'WILL_MOUNT')
    .combineLatest(readableStream, (a, b) => b)
    .subscribe(x => this.setState(x)))
})
