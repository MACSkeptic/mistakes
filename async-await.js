/**
 * base dummy code to exemplify a simple sequence of (potentially) async steps
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
 *     .then(performProcessing)
 *     .then(formatResultForReturning)
 *
 * I only expanded it to be able to make it clear that some steps in that chain will in fact happen synchronously
 */
const exampleWithPromises = () => {
  console.log('-> sync step call perform request');
  const responsePromise = performRequest(5);

  console.log('-> sync step register response parse after request is done');
  const bodyPromise = responsePromise.then(parseResponse);

  console.log('-> sync step register body processing after response parsing is done');
  const resultPromise = bodyPromise.then(performProcessing);

  console.log('-> sync step register format result after body processing is done');
  const returnPromise = resultPromise.then(formatResultForReturning);

  console.log('-> sync step done, will return');
  return returnPromise;
};

/**
 * solving the problem using async await
 */
async function exampleWithAsyncAwait() {
  console.log('-> async step call perform request');
  const response = await performRequest(5);

  console.log('-> async step wait for response to be parsed');
  const body = await parseResponse(response);

  console.log('-> async step wait for body to be processed');
  const result = await performProcessing(body);

  console.log('-> async step wait for result to be formatted');
  const returnValue = await formatResultForReturning(result);

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



