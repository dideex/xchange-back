if (process.env.NODE_ENV === 'production') {
  module.exports = require('./config.json')
} else if (process.env.NODE_ENV === 'ci') {
  module.exports = require('./config.json')
} else if (process.env.NODE_ENV === 'test') {
  module.exports = require('./test-config.json')
} else {
  module.exports = require('./config.json')
}
