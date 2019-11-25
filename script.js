// console.log("hi")
// chart page = https://c.stockcharts.com/c-sc/sc?s=msft&p=D&b=5&g=0&i=0&r=1574550043277
// stock rec https://www.nasdaq.com/market-activity/stocks/aapl/analyst-research

const stockApi = "N84W2MQHNHRK05UG"
const stockUrl1 = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=`

const stockUrl2 = `&interval=1min&apikey=Z${stockApi}`
const stockUrlOK = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=${stockApi}`

const bankInput = document.querySelector("#bankInput")
const stockInput = document.querySelector("#stockInput")

const stockButton = document.querySelector("#stockButton")
const bankButton = document.querySelector("#bankButton")
const buyButton = document.querySelector("#buyButton")
const sellButton = document.querySelector("#sellButton")



const bankDiv = document.querySelector("#bankDiv")
const stockDiv = document.querySelector("#stockDiv")
const tradeDiv = document.querySelector("#tradeDiv")
const stockP = document.querySelector("#stockP")
const calBankDiv = document.querySelector("#calculateBank")

var date = new Date
var hours = function getHours() {
  if (date.getHours().length < 2) {
    return 0 + date.getHours()
  } else {
    return date.getHours()
  }
}

var minutes = function getMinutes() {
  if (date.getMinutes() < 10) {
    return `0${date.getMinutes()-1}`
  } else {
    return date.getMinutes()-1
  }
}

var bankAccount = []
var stocksOwned = []
var raysCommission = 0

stockButton.addEventListener("click", async function () {
  event.preventDefault()
  stockP.innerHTML = ""
  let stockName = stockInput.value.toUpperCase()
  let response = await axios.get(`${stockUrl1}${stockName}${stockUrl2}`)
  let stockPrice = response.data["Time Series (1min)"]
  console.log(stockPrice)
  let hoursIn = hours()
  let minutesIn = minutes()
  console.log(minutesIn)
  let stockTimed = stockPrice[`2019-11-25 ${hoursIn}:${minutesIn}:00`][`1. open`]

  const NewStockP = document.createElement('p')
  NewStockP.innerHTML = `${stockName} ${stockTimed}`
  stockP.appendChild(NewStockP)

  let stockCharts = document.createElement("img")
  stockCharts.setAttribute("src", `https://c.stockcharts.com/c-sc/sc?s=${stockName}&p=D&b=5&g=0&i=0&r=1574550043277`)
  stockP.classList.add("chartImg")
  stockP.appendChild(stockCharts)

  let stockRec = document.createElement("a")
  let link = document.createTextNode(`${stockName} Recommendation`)
  stockRec.setAttribute("target", "_blank")
  stockRec.appendChild(link)
  stockRec.title = `${stockName} Recommendation`
  stockRec.href = `https://www.nasdaq.com/market-activity/stocks/${stockName}/analyst-research`
  stockP.appendChild(stockRec)
})

buyButton.addEventListener("click", async function () {
  event.preventDefault()

  let stockName = stockInput.value.toUpperCase()
  stocksOwned.push(stockName)
  let response = await axios.get(`${stockUrl1}${stockName}${stockUrl2}`)
  let stockPrice = response.data["Time Series (1min)"]
  let hoursIn = hours()
  let minutesIn = minutes()
  let stockTimed = stockPrice[`2019-11-25 ${hoursIn}:${minutesIn}:00`][`1. open`]
  let parsedStockTimed = parseFloat(stockTimed, 10)

  if (calculateBank(bankAccount) < parsedStockTimed) {
    alert("Insufficient Funds")
  } else {
    raysCommission++
    bankAccount.push(-parsedStockTimed)
    let addStocktoBank = calculateBank(bankAccount)


    const addStockToBankDiv = document.createElement("div")
    addStockToBankDiv.innerHTML = `$${addStocktoBank}`
    bankDiv.appendChild(addStockToBankDiv)

    const addStockToLog = document.createElement("div")
    addStockToLog.innerHTML = `Bought ${stockName}@${stockTimed}`
    tradeDiv.appendChild(addStockToLog)    
  }
})



sellButton.addEventListener("click", async function () {
  event.preventDefault()

  let stockName = stockInput.value.toUpperCase()
  if (stocksOwned.includes(stockName)) {

    

    let response = await axios.get(`${stockUrl1}${stockName}${stockUrl2}`)
    let stockPrice = response.data["Time Series (1min)"]
    let hoursIn = hours()
    let minutesIn = minutes()
    let stockTimed = stockPrice[`2019-11-25 ${hoursIn}:${minutesIn}:00`][`1. open`]
    let parsedStockTimed = parseFloat(stockTimed, 10)
    bankAccount.push(parsedStockTimed)

    let subStocktoBank = calculateBank(bankAccount)

    const subStockToBankDiv = document.createElement("div")
    subStockToBankDiv.innerHTML = `$${subStocktoBank}`
    bankDiv.appendChild(subStockToBankDiv)

    const addStockToLog = document.createElement("div")
    addStockToLog.innerHTML = `Sold ${stockName}@${stockTimed}`
    tradeDiv.appendChild(addStockToLog)
    stocksOwned.splice(stocksOwned.indexOf(stockName, 1))

    raysCommission++
  } else {
    alert("No shorts allowed")
  }
})

function calculateBank(array) {
  let sum = 0
  for (let i = 0; i < array.length; i++) {
    sum += array[i]
  }
  return sum - raysCommission
}






bankButton.addEventListener("click", function () {
  event.preventDefault()

  let bankAmount = parseInt(bankInput.value, 10)
  if (bankAmount) {
    if (calculateBank(bankAccount< 0 )) {
      alert("Insufficient funds")
    } else {
      bankAccount.push(bankAmount)

      let totalBankAmount = calculateBank(bankAccount)

      const totalBankAmountDiv = document.createElement("div")
      totalBankAmountDiv.innerHTML = `$${totalBankAmount}`
      bankDiv.appendChild(totalBankAmountDiv)


      const addedToBankDiv = document.createElement("div")
      addedToBankDiv.innerHTML = "Added bank account:"
      tradeDiv.appendChild(addedToBankDiv)
    }
  }
})