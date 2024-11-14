import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';

function RaidTeam() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(Array(6).fill(null));

  useEffect(() => {
    // Fetch Pokémon data from PokeAPI (which includes images)
    const fetchPokemonData = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100'); // Get list of Pokémon
        const data = await Promise.all(
          response.data.results.map(async (pokemon) => {
            const pokemonDetails = await axios.get(pokemon.url);
            return {
              name: pokemonDetails.data.name,
              image: pokemonDetails.data.sprites.front_default, // Pokémon image
              max_cp: pokemonDetails.data.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 'N/A', // Sample stat (HP)
              typing: pokemonDetails.data.types.map(type => type.type.name), // Pokémon types
            };
          })
        );
        setPokemonList(data);
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
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
      <h2>Raid Team</h2>
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
            <div key={index} style={{ marginBottom: '20px' }}>
              <h3>{pokemon.name}</h3>
              <img src={pokemon.image} alt={pokemon.name} style={{ width: '100px', height: '100px' }} />
              <p>Max CP: {pokemon.max_cp}</p>
              <p>Typing: {pokemon.typing && pokemon.typing.length > 0 ? pokemon.typing.join(', ') : 'No typings available'}</p>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
}

export default RaidTeam;
