const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')

const Customer = require('./models/Customer.js')

const prompt = require('prompt-sync')()

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})
const createCustomer = async () => {
  const name = prompt('What is the customers name? ')
  const age = prompt('What is the customers age? ')
  const customer = await Customer.create({ name, age })
  await index()
}
const index = async () => {
  const customers = await Customer.find({})
  customers.forEach((cust) => {
    console.log(`id: ${cust._id} --  Name: ${cust.name}, Age: ${cust.age}`)
  })
}

const updateCustomer = async () => {
  console.log('Below is a list of customers: ')
  const customers = await Customer.find({})
  await index()
  const id = prompt(
    'Copy and paste the id of the customer you would like to update here: '
  )
  const newName = prompt('What is the customers new name?')
  const newAge = prompt('What is the customers new age?')

  await Customer.findByIdAndUpdate(id, { name: newName, age: newAge })

  await index()
}

const deleteCustomer = async () => {
  console.log('Below is a list of customers: ')
  const customers = await Customer.find({})
  await index()
  const id = prompt(
    'Copy and paste the id of the customer you would like to delete here: '
  )

  await Customer.findByIdAndDelete(id)

  await index()
}

let mainAction = 0
const main = async () => {
  mainAction = await prompt(`
    What would you like to do?
    
      1. Create a customer
      2. View all customers
      3. Update a customer
      4. Delete a customer
      5. quit
    
    Number of action to run: `)

  switch (mainAction) {
    case '1':
      await createCustomer()
      await main()
      break
    case '2':
      await index()
      await main()
      break
    case '3':
      await updateCustomer()
      await main()
      break

    case '4':
      await deleteCustomer()
      await main()
      break
    case '5':
      console.log('exiting...')
      mongoose.connection.close()
      break
    default:
      console.log('Select from 1 - 5')
      await main()
      break
  }
}

console.log('Welcome to the CRM')
main()
