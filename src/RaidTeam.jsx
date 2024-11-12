import React, { useEffect, useState } from 'react';

function RaidTeam() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(Array(6).fill(""));
  const [pokemonDetails, setPokemonDetails] = useState(Array(6).fill({ img: "", type: [], maxCp: "" }));

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1000") 
      .then(response => response.json())
      .then(data => setPokemonList(data.results))
      .catch(error => console.error("Error fetching Pokémon list:", error));
  }, []);

  const handlePokemonChange = (index, pokemonName) => {
    setSelectedPokemon((prev) => {
      const newSelection = [...prev];
      newSelection[index] = pokemonName;
      return newSelection;
    });

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then(response => response.json())
      .then(data => {
        const types = data.types.map(type => type.type.name);
        const maxCp = data.stats.find(stat => stat.stat.name === 'special-attack').base_stat * 15;
        
        setPokemonDetails((prev) => {
          const newDetails = [...prev];
          newDetails[index] = {
            img: data.sprites.front_default,
            type: types,
            maxCp: maxCp
          };
          return newDetails;
        });
      })
      .catch(error => console.error("Error fetching Pokémon details:", error));
  };

  return (
    <div>
      <h2>Raid Team Selector</h2>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index}>
          <label>Select Pokémon {index + 1}: </label>
          <select
            value={selectedPokemon[index]}
            onChange={(e) => handlePokemonChange(index, e.target.value)}
          >
            <option value="">Choose...</option>
            {pokemonList.map((pokemon) => (
              <option key={pokemon.name} value={pokemon.name}>
                {pokemon.name}
              </option>
            ))}
          </select>
          {pokemonDetails[index].img && (
            <div>
              <img src={pokemonDetails[index].img} alt={selectedPokemon[index]} />
              <p>Type: {pokemonDetails[index].type.join(", ")}</p>
              <p>Max CP: {pokemonDetails[index].maxCp}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default RaidTeam;