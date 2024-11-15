import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, MenuItem, Select, InputLabel, FormControl, Checkbox, ListItemText, Chip } from '@mui/material';
import axios from 'axios';

// Pokémon type effectiveness, ashamed to say I know this by heart
const typeChart = {
  normal: ['fighting'],
  fire: ['water', 'rock', 'fire'],
  water: ['electric', 'grass'],
  electric: ['ground'],
  grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
  ice: ['fire', 'fighting', 'rock', 'steel'],
  fighting: ['flying', 'psychic', 'fairy'],
  poison: ['ground', 'psychic'],
  ground: ['water', 'ice', 'grass'],
  flying: ['electric', 'ice', 'rock'],
  psychic: ['bug', 'ghost', 'dark'],
  bug: ['fire', 'flying', 'rock'],
  rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
  ghost: ['dark', 'ghost'],
  dragon: ['dragon', 'fairy'],
  dark: ['fighting', 'bug', 'fairy'],
  steel: ['fire', 'fighting', 'ground'],
  fairy: ['steel', 'poison'],
};

function RaidTeam() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(Array(6).fill(null));
  const [raidBossTypes, setRaidBossTypes] = useState([]); // Store selected raid boss types

  useEffect(() => {
    // Fetch Pokémon data and images from PokeAPI 
    const fetchPokemonData = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100'); // Get list of Pokémon
        const data = await Promise.all(
          response.data.results.map(async (pokemon) => {
            const pokemonDetails = await axios.get(pokemon.url);
            return {
              id: pokemonDetails.data.id, // Add Pokémon number
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

  const handleRaidBossTypesChange = (event) => {
    const { value } = event.target;
    setRaidBossTypes(value);
  };

  // Get Pokémon whose types are strong against all selected raid boss types
  const getSuperEffectiveTypes = (raidBossTypes) => {
    return pokemonList.filter((pokemon) => {
      // Check if all selected raid boss types are weak to any of the Pokémon's types
      return raidBossTypes.every((raidType) => 
        pokemon.typing.some((type) => typeChart[raidType]?.includes(type))
      );
    });
  };

  const filteredPokemon = raidBossTypes.length > 0 ? getSuperEffectiveTypes(raidBossTypes) : pokemonList;

  return (
    <div>
      <h2>Raid Team</h2>

      {/* Raid Boss Type Dropdowns */}
      <div>
        <FormControl fullWidth style={{ marginBottom: '20px' }}>
          <InputLabel>Raid Boss Types</InputLabel>
          <Select
            multiple
            value={raidBossTypes}
            onChange={handleRaidBossTypesChange}
            label="Raid Boss Types"
            renderValue={(selected) => (
              <div>
                {selected.map((value) => (
                  <Chip key={value} label={value.charAt(0).toUpperCase() + value.slice(1)} style={{ margin: 2 }} />
                ))}
              </div>
            )}
          >
            {Object.keys(typeChart).map((type) => (
              <MenuItem key={type} value={type}>
                <Checkbox checked={raidBossTypes.indexOf(type) > -1} />
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
          getOptionLabel={(option) => `#${option.id} ${option.name}`}
          onChange={(event, newValue) => handlePokemonSelect(index, newValue)}
          renderInput={(params) => <TextField {...params} label={`Pokemon ${index + 1}`} />}
        />
      ))}

      {/* Display Filtered Pokémon in a row (as cards) */}
      <div className="pokemon-row">
        {selectedPokemon.map((pokemon, index) => (
          pokemon ? (
            <div key={index} className="pokemon-slot">
              <h3>{pokemon.name}</h3>
              <img src={pokemon.image} alt={pokemon.name} />
              <p>Max CP: {pokemon.max_cp}</p>
              <p>Number: #{pokemon.id}</p>
              <p>Typing: {pokemon.typing && pokemon.typing.length > 0 ? pokemon.typing.join(', ') : 'No typings available'}</p>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
}

export default RaidTeam;
