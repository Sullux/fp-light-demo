Object.assign(globalThis, require('@sullux/fp-light'))

const log = console.log

const logging = async () => {
  const untracedFoo = () => { throw new Error('reasons') }
  const tracedFoo = trace(untracedFoo)
  try { tracedFoo() } catch (err) { log(err.stack) }
  /*
    Error: reasons
        at tracedFoo (/home/mistify/sullux/fp-light-demo/fp/important-helpers/h5-tracing.test.js:6:37)
        at Object.logging (/home/mistify/sullux/fp-light-demo/fp/important-helpers/h5-tracing.test.js:8:9)
        at Promise.then.completed (/home/mistify/sullux/fp-light-demo/node_modules/jest-circus/build/utils.js:391:28)
        at new Promise (<anonymous>)
        at callAsyncCircusFn (/home/mistify/sullux/fp-light-demo/node_modules/jest-circus/build/utils.js:316:10)
        at _callCircusTest (/home/mistify/sullux/fp-light-demo/node_modules/jest-circus/build/run.js:218:40)
        at processTicksAndRejections (internal/process/task_queues.js:95:5)
        at _runTest (/home/mistify/sullux/fp-light-demo/node_modules/jest-circus/build/run.js:155:3)
        at _runTestsForDescribeBlock (/home/mistify/sullux/fp-light-demo/node_modules/jest-circus/build/run.js:66:9)
        at _runTestsForDescribeBlock (/home/mistify/sullux/fp-light-demo/node_modules/jest-circus/build/run.js:60:9)
  */
  // FP_LIGHT_TRACE=on
  /*
    Error: reasons
        from untracedFoo (/home/mistify/sullux/fp-light-demo/fp/important-helpers/h5-tracing.test.js:8:9)
        at untracedFoo (/home/mistify/sullux/fp-light-demo/fp/important-helpers/h5-tracing.test.js:6:37)
        at Object.logging (/home/mistify/sullux/fp-light-demo/fp/important-helpers/h5-tracing.test.js:8:9)
  */
  const incrementAndDouble = add(1, mul(untracedFoo, _))
  try { incrementAndDouble(20) } catch (err) { log(err.stack) }
  // FP_LIGHT_TRACE=on
  /*
    Error: reasons
        at untracedFoo (/home/mistify/sullux/fp-light-demo/fp/important-helpers/h5-tracing.test.js:6:37)
        at Object.apply (/home/mistify/sullux/fp-light-demo/node_modules/@sullux/fp-light/index.js:829:13)
        at /home/mistify/sullux/fp-light-demo/node_modules/@sullux/fp-light/index.js:787:15
        at Array.reduce (<anonymous>)
        at /home/mistify/sullux/fp-light-demo/node_modules/@sullux/fp-light/index.js:776:26
        at Object.apply (/home/mistify/sullux/fp-light-demo/node_modules/@sullux/fp-light/index.js:829:13)
        at Object.apply (/home/mistify/sullux/fp-light-demo/node_modules/@sullux/fp-light/index.js:975:24)
        at Object.apply (/home/mistify/sullux/fp-light-demo/node_modules/@sullux/fp-light/index.js:829:13)
        at /home/mistify/sullux/fp-light-demo/node_modules/@sullux/fp-light/index.js:787:15
        at Array.reduce (<anonymous>)
  */
  const incrementAndDoubleTraced = trace(add(1, mul(untracedFoo, _)))
  try { incrementAndDoubleTraced(20) } catch (err) { log(err.stack) }
  // FP_LIGHT_TRACE=on
  /*
    Error: reasons
        from 0:__FP_LIGHT_PROPERTY_FUNCTION__ targetPropertyIfExists() (/home/mistify/sullux/fp-light-demo/fp/important-helpers/h5-tracing.test.js:46:9)
        at untracedFoo (/home/mistify/sullux/fp-light-demo/fp/important-helpers/h5-tracing.test.js:6:37)
  */
}

describe('conditional', () => {
  it('should log all the things', logging)
})
