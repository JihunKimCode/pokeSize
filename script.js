let pokemonData = [];

// Fetch CSV
fetch('https://raw.githubusercontent.com/JihunKimCode/pokeSize/refs/heads/main/BMI.csv')
    .then(response => response.text())
    .then(csvData => {
        pokemonData = parseCSV(csvData);
    })
    .catch(error => console.error("Error fetching CSV:", error));

// Parse CSV data into an array of objects
function parseCSV(csv) {
    const lines = csv.split("\n");
    const headers = lines[0].split(",");
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(",");
        if (row.length === headers.length) {
            const pokemon = {};
            for (let j = 0; j < headers.length; j++) {
                pokemon[headers[j].trim()] = row[j].trim();
            }
            data.push(pokemon);
        }
    }

    return data.map(pokemon => ({
        number: pokemon['#'],
        name: pokemon['Name'],
        type: pokemon['Type'],
        height_ft: pokemon['Height (ft)'],
        height_m: parseFloat(pokemon['Height (m)']),
        weight_lbs: parseFloat(pokemon['Weight (lbs)']),
        weight_kg: parseFloat(pokemon['Weight (kgs)']),
        bmi: parseFloat(pokemon['BMI']),
    }));
}

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

// Trigger the search when Enter is pressed
document.body.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        findPokemon();
    }
});

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

    // Find exact matches
    let exactMatches = pokemonData.filter(p => p.height_m === userHeight && p.weight_kg === userWeight);

    // Find partial matches
    let partialMatches = pokemonData.filter(p => p.height_m === userHeight || p.weight_kg === userWeight);

    // Find closest matches based on height and weight differences
    let closestMatches = [];

    // Function to add a Pokémon to the closest matches list
    function addToClosestMatches(pokemon) {
        // Exclude Pokémon that are already in exactMatches or partialMatches
        if (exactMatches.includes(pokemon) || partialMatches.includes(pokemon)) {
            return; // Skip this Pokémon
        }

        // Add the Pokémon to the list
        closestMatches.push(pokemon);

        // Sort by the sum of absolute differences (height + weight)
        closestMatches.sort((a, b) => {
            let diffA = Math.abs(a.height_m - userHeight) + Math.abs(a.weight_kg - userWeight);
            let diffB = Math.abs(b.height_m - userHeight) + Math.abs(b.weight_kg - userWeight);
            return diffA - diffB;
        });

        // Keep only the top 10 closest matches
        if (closestMatches.length > 10) {
            closestMatches.pop();  // Remove the Pokémon with the largest difference
        }
    }

    // Iterate over all Pokémon and update closest matches
    pokemonData.forEach(p => addToClosestMatches(p));


    const result = document.getElementById("result");
    result.style.display = "inline-flex";
        
    let emDiv = document.getElementById("exact-match");
    let pmDiv = document.getElementById("partial-match");
    let cmDiv = document.getElementById("close-match");
    emDiv.innerHTML = "";
    pmDiv.innerHTML = "";
    cmDiv.innerHTML = "";

    // Show exact matches
    if (exactMatches.length > 0) {
        exactMatches.forEach(p => {
            emDiv.innerHTML += generatePokemonCard(p);
        });
    }

    // Show partial matches
    if (partialMatches.length > 0) {
        partialMatches.forEach(p => {
            pmDiv.innerHTML += generatePokemonCard(p);
        });
    }

    // Show closest matches
    if (closestMatches.length > 0) {
        closestMatches.forEach(p => {
            cmDiv.innerHTML += generatePokemonCard(p);
        });
    }
}

// Function to generate HTML for each Pokémon card
function generatePokemonCard(pokemon) {
    const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.number}.png`;
    return `
        <div class="pokemon-card">
            <img src="${imgUrl}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <p><b>Type</b>: ${pokemon.type}</p>
            <p><b>Height</b>: ${pokemon.height_ft} ft (${pokemon.height_m} m)</p>
            <p><b>Weight</b>: ${pokemon.weight_lbs} lbs (${pokemon.weight_kg} kg)</p>
            <p><b>BMI</b>: ${pokemon.bmi}</p>
        </div>
    `;
}
