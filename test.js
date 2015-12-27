/**
 * Created by tushar.mathur on 19/12/15.
 */

'use strict'
import {Observable, ReactiveTest, TestScheduler, BehaviorSubject} from 'rx'
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

test('support subscription of BehaviorSubject type', t => {
  var state = []
  var src1 = new BehaviorSubject(10)
  var src2 = new BehaviorSubject(20)

  const MockComponent = connect({src1, src2})(
    class MockComponent {
      setState (x) {
        state.push(x)
      }
    })
  var c = new MockComponent()
  src1.onNext(11)
  src2.onNext(21)
  src1.onNext(12)
  src2.onNext(22)
  c.componentWillMount()
  t.same(state, [{src1: 12, src2: 22}])
})
