import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [backgroundImage, setBackgroundImage] = useState('');

  // Get a random Pokémon image for the background
  useEffect(() => {
    const fetchRandomPokemonImage = () => {
      const randomId = Math.floor(Math.random() * 1010) + 1; // Pokémon IDs range from 1 to 1010
      const url = `https://pokeapi.co/api/v2/pokemon/${randomId}`;
      
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const image = data.sprites.other['official-artwork'].front_default;
          if (image) {
            setBackgroundImage(image);
          } else {
            setBackgroundImage('fallback_image_url.png'); // Set a fallback image if no image is found
          }
        })
        .catch(error => {
          console.error('Error fetching Pokémon image:', error);
          setBackgroundImage('fallback_image_url.png'); // Fallback image on error
        });
    };

    fetchRandomPokemonImage();
  }, []);

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
       <h2>Select Filter by Raid Boss to find pokemon who are supereffective against a specific typed raid boss</h2>
      <h2>Select Filter by Pokemon type to find pokemon of a specific type</h2>
      <h2>Refresh for another random pokemon</h2>
    </div>
  );
};

export default App;
