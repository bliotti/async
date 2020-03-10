const fetch = require('node-fetch')

const asyncTimeout = async delay => {
  return new Promise(resolve => {
    setTimeout(() => resolve(delay), delay)
  }).then(d => `Waited ${d} seconds`)
}

const asyncFetch = async url => {
  return fetch(url)
    .then(response => response.text())
    .then(text => `Fetched ${url}, and got back ${text}`)
}

const asyncThingsToDo = [
  { task: 'wait', duration: 1000 },
  { task: 'fetch', url: 'https://httpstat.us/200' },
  { task: 'wait', duration: 2000 },
  { task: 'fetch', url: 'https://urlecho.appspot.com/echo?body=Awesome!' }
]

const runTask = spec => {
  return spec.task === 'wait'
    ? asyncTimeout(spec.duration)
    : asyncFetch(spec.url)
}

const starterPromise = Promise.resolve(null)
const log = result => console.log(result)

asyncThingsToDo.reduce(
  (p, spec) => p.then(() => runTask(spec).then(log)),
  starterPromise
)

const tasks = asyncThingsToDo.map(runTask) // Run all our tasks in parallel.
const results = await Promise.all(tasks) // Gather up the results.
results.forEach(x => console.log(x))
