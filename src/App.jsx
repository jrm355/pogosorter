import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // Fetch Pokémon data from PogoAPI on component mount
  useEffect(() => {
    fetch('https://pogoapi.net/api/v1/pokemon_stats.json')
      .then(response => response.json())
      .then(data => {
        setPokemonList(data); // Store entire list of Pokémon data
      })
      .catch(error => console.error('Error fetching Pokémon data:', error));
  }, []);

  // Filter Pokémon list as the user types
  useEffect(() => {
    if (searchTerm) {
      const results = pokemonList.filter(pokemon =>
        pokemon.pokemon_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPokemon(results);
    } else {
      setFilteredPokemon([]);
    }
  }, [searchTerm, pokemonList]);

  // Handle selection of a Pokémon from the autocomplete list
  const handleSelectPokemon = (pokemon) => {
    setSelectedPokemon(pokemon);
    setSearchTerm(''); // Clear the search term after selection
    setFilteredPokemon([]); // Clear the autocomplete suggestions
  };

  return (
    <div className="App">
      <h1>Pokémon GO Team Builder</h1>
      <h2>Select Filter by Raid Boss to find pokemon who are supereffective against a specific typed raid boss</h2>
      <h2>Select Filter by Pokemon tpe to find pokemon of a specific type</h2>
      
      {/* Search Bar */}
      <div className="search-container">
        <div className="autocomplete-suggestions">
          {filteredPokemon.slice(0, 5).map((pokemon) => (
            <div
              key={pokemon.pokemon_id}
              className="suggestion"
              onClick={() => handleSelectPokemon(pokemon)}
            >
              {pokemon.pokemon_name}
            </div>
          ))}
        </div>
      </div>

      {/* Display Selected Pokémon Details */}
      {selectedPokemon && (
        <div className="pokemon-details">
          <h2>{selectedPokemon.pokemon_name}</h2>
          <p><strong>Max CP:</strong> {selectedPokemon.max_cp}</p>
          <p><strong>Type:</strong> {selectedPokemon.types.join(', ')}</p>
          {/* Assuming PogoAPI provides URLs for Pokémon images */}
          <img src={selectedPokemon.image || 'default_image_url.png'} alt={`${selectedPokemon.pokemon_name}`} />
        </div>
      )}
    </div>
  );
};

export default App;