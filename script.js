document.getElementById('calculator-form').onsubmit = function(event) {
  event.preventDefault();
  calculateBMR();
};

function calculateBMR() {
  var gender = document.getElementById('gender').value;
  var weight = parseFloat(document.getElementById('weight').value);
  var height = parseFloat(document.getElementById('height').value);
  var age = parseFloat(document.getElementById('age').value);
  var bmr;

  if (gender === "male") {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
  var bmrFormatted = bmr.toLocaleString('de-DE', { maximumFractionDigits: 2 });
  document.getElementById('bmr-result').innerText = 'Dein Grundumsatz (BMR) ist: ' + bmrFormatted + ' Kalorien pro Tag.';
}

function calculateTotalCalories() {
  var bmrText = document.getElementById('bmr-result').innerText;
  var bmr = parseFloat(bmrText.replace('Dein Grundumsatz (BMR) ist: ', '').replace(' Kalorien pro Tag.', ''));
  var activityFactor = parseFloat(document.getElementById('activity').value);

  var totalCalories = bmr * activityFactor;
  var totalCaloriesFormatted = totalCalories.toLocaleString('de-DE', { maximumFractionDigits: 2 });
  document.getElementById('total-calories-result').innerText = 'Geschätzter Gesamtkalorienbedarf: ' + totalCaloriesFormatted + ' Kalorien pro Tag.';
}
