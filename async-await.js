/**
 * base dummy code to exemplify a simple sequence of (potentially) async steps
 * feel free to ignore this block and jump straight to the 3 examples below
 */
const performRequest = (arbitraryDelayInSecondsForTheSakeOfExemplifying) => {
  console.log('--> async step performRequest - start');
  return new Promise(resolve => setTimeout(resolve, arbitraryDelayInSecondsForTheSakeOfExemplifying * 1000))
    .then(() => console.log('--> async step performRequest - end'));
};
const parseResponse = (response) => {
  console.log('--> async step parseResponse - start');
  return Promise.resolve().then(() => console.log('--> async step parseResponse - end'));
};
const performProcessing = (body) => {
  console.log('--> async step performProcessing - start');
  return Promise.resolve().then(() => console.log('--> async step performProcessing - end'));
};
const formatResultForReturning = (result) => {
  console.log('--> async step formatResultForReturning - start');
  return Promise.resolve().then(() => console.log('--> async step formatResultForReturning - end'));
};

/**
 * solving the problem using promises
 *
 * note that this would normally be written as:
 *   return performRequest(5)
 *     .then(parseResponse)
 *     .then(performProcessing) <--- function not being called "now", just passed as an argument to be called "in the future"
 *     .then(formatResultForReturning)
 *
 * I only expanded it to be able to make it clear that some steps in that chain will in fact happen synchronously
 */
const exampleWithPromises = () => {
  /* no time travel, every piece of code in this function is executed synchronously at once */
  console.log('-> sync step call perform request');
  const responsePromise = performRequest(5);

  /* functions are passed as arguments to (potentially) be called in the future */
  console.log('-> sync step register response parse after request is done');
  const bodyPromise = responsePromise.then(parseResponse);

  /* functions act as a strong border between code that runs "now" vs "in the future" */
  console.log('-> sync step register body processing after response parsing is done');
  const resultPromise = bodyPromise.then(performProcessing);

  /* this aligns with the event/callback mentality of operating under an event loop */
  console.log('-> sync step register format result after body processing is done');
  const returnPromise = resultPromise.then(formatResultForReturning);

  /* do as much as possible, return, then get out of the loop and wait to be called */
  console.log('-> sync step done, will return');
  return returnPromise;
};

/**
 * solving the problem using async await
 */
async function exampleWithAsyncAwait() {
  /* time travel, await causes code after it to be executed "in the future" */
  console.log('-> async step call perform request');
  const response = await performRequest(5);

  /* might look nice and sequential, but there is a lot of cascading going on here */
  console.log('-> async step wait for response to be parsed');
  const body = await parseResponse(response);

  /* I'd argue this is a trap, making complex things _look_ simple is not good */
  console.log('-> async step wait for body to be processed');
  const result = await performProcessing(body);

  /* there is no well defined boundary between code executed "now" vs code executed "in the future" */
  console.log('-> async step wait for result to be formatted');
  const returnValue = await formatResultForReturning(result);

  /* see below for a depiction of what this code is _really_ doing */
  console.log('-> async? step done, will return');
  return returnValue;
}

/**
 * solving the problem using promises in a way that behaves exactly the same as async await
 */
const exampleWithPromisesMimicAsyncAwait = () => {
  console.log('-> async step call perform request');
  return performRequest(5).then((response) => {

    console.log('-> async step wait for response to be parsed');
    return parseResponse(response).then((body) => {

      console.log('-> async step wait for body to be processed');
      return performProcessing(body).then((result) => {

        console.log('-> async step wait for result to be formatted');
        return formatResultForReturning(result).then((returnValue) => {

          console.log('-> async? step done, will return');
          return returnValue;
        });
      });
    });
  });
};

[
  ['using promises', exampleWithPromises],
  ['async await', exampleWithAsyncAwait],
  ['async await using promises', exampleWithPromisesMimicAsyncAwait]
].reduce((control, [name, next]) => {
  return control.then(() => {
    console.log('-----------------------------------------------------------------');
    console.log('=>', name);
    console.log('== start ==');
    const result = next().then(() => console.log('== async end =='));
    console.log('== sync end ==');
    return result;
  });
}, Promise.resolve()).then(() => {
  console.log('-----------------------------------------------------------------');
});

/**
$ node async-await.js
-----------------------------------------------------------------
=> using promises
== start ==
-> sync step call perform request
--> async step performRequest - start
-> sync step register response parse after request is done
-> sync step register body processing after response parsing is done
-> sync step register format result after body processing is done
-> sync step done, will return
== sync end ==
--> async step performRequest - end
--> async step parseResponse - start
--> async step parseResponse - end
--> async step performProcessing - start
--> async step performProcessing - end
--> async step formatResultForReturning - start
--> async step formatResultForReturning - end
== async end ==
-----------------------------------------------------------------
=> async await
== start ==
-> async step call perform request
--> async step performRequest - start
== sync end ==
--> async step performRequest - end
-> async step wait for response to be parsed
--> async step parseResponse - start
--> async step parseResponse - end
-> async step wait for body to be processed
--> async step performProcessing - start
--> async step performProcessing - end
-> async step wait for result to be formatted
--> async step formatResultForReturning - start
--> async step formatResultForReturning - end
-> async? step done, will return
== async end ==
-----------------------------------------------------------------
=> async await using promises
== start ==
-> async step call perform request
--> async step performRequest - start
== sync end ==
--> async step performRequest - end
-> async step wait for response to be parsed
--> async step parseResponse - start
--> async step parseResponse - end
-> async step wait for body to be processed
--> async step performProcessing - start
--> async step performProcessing - end
-> async step wait for result to be formatted
--> async step formatResultForReturning - start
--> async step formatResultForReturning - end
-> async? step done, will return
== async end ==
-----------------------------------------------------------------
**/

