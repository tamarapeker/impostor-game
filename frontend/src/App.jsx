import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io(window.location.hostname === 'localhost' 
  ? 'http://localhost:3001' 
  : window.location.origin,
  {
    transports: ['websocket'], 
    upgrade: false
  }
);

function App() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [players, setPlayers] = useState([]);
  const [gameData, setGameData] = useState(null);
  const [step, setStep] = useState('login'); // 'login', 'lobby', 'game'

  const isAdmin = players.length > 0 && players[0].id === socket.id;

  useEffect(() => {
    socket.on('update_players', (data) => setPlayers(data));
    socket.on('game_started', (data) => {
      setGameData(data);
      setStep('game');
    });
    socket.on('return_to_lobby', () => {
    setGameData(null);
    setStep('lobby');
    });
    
  // Cleanup on unmount
  return () => {
    socket.off('update_players');
    socket.off('game_started');
    socket.off('return_to_lobby');
  };
  }, []);

  const joinRoom = () => {
    if (name && room) {
      socket.emit('join_room', { roomId: room, name });
      setStep('lobby');
    }
  };

  const startGame = () => {
    socket.emit('start_game', { roomId: room });
  };

  return (
    <div className="impostor-root">
      <h1 className="impostor-title">🕵️‍♂️ El Impostor</h1>

      {step === 'login' && (
        <div className="impostor-login-box">
          <input className="impostor-input" placeholder="Nombre" onChange={e => setName(e.target.value)} />
          <input className="impostor-input" placeholder="Código Sala" onChange={e => setRoom(e.target.value)} />
          <button className="impostor-btn" onClick={joinRoom}>Entrar</button>
        </div>
      )}

      {step === 'lobby' && (
        <div className="impostor-lobby-box">
          <h3 className="impostor-room">Sala: {room}</h3>
          <ul className="impostor-player-list">{players.map((p, index) => <li key={p.id}>{p.name} {index === 0 ? '👑' : ''}</li>)}</ul>

          {isAdmin ? (
            <div className="impostor-admin-box">
              <p className="impostor-admin-label">Eres el administrador de la sala</p>
              <button className="impostor-btn" style={{marginTop: 16}} onClick={startGame} disabled={players.length < 3}>
                {players.length < 3 ? 'Esperando jugadores (mín. 3)...' : '¡Empezar Juego!'}
              </button>
            </div>
          ) : (
            <p className="impostor-wait-label">Esperando a que el administrador inicie la partida...</p>
          )}
        </div>
      )}

      {step === 'game' && gameData && (
        <div className="impostor-game-box">
          {gameData.role === 'impostor' ? (
            <div className="impostor-card impostor-card-impostor">
              <h2 className="impostor-card-title impostor-impostor-title">🤫 ERES EL IMPOSTOR</h2>
              <p className="impostor-card-desc">No tienes palabra. ¡Miente para que no te descubran!</p>
            </div>
          ) : (
            <div className="impostor-card impostor-card-word">
              <h2 className="impostor-card-title">La palabra es: <span className="impostor-word">{gameData.word}</span></h2>
              <p className="impostor-card-desc">¡Busca al impostor sin revelar la palabra!</p>
            </div>
          )}
          {isAdmin ? (
      <button 
        className="impostor-btn" 
        onClick={() => socket.emit('restart_game', room)}
      >
        Nueva Ronda
      </button>
    ) : ''}
        </div>
      )}
    </div>
  );
}

export default App;