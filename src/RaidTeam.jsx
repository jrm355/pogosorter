
// RaidTeam.jsx
import React, { useEffect, useState } from 'react';

function RaidTeam() {
  const [pokemonData, setPokemonData] = useState([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=6") // Example API URL, adjust as needed
      .then(response => response.json())
      .then(data => setPokemonData(data.results))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h2>Raid Team Selector</h2>
      <div className="team-container">
        {pokemonData.map((pokemon, index) => (
          <div key={index} className="pokemon-slot">
            <p>{pokemon.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RaidTeam;