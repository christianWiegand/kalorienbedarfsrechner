/*
Die Berechnung des Kalorienbedarfs, auch Grundumsatz genannt, hängt von verschiedenen Faktoren ab, wie Alter, Geschlecht, Gewicht, Größe und Aktivitätslevel. Es gibt mehrere Methoden, um den Grundumsatz zu schätzen. Eine der bekanntesten ist die Harris-Benedict-Formel. 
Das Ergebnis gibt eine Schätzung der Kalorien, die dein Körper täglich benötigt, um sein aktuelles Gewicht zu halten, basierend auf deinem Aktivitätslevel.
Eine Webseite in HTML, CSS und Javascript, die mein Geschlecht, Gewicht in kg, Größe in cm, Alter in Jahren abfragt und mir dann mein BMR anzeigt. Anschließend soll es ein Dropdown geben, wo ich den täglichen Aktivitätslevel auswählen kann. Wenn die Auswahl getroffen wurde, soll die Schätzung der Kalorien, die dein Körper täglich benötigt angezeigt werden.
Auch der Proteinbedarf soll berechnet werden. Der Proteinbedarf ist abhängig von deinem Körpergewicht. Die empfohlene Menge liegt bei 1,7g pro kg Körpergewicht.
Es werden auch die restlichen Kalorien angezeigt, die du noch essen kannst, um dein Ziel zu erreichen.
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

let remainingCalories
function calculateTotalCalories() {
  
  calculateBMR()

  var activityFactor = parseFloat(document.getElementById('activity').value)
  var goalFactor = parseFloat(document.getElementById('goal').value)

  var totalCalories = bmr * activityFactor + goalFactor
  var totalCaloriesFormatted = totalCalories.toLocaleString('de-DE', { maximumFractionDigits: 2 })

  const proteinNeed = globalWeight * 1.7
  const proteinCalories = globalWeight * 1.7 * 4
  remainingCalories = totalCalories - globalWeight * 1.7 * 4
  const remainingCaloriesFormatted = remainingCalories.toLocaleString('de-DE', { maximumFractionDigits: 2 })

  document.getElementById('carbs-slider').max = remainingCalories
  document.getElementById('fats-slider').max = remainingCalories

  const halfRemainingCalories = remainingCalories / 2;
  document.getElementById('carbs-slider').value = halfRemainingCalories
  document.getElementById('fats-slider').value = halfRemainingCalories

  document.getElementById('total-calories-result').innerText = 'Geschätzter Gesamtkalorienbedarf: ' + totalCaloriesFormatted + ' Kalorien pro Tag.'
  document.getElementById('protein-result').innerText = 'Proteinbedarf: ' + proteinNeed + 'g pro Tag. Das sind ' + proteinCalories + ' Kalorien.'
  document.getElementById('remainingCalories').innerText = 'Es bleiben ' + remainingCaloriesFormatted + ' Kalorien übrig.'

  saveToLocalStorage()
  
  updateMacros()
  showCalories('carbs')
  showCalories('fats')
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

  updateMacros()
}

document.addEventListener('DOMContentLoaded', loadFromLocalStorage)

/*
Unterhalb der übrig bleibenden Kalorien möchte ich jetzt zwei Schieberegler nebeneinander haben. Einer für Kohlenhydrate und einer für Fett. Die Schieberegler regeln jeweils die Kalorienmenge von diesem Makrotyp. Wenn ich z.B. die Kohlenhydrate erhöhe, dann muss sich die Menge Fett verringern und umgekehrt. Insgesamt muss es immer die Summe aus der Variable remainingCalories ergeben. Denk dran, dass Fett pro Gramm mehr Kalorien hat als Kohlenhydrate pro Gramm.
Und unterhalb der Schieberegler, soll jeweils die Menge Kohlenhydrate und Fett in Gramm ausgegeben werden.
*/
function updateMacros() {

  let carbsSlider = document.getElementById('carbs-slider')
  let fatsSlider = document.getElementById('fats-slider')
  let carbsCalories = carbsSlider.value
  let fatsCalories = fatsSlider.value
  const totalCalories = parseFloat(carbsCalories) + parseFloat(fatsCalories)

  if (carbsSlider === document.activeElement) {

    fatsCalories = remainingCalories - carbsCalories
    fatsSlider.value = fatsCalories
  }
  else if (fatsSlider === document.activeElement) {

    carbsCalories = remainingCalories - fatsCalories
    carbsSlider.value = carbsCalories
  }

  const carbsFormatted = (carbsSlider.value / 4).toLocaleString('de-DE', { maximumFractionDigits: 2 })
  const fatFormatted = (fatsSlider.value / 9).toLocaleString('de-DE', { maximumFractionDigits: 2 })
  document.getElementById('carbs-amount').innerText = carbsFormatted + 'g'
  document.getElementById('fats-amount').innerText = fatFormatted + 'g'
  showCalories('carbs')
  showCalories('fats')
}

function showCalories(macroType) {

  const slider = document.getElementById(`${macroType}-slider`)
  const amountLabel = document.getElementById(`${macroType}KCal`)
  amountLabel.innerText = `${slider.value} kCal`
}