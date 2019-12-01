const stockApi = "N84W2MQHNHRK05UG"
const stockUrl1 = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=`

const stockUrl2 = `&interval=1min&apikey=Z${stockApi}`
const stockUrlOK = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=${stockApi}`


const stockUrlChart = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=`

const stockUrlChart2 = `&interval=1min&apikey=Z${stockApi}`
// const stockUrlChart2 = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&interval=1min&apikey=${stockApi}`




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
const balanceNum = document.querySelector("#balanceNum")
const tradeSelect = document.querySelector("#tradeSelect")


var bankAccount = []
var stocksOwned = []
var raysCommission = 0

stockButton.addEventListener("click", async function () {
  event.preventDefault()
  stockP.innerHTML = ""
  let stockName = stockInput.value.toUpperCase()
  let response = await axios.get(`${stockUrl1}${stockName}${stockUrl2}`)
  console.log(response)
  let stockTime = response.data[`Meta Data`][`3. Last Refreshed`]
  // console.log(stockTime)
  let stockTimed = response.data["Time Series (1min)"][`${stockTime}`][`1. open`]

  const NewStockP = document.createElement('p')
  NewStockP.innerHTML = `${stockName} ${stockTimed}`
  stockP.appendChild(NewStockP)

  let stockRec = document.createElement("a")
  let link = document.createTextNode(`Click for ${stockName} Recommendation`)
  stockRec.setAttribute("target", "_blank")
  stockRec.appendChild(link)
  stockRec.title = `Click for ${stockName} Recommendations`
  stockRec.href = `https://www.nasdaq.com/market-activity/stocks/${stockName}/analyst-research`
  stockP.appendChild(stockRec)

  let stockCharts = document.createElement("img")
  stockCharts.setAttribute("src", `https://c.stockcharts.com/c-sc/sc?s=${stockName}&p=D&b=5&g=0&i=0&r=1574550043277`)
  stockP.classList.add("chartImg")
  stockP.appendChild(stockCharts)

  let stockCanvas = document.createElement("canvas")
  stockCanvas.classList.add("ChartColor")
  stockP.appendChild(stockCanvas)


  let response2 = await axios.get(`${stockUrlChart}${stockName}${stockUrlChart2}`)
  let stockTimeC = response2.data[`Meta Data`][`3. Last Refreshed`]
  let stockTimedC = response2.data["Time Series (Daily)"]
  console.log(stockTimeC)
  console.log(stockTimedC)
  let keys = Object.keys(stockTimedC)
  let correctKeys = keys.reverse()
  let values = []
  let correctValues = values.reverse()
  for (let i = 0; i < keys.length; i++){

    let stocked = response2.data["Time Series (Daily)"][`${keys[i]}`][`1. open`]
    values.push(stocked)
    
  }
 
  var ctx = document.getElementById('myChart').getContext('2d');
      var myChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: correctKeys,
              datasets: [{
                  label: `${stockName}`,
                  data: correctValues,
                  backgroundColor: 
                      'rgba(255, 99, 132, .2)',
                  
                  borderColor: 
                      'rgba(255, 99, 132, 1)',
                  
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero: false
                      }
                  }]
              }
          }
      });




})

buyButton.addEventListener("click", async function () {
  event.preventDefault()

  let stockName = stockInput.value.toUpperCase()
  stocksOwned.push(stockName)
  let response = await axios.get(`${stockUrl1}${stockName}${stockUrl2}`)
  let stockTime = response.data[`Meta Data`][`3. Last Refreshed`]
  let stockTimed = response.data["Time Series (1min)"][`${stockTime}`][`1. open`]

  let parsedStockTimed = parseFloat(stockTimed, 10)

  if (calculateBank(bankAccount) < parsedStockTimed) {
    alert("Insufficient Funds")
  } else {
    raysCommission++
    bankAccount.push(-parsedStockTimed)
    let addStocktoBank = calculateBank(bankAccount)

    const tradeSelected = document.createElement("option")
    tradeSelected.innerHTML = `Bought ${stockName}@${stockTimed} $${addStocktoBank}`
    tradeSelect.appendChild(tradeSelected) 

    document.querySelector("#total").innerHTML = `$${calculateBank(bankAccount)}`
  }
})

sellButton.addEventListener("click", async function () {
  event.preventDefault()

  let stockName = stockInput.value.toUpperCase()
  if (stocksOwned.includes(stockName)) {

    let response = await axios.get(`${stockUrl1}${stockName}${stockUrl2}`)
    let stockTime = response.data[`Meta Data`][`3. Last Refreshed`]
    let stockTimed = response.data["Time Series (1min)"][`${stockTime}`][`1. open`]
    
    raysCommission++
   
    let parsedStockTimed = parseFloat(stockTimed, 10)
    bankAccount.push(parsedStockTimed)

    let subStocktoBank = calculateBank(bankAccount)

    const tradeSelected = document.createElement("option")
    tradeSelected.innerHTML = `Sold ${stockName}@${stockTimed} $${subStocktoBank}`
    tradeSelect.appendChild(tradeSelected)   

    document.querySelector("#total").innerHTML = `$${calculateBank(bankAccount)}`

    stocksOwned.splice(stockName,1)
    
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
    if (calculateBank(bankAccount) < 0) {
      alert("Insufficient funds")
    } else {

      bankAccount.push(bankAmount)

      let totalBankAmount = calculateBank(bankAccount)

      const tradeSelected = document.createElement("option")
      tradeSelected.innerHTML = `Added to Bank: $${totalBankAmount}`
      tradeSelect.appendChild(tradeSelected)

      document.querySelector("#total").innerHTML = `$${calculateBank(bankAccount)}`

    }
  }
})