import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, MenuItem, Select, InputLabel, FormControl, Checkbox, ListItemText, Chip } from '@mui/material';
import axios from 'axios';

function BattleTeam() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(Array(3).fill(null));
  const [selectedTypes, setSelectedTypes] = useState([]); // Store selected types for filtering

  useEffect(() => {
    // Fetch Pokémon data from PokeAPI
    const fetchPokemonData = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
        const data = await Promise.all(
          response.data.results.map(async (pokemon) => {
            const pokemonDetails = await axios.get(pokemon.url);
            return {
              name: pokemonDetails.data.name,
              image: pokemonDetails.data.sprites.front_default,
              max_cp: pokemonDetails.data.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 'N/A',
              typing: pokemonDetails.data.types.map(type => type.type.name),
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

  const handleTypeFilterChange = (event) => {
    const { value } = event.target;
    setSelectedTypes(value);
  };

  // Filter Pokémon by selected types
  const filteredPokemon = selectedTypes.length > 0
    ? pokemonList.filter((pokemon) => pokemon.typing.some(type => selectedTypes.includes(type)))
    : pokemonList;

  return (
    <div>
      <h2>Battle Team</h2>

      {/* Type Filter Dropdown */}
      <div>
        <FormControl fullWidth style={{ marginBottom: '20px' }}>
          <InputLabel>Filter by Type</InputLabel>
          <Select
            multiple
            value={selectedTypes}
            onChange={handleTypeFilterChange}
            label="Filter by Type"
            renderValue={(selected) => (
              <div>
                {selected.map((value) => (
                  <Chip key={value} label={value.charAt(0).toUpperCase() + value.slice(1)} style={{ margin: 2 }} />
                ))}
              </div>
            )}
          >
            {[
              'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground',
              'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
            ].map((type) => (
              <MenuItem key={type} value={type}>
                <Checkbox checked={selectedTypes.indexOf(type) > -1} />
                <ListItemText primary={type.charAt(0).toUpperCase() + type.slice(1)} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Pokémon Selection */}
      {selectedPokemon.map((pokemon, index) => (
        <Autocomplete
          key={index}
          options={filteredPokemon}
          getOptionLabel={(option) => option.name || ''}
          onChange={(event, newValue) => handlePokemonSelect(index, newValue)}
          renderInput={(params) => <TextField {...params} label={`Pokemon ${index + 1}`} />}
        />
      ))}

      {/* Display Selected Pokémon */}
      <div className="pokemon-row">
        {selectedPokemon.map((pokemon, index) => (
          pokemon ? (
            <div key={index} className="pokemon-slot">
              <h3>{pokemon.name}</h3>
              <img src={pokemon.image} alt={pokemon.name} />
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