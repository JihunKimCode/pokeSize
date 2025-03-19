const pokemonData = [
    { name: "Bulbasaur", type: "Grass Poison", height_ft: "2′04″", height_m: 0.7, weight_lbs: 15.2, weight_kg: 6.9, bmi: 14.1 },
    { name: "Ivysaur", type: "Grass Poison", height_ft: "3′03″", height_m: 1.0, weight_lbs: 28.7, weight_kg: 13, bmi: 13 },
    { name: "Venusaur", type: "Grass Poison", height_ft: "6′07″", height_m: 2.0, weight_lbs: 220.5, weight_kg: 100, bmi: 25 }
];

document.getElementById("unit").addEventListener("change", function() {
    let unit = this.value;
    document.getElementById("imperial-inputs").style.display = unit === "imperial" ? "block" : "none";
    document.getElementById("metric-inputs").style.display = unit === "metric" ? "block" : "none";
});

function convertFeetInchesToMeters(feet, inches) {
    return ((feet * 12) + inches) * 0.0254;
}

function convertPoundsToKg(pounds) {
    return pounds * 0.453592;
}

function findPokemon() {
    let unit = document.getElementById("unit").value;
    let userHeight, userWeight;

    if (unit === "imperial") {
        let feet = parseFloat(document.getElementById("feet").value) || 0;
        let inches = parseFloat(document.getElementById("inches").value) || 0;
        let weightLbs = parseFloat(document.getElementById("weight-lbs").value);

        if (!weightLbs) {
            alert("Please enter a valid weight.");
            return;
        }

        userHeight = convertFeetInchesToMeters(feet, inches);
        userWeight = convertPoundsToKg(weightLbs);
    } else {
        userHeight = parseFloat(document.getElementById("height-m").value);
        userWeight = parseFloat(document.getElementById("weight-kg").value);

        if (!userHeight || !userWeight) {
            alert("Please enter valid height and weight.");
            return;
        }
    }

    let exactMatch = pokemonData.find(p => p.height_m === userHeight && p.weight_kg === userWeight);
    let heightMatch = pokemonData.find(p => p.height_m === userHeight);
    let weightMatch = pokemonData.find(p => p.weight_kg === userWeight);

    let minDifference = Infinity;
    let closestMatches = [];

    pokemonData.forEach(p => {
        let diff = Math.abs(p.height_m - userHeight) + Math.abs(p.weight_kg - userWeight);
        if (diff < minDifference) {
            minDifference = diff;
            closestMatches = [p];
        } else if (diff === minDifference) {
            closestMatches.push(p);
        }
    });

    let resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";
    resultDiv.style.display = "block";

    if (exactMatch) {
        resultDiv.innerHTML = `<p><b>Exact Match:</b> ${exactMatch.name} (${exactMatch.type}) - Height: ${exactMatch.height_ft} (${exactMatch.height_m}m), Weight: ${exactMatch.weight_lbs} lbs (${exactMatch.weight_kg} kg), BMI: ${exactMatch.bmi}</p>`;
    } else if (heightMatch || weightMatch) {
        let match = heightMatch || weightMatch;
        resultDiv.innerHTML = `<p><b>Partial Match:</b> ${match.name} (${match.type}) - Height: ${match.height_ft} (${match.height_m}m), Weight: ${match.weight_lbs} lbs (${match.weight_kg} kg), BMI: ${match.bmi}</p>`;
    } else {
        resultDiv.innerHTML = `<p><b>Closest Match(es):</b></p>`;
        closestMatches.forEach(p => {
            resultDiv.innerHTML += `<p>${p.name} (${p.type}) - Height: ${p.height_ft} (${p.height_m}m), Weight: ${p.weight_lbs} lbs (${p.weight_kg} kg), BMI: ${p.bmi}</p>`;
        });
    }
}
