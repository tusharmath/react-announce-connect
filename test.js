/**
 * Created by tushar.mathur on 19/12/15.
 */

'use strict'
import {Observable, ReactiveTest, TestScheduler} from 'rx'
import test from 'ava'

import {connect} from './index'

const {onNext} = ReactiveTest
test('connects to stream directly', t => {
  var src1 = Observable.range(1, 2)
  var src2 = Observable.range(10, 2)

  var state = []
  const MockComponent = connect({src1, src2})(
    class A {
      setState (x) {
        state.push(x)
      }
    })
  var c = new MockComponent()
  c.componentWillMount()
  t.same(state, [
    {src1: 1, src2: 10},
    {src1: 2, src2: 10},
    {src1: 2, src2: 11}
  ])
})

test('ignores empty values', t => {
  var state = []
  var scheduler = new TestScheduler()
  var ob = scheduler.createHotObservable(
    onNext(1, 100),
    onNext(2, 200),
    onNext(3, undefined),
    onNext(4, 400)
  )

  const B = connect({ob})(
    class B {
      setState (x) {
        state.push(x)
      }
    })
  var b = new B()
  b.componentWillMount()
  scheduler.start()
  t.same(state, [{ob: 100}, {ob: 200}, {ob: 400}])
})

test('ignores empty duplicated values', t => {
  var state = []
  var scheduler = new TestScheduler()
  var ob = scheduler.createHotObservable(
    onNext(1, 100),
    onNext(2, 100),
    onNext(3, 300),
    onNext(4, 300)
  )

  const MockComponent = connect({ob})(
    class MockComponent {
      setState (x) {
        state.push(x)
      }
    })
  var c = new MockComponent()
  c.componentWillMount()
  scheduler.start()
  t.same(state, [{ob: 100}, {ob: 300}])
})

test('support subscription with latest values', t => {
  var state = []
  var sh = new TestScheduler()
  var src1 = sh.createHotObservable(
    onNext(200, 100),
    onNext(210, 200),
    onNext(220, 300)
  )
  var src2 = sh.createHotObservable(
    onNext(215, 1000),
    onNext(230, 2000)
  )

  const MockComponent = connect({src1, src2})(
    class MockComponent {
      setState (x) {
        state.push(x)
      }
    })
  var c = new MockComponent()
  sh.start()
  c.componentWillMount()
  t.same(state, [
    {src1: 300},
    {src2: 2000}
  ])
})
