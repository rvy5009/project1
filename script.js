// console.log("hi")



const stockApi = "N84W2MQHNHRK05UG"
const stockUrl1 = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=`

const stockUrl2= `&interval=1min&apikey=Z${stockApi}`
const stockUrlOK= `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=${stockApi}`

const bankInput = document.querySelector("#bankInput")
const stockInput = document.querySelector("#stockInput")

const stockButton = document.querySelector("#stockButton")
const bankButton = document.querySelector("#bankButton")
const buyButton = document.querySelector("#buyButton")
const sellButton = document.querySelector("#sellButton")



const bankDiv = document.querySelector("#bankDiv")
const stockDiv = document.querySelector("#stockDiv")
const tradeDiv = document.querySelector("#tradeDiv")

var bankAccount = []

stockButton.addEventListener("click", async function () {
  event.preventDefault()
  let stockName = stockInput.value
  // console.log(stockName)
  let response = await axios.get(`${stockUrl1}${stockName}${stockUrl2}`)
  // console.log(response)
  let stockPrice = response.data["Time Series (1min)"]
  // console.log(stockPrice)
  let stockTimed = stockPrice["2019-11-22 16:00:00"]["1. open"]
  // console.log(stockTimed)
  const NewStockDiv = document.createElement('div')
  NewStockDiv.innerHTML = stockName + stockTimed
  stockDiv.appendChild(NewStockDiv)
})

buyButton.addEventListener("click", async function () {
  event.preventDefault()
  let stockName = stockInput.value
  // console.log(stockName)
  let response = await axios.get(`${stockUrl1}${stockName}${stockUrl2}`)
  // console.log(response)
  let stockPrice = response.data["Time Series (1min)"]
  // console.log(stockPrice)
  let stockTimed = stockPrice["2019-11-22 16:00:00"]["1. open"]  
  let parsedStockTimed = parseFloat(stockTimed, 10)
  bankAccount.push(-parsedStockTimed)
  let addStocktoBank = calculateBank(bankAccount)

  const addStockToBankDiv =document.createElement("div")
  addStockToBankDiv.innerHTML = `$${addStocktoBank}`
  bankDiv.appendChild(addStockToBankDiv)  
  
  const addStockToLog = document.createElement("div")
  addStockToLog.innerHTML = "Bought"+ stockName + stockTimed
  tradeDiv.appendChild(addStockToLog)
})

sellButton.addEventListener("click", async function () {
  event.preventDefault()
  let stockName = stockInput.value
  // console.log(stockName)
  let response = await axios.get(`${stockUrl1}${stockName}${stockUrl2}`)
  // console.log(response)
  let stockPrice = response.data["Time Series (1min)"]
  // console.log(stockPrice)
  let stockTimed = stockPrice["2019-11-22 16:00:00"]["1. open"]  
  let parsedStockTimed = parseFloat(stockTimed, 10)
  bankAccount.push(parsedStockTimed)
  let subStocktoBank = calculateBank(bankAccount)

  const subStockToBankDiv =document.createElement("div")
  subStockToBankDiv.innerHTML = `$${subStocktoBank}`
  bankDiv.appendChild(subStockToBankDiv)  
  
  const addStockToLog = document.createElement("div")
  addStockToLog.innerHTML = "Sold" + stockName + stockTimed
  tradeDiv.appendChild(addStockToLog)
})

function calculateBank(array) {
  let sum = 0
  for (let i = 0; i < array.length; i++){
    sum += array[i]
  }
  return sum
}



bankButton.addEventListener("click", function () {
  event.preventDefault()

  let bankAmount = parseInt(bankInput.value, 10)
  bankAccount.push(bankAmount)
  
  let totalBankAmount = calculateBank(bankAccount)
  // console.log(bankButton)
  const totalBankAmountDiv = document.createElement("div")
  totalBankAmountDiv.innerHTML = `$${totalBankAmount}`

  bankDiv.appendChild(totalBankAmountDiv)

})