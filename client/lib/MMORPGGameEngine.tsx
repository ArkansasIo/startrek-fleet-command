import { createContext, useContext, useState, ReactNode } from "react";
import { GamePlayer, GameState as GameStateHook, useGameState } from "../hooks/useGameState";
import { ResourceState, initialResources } from "./OGameMechanics";

// MMORPG Player type for game mechanics
export interface Player {
  id: string;
  name: string;
  level: number;
  experience: number;
  resources: ResourceState;
  buildings: { [buildingId: string]: number }; // building level
  fleets: { [unitId: string]: number }; // unit count
  researches: { [researchId: string]: number }; // research level
  planets: string[]; // planet IDs
  alliance?: string; // alliance ID
  turnActions?: any[]; // actions queued for next turn
  log?: string[]; // player action log
}

// MMORPG GameState type for game mechanics (dictionary-based)
export interface GameState {
  players: { [playerId: string]: Player };
  turnNumber: number;
  lastTurnTime: number;
}

// Alternative GameState for array-based player management (used by UniverseMaps)
export interface GameStateArray {
  players: Player[];
  turn: number;
  logs: string[];
  bosses: any[];
  planets: any[];
}

// Create initial player for MMORPG mechanics
export function createInitialPlayer(id: string, name: string): Player {
  return {
    id,
    name,
    level: 1,
    experience: 0,
    resources: { ...initialResources },
    buildings: {},
    fleets: {},
    researches: {},
    planets: [`${id}_homeworld`],
    turnActions: [],
    log: [],
  };
}

// Process a game turn
export function processTurn(game: GameState): GameState {
  const newGame = { ...game, turnNumber: game.turnNumber + 1, lastTurnTime: Date.now() };
  // Process resource production, building construction, etc.
  // This is a placeholder - implement actual turn logic as needed
  return newGame;
}

// Process a game turn for array-based game state
export function processTurnArray(game: GameStateArray): GameStateArray {
  const newGame = { ...game, turn: game.turn + 1 };
  // Process each player's turn actions
  newGame.players = game.players.map(player => ({
    ...player,
    turnActions: [],
  }));
  return newGame;
}

// Define the context type
interface GameContextType {
  player: GamePlayer | null;
  setPlayer: (player: GamePlayer | null) => void;
  game: GameStateHook;
  setGame: (game: GameStateHook) => void;
  gameState: GameStateHook;
  initializePlayer: (officerData: any) => void;
  acceptMission: (missionId: string) => void;
  updateObjectiveProgress: (missionId: string, objectiveId: string, progress: number) => void;
  addAlert: (alert: any) => void;
  acknowledgeAlert: (alertId: string) => void;
  updateSystemStatus: (updates: Partial<GameStateHook["systemStatus"]>) => void;
  setGameMode: (mode: GameStateHook["gameMode"]) => void;
  addMagastructer: (magastructer: any) => void;
  upgradeMagastructer: (index: number) => void;
  activateMagastructerStealth: (index: number) => void;
  researchMagastructerTech: (index: number, tech: string) => void;
}

// Create the context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export function GameProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<GamePlayer | null>(null);
  const {
    gameState,
    initializePlayer,
    acceptMission,
    updateObjectiveProgress,
    addAlert,
    acknowledgeAlert,
    updateSystemStatus,
    setGameMode,
    addMagastructer,
    upgradeMagastructer,
    activateMagastructerStealth,
    researchMagastructerTech,
  } = useGameState();

  const [game, setGame] = useState<GameStateHook>(gameState);

  // Sync player from gameState
  if (gameState.player && gameState.player !== player) {
    setPlayer(gameState.player);
  }

  // Sync game state
  if (gameState !== game) {
    setGame(gameState);
  }

  return (
    <GameContext.Provider
      value={{
        player,
        setPlayer,
        game,
        setGame,
        gameState,
        initializePlayer,
        acceptMission,
        updateObjectiveProgress,
        addAlert,
        acknowledgeAlert,
        updateSystemStatus,
        setGameMode,
        addMagastructer,
        upgradeMagastructer,
        activateMagastructerStealth,
        researchMagastructerTech,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

// Hook to use the game context
export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
}
