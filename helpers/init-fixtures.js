const mongoose = require('mongoose')

const {Orders, Currency, User, Operations} = require('../models')
const currencies = require('../db/currency.json')
const logins = require('../db/logins.json')
const operations = require('../db/operations.json')
const orders = require('../db/orders.json')

async function saveAllCurrencies() {
  return await Promise.all(
    currencies.map(currency => new Currency(currency).save()),
  )
}

async function saveAllOperations() {
  return await Promise.all(
    operations.map(operation => new Operations(operation).save()),
  )
}

async function saveAllUsers() {
  return await Promise.all(logins.map(user => new User(user).save()))
}

async function saveAllOrders() {
  return await Promise.all(orders.map(order => new Orders(order).save()))
}

async function saveFixtures() {
  const db = await require('./db')
  await mongoose.connection.db.dropDatabase()

  try {
    await saveAllCurrencies()
    await saveAllOperations()
    await saveAllUsers()
    await saveAllOrders()
  } catch (e) {
    console.log(e)
  } finally {
    db.disconnect()
  }
}

module.exports = {
  saveAllCurrencies,
  saveFixtures,
}
