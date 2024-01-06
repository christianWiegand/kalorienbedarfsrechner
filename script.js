/*
Die Berechnung des Kalorienbedarfs, auch Grundumsatz genannt, hängt von verschiedenen Faktoren ab, wie Alter, Geschlecht, Gewicht, Größe und Aktivitätslevel. Es gibt mehrere Methoden, um den Grundumsatz zu schätzen. Eine der bekanntesten ist die Harris-Benedict-Formel. 
Das Ergebnis gibt eine Schätzung der Kalorien, die dein Körper täglich benötigt, um sein aktuelles Gewicht zu halten, basierend auf deinem Aktivitätslevel.
Eine Webseite in HTML, CSS und Javascript, die mein Geschlecht, Gewicht in kg, Größe in cm, Alter in Jahren abfragt und mir dann mein BMR anzeigt. Anschließend soll es ein Dropdown geben, wo ich den täglichen Aktivitätslevel auswählen kann. Wenn die Auswahl getroffen wurde, soll die Schätzung der Kalorien, die dein Körper täglich benötigt angezeigt werden.
*/

document.getElementById('calculator-form').onsubmit = function(event) {

  event.preventDefault()
  calculateBMR()
}

var bmr
let globalWeight

function calculateBMR() {

  var gender = document.getElementById('gender').value
  var weight = parseFloat(document.getElementById('weight').value)
  globalWeight = weight
  var height = parseFloat(document.getElementById('height').value)
  var age = parseFloat(document.getElementById('age').value)

  if (gender === "male") {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
  } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
  }
  var bmrFormatted = bmr.toLocaleString('de-DE', { maximumFractionDigits: 2 })
  document.getElementById('bmr-result').innerText = 'Dein Grundumsatz (BMR) ist: ' + bmrFormatted + ' Kalorien pro Tag.'
  saveToLocalStorage()
}

function calculateTotalCalories() {
  
  calculateBMR()

  var bmrText = document.getElementById('bmr-result').innerText
  var activityFactor = parseFloat(document.getElementById('activity').value)
  var goalFactor = parseFloat(document.getElementById('goal').value)

  var totalCalories = bmr * activityFactor + goalFactor
  var totalCaloriesFormatted = totalCalories.toLocaleString('de-DE', { maximumFractionDigits: 2 })

  const proteinNeed = globalWeight * 1.7
  const proteinCalories = globalWeight * 1.7 * 4
  const remainingCalories = totalCalories - globalWeight * 1.7 * 4
  const remainingCaloriesFormatted = remainingCalories.toLocaleString('de-DE', { maximumFractionDigits: 2 })

  document.getElementById('total-calories-result').innerText = 'Geschätzter Gesamtkalorienbedarf: ' + totalCaloriesFormatted + ' Kalorien pro Tag.'
  document.getElementById('protein-result').innerText = 'Proteinbedarf: ' + proteinNeed + 'g pro Tag. Das sind ' + proteinCalories + ' Kalorien.'
  document.getElementById('remainingCalories').innerText = 'Es bleiben ' + remainingCaloriesFormatted + ' Kalorien übrig.'

  saveToLocalStorage()
}

function saveToLocalStorage() {

  var gender = document.getElementById('gender').value
  var weight = document.getElementById('weight').value
  var height = document.getElementById('height').value
  var age = document.getElementById('age').value
  var activity = document.getElementById('activity').value
  var goal = document.getElementById('goal').value

  localStorage.setItem('gender', gender)
  localStorage.setItem('weight', weight)
  localStorage.setItem('height', height)
  localStorage.setItem('age', age)
  localStorage.setItem('activity', activity)
  localStorage.setItem('goal', goal)
}

document.getElementById('gender').addEventListener('change', saveToLocalStorage)
document.getElementById('weight').addEventListener('input', saveToLocalStorage)
document.getElementById('height').addEventListener('input', saveToLocalStorage)
document.getElementById('age').addEventListener('input', saveToLocalStorage)
document.getElementById('activity').addEventListener('change', saveToLocalStorage)
document.getElementById('goal').addEventListener('change', saveToLocalStorage)

function loadFromLocalStorage() {

  document.getElementById('gender').value = localStorage.getItem('gender') || 'male'
  document.getElementById('weight').value = localStorage.getItem('weight') || ''
  document.getElementById('height').value = localStorage.getItem('height') || ''
  document.getElementById('age').value = localStorage.getItem('age') || ''
  document.getElementById('activity').value = localStorage.getItem('activity') || '1.2'
  document.getElementById('goal').value = localStorage.getItem('goal') || '0'

  const allStuffIsThere = document.getElementById('weight').value && document.getElementById('height').value && document.getElementById('age').value
  if(!allStuffIsThere) return
  calculateBMR()
  calculateTotalCalories()
}

document.addEventListener('DOMContentLoaded', loadFromLocalStorage)