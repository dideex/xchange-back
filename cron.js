const cron = require('cron').CronJob
const childProcess = require('child_process')

function runScript(scriptPath, callback) {
  // keep track of whether callback has been invoked to prevent multiple invocations
  let invoked = false

  const process = childProcess.fork(scriptPath)

  // listen for errors as they may prevent the exit event from firing
  process.on('error', function(err) {
    if (invoked) return
    invoked = true
    callback(err)
  })

  // execute the callback once the process has finished running
  process.on('exit', function(code) {
    if (invoked) return
    invoked = true
    var err = code === 0 ? null : new Error('exit code ' + code)
    callback(err)
  })
}

// Now we can run a script and invoke a callback when complete, e.g.

new cron(
  '* 60 * * * *',
  function() {
    runScript('./getExchangeRate.js', function(err) {
      if (err) console.log(err)
    })
  },
  null,
  true,
)

new cron(
  '* 45 * * * *',
  function() {
    runScript('./createRecentOrder.js', function(err) {
      if (err) console.log(err)
    })
  },
  null,
  true,
)

console.log('started')
