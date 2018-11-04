const openSocket = require('socket.io-client')

socket = openSocket('http://localhost:3040')

mails = ['ya.ru', 'mail.ru', 'gmail.com', 'gmail.com', 'gmail.com', 'gmail.com']

const randomIntegerTo = n => Math.round(Math.random() * n)

const getEmail = () => {
  const firstLetter = String.fromCharCode(randomIntegerTo(25) + 65)
  const lastLetter = String.fromCharCode(randomIntegerTo(25) + 97)
  const domain = mails[randomIntegerTo(mails.length - 1)]
  const email = `${firstLetter}${'*'.repeat(
    randomIntegerTo(8),
  )}${lastLetter}@${domain}`
  return {email}
}

const getValue = () => { 
  const amount = Math.random() * .2
  const data =
    Math.random() > 0.5
      ? {
          currency: 'Bitcoin',
          inputValue: amount,
          outputValue: amount * 417104,
          inputLabel: 'BTC',
          outputLabel: 'RUR',
        }
      : {
          currency: 'Sberbank',
          outputValue: amount,
          inputValue: amount * 417104,
          inputLabel: 'RUR',
          outputLabel: 'BTC',
        }
  return data
}

socket.emit('newOrder', {
  ...getEmail(),
  paymentStatus: Math.round(Math.random()),
  ...getValue(),
})
