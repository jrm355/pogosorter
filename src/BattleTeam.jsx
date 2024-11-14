// BattleTeam.jsx
import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';

function BattleTeam() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(Array(3).fill(null));

  useEffect(() => {
    // Fetch Pokémon data from PogoAPI
    const fetchPokemonData = async () => {
      try {
        const response = await axios.get('https://pogoapi.net/api/v1/pokemon_max_cp.json');
        const data = Object.values(response.data).map((pokemon) => ({
          name: pokemon.pokemon_name,
          max_cp: pokemon.max_cp,
          typing: pokemon.types,
        }));
        setPokemonList(data);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };
    fetchPokemonData();
  }, []);

  const handlePokemonSelect = (index, pokemon) => {
    const updatedTeam = [...selectedPokemon];
    updatedTeam[index] = pokemon;
    setSelectedPokemon(updatedTeam);
  };

  return (
    <div>
      <h2>Battle Team</h2>
      {selectedPokemon.map((pokemon, index) => (
        <Autocomplete
          key={index}
          options={pokemonList}
          getOptionLabel={(option) => option.name || ''}
          onChange={(event, newValue) => handlePokemonSelect(index, newValue)}
          renderInput={(params) => <TextField {...params} label={`Pokemon ${index + 1}`} />}
        />
      ))}
      <div>
        {selectedPokemon.map((pokemon, index) => (
          pokemon ? (
            <div key={index}>
              <h3>{pokemon.name}</h3>
              <p>Max CP: {pokemon.max_cp}</p>
              <p>Typing: {pokemon.typing && pokemon.typing.length > 0 ? pokemon.typing.join(', ') : 'No typings available'}</p>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
}

export default BattleTeam;