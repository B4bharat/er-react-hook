// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

class ErrorBoundary extends React.Component {
  state = {error: null}
  static getDerivedStateFromError(error) {
    return {error}
  }

  render() {
    const {error} = this.state

    if (error) {
      return <this.props.FallbackComponent error={error} />
    }

    return this.props.children
  }
}

function PokemonInfo({pokemonName}) {
  const [status, setStatus] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })

  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, make sure to update the loading state
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    setStatus({status: 'pending', pokemon: null, error: null})
    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setStatus({status: 'resolved', pokemon: pokemonData, error: null})
      })
      .catch(error => {
        setStatus({status: 'rejected', pokemon: null, error})
      })
  }, [pokemonName])

  if (status.status === 'idle') {
    return 'Submit a pokemon'
  } else if (status.status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status.status === 'rejected') {
    throw status.error
  } else if (status.status === 'resolved') {
    return <PokemonDataView pokemon={status.pokemon} />
  }
}

function ErrorFallback({error}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback} key={pokemonName}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
