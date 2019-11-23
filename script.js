// console.log("hi")



const stockApi = "N84W2MQHNHRK05UG"
const stockUrl1 = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=`

const stockUrl2= `&interval=1min&apikey=Z${stockApi}`
const stockUrlOK= `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=${stockApi}`

const bankInput = document.querySelector("#bankInput")
const stockInput = document.querySelector("#stockInput")

const stockButton = document.querySelector("#stockButton")
const bankButton = document.querySelector("#bankButton")
const bankDiv = document.querySelector("#bankDiv")
const stockDiv = document.querySelector("#stockDiv")
const buyButton = document.querySelector("#buyButton")
const sellButton = document.querySelector("#sellButton")

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

  let addStockToBank.innerHTML = stockName + stockTimed
  
})


var bankAccount = 0
bankButton.addEventListener("click", async function () {
  event.preventDefault()
  let bankAmount = parseInt(bankInput.value,10)
  bankAccount += bankAmount
  // console.log(bankButton)
  const newBankDiv = document.createElement("div")
  newBankDiv.innerHTML = `$${bankAccount}`
  bankDiv.appendChild(newBankDiv)

})