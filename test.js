/**
 * Created by tushar.mathur on 19/12/15.
 */

'use strict'
import {Observable, ReactiveTest, TestScheduler, BehaviorSubject} from 'rx'
import test from 'ava'

import {connect} from './index'

const {onNext} = ReactiveTest

test('connects to stream directly', t => {
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
  c.componentWillMount()
  sh.start()
  t.same(state, [
    {src1: 100},
    {src1: 200},
    {src2: 1000},
    {src1: 300},
    {src2: 2000}
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
  t.same(state, [{src1: 12}, {src2: 22}])
})

test('support subscription with a single BehaviorSubject type', t => {
  var state = []
  var subject = new BehaviorSubject(0)
  var even = subject.filter(x => x % 2 === 0)
  var odd = subject.filter(x => x % 2 === 1)

  const MockComponent = connect({even, odd})(
    class MockComponent {
      setState (x) {
        state.push(x)
      }
    })
  var c = new MockComponent()
  subject.onNext(1)
  subject.onNext(2)
  subject.onNext(2)
  subject.onNext(4)
  subject.onNext(5)
  c.componentWillMount()
  t.same(state, [{even: 4}, {odd: 5}])
})
