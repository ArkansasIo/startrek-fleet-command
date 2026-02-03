# Magastructers Integration Guide

## Overview
Magastructers are advanced structures in the game with unique stats, sub stats, attributes, and features. They can be managed via the game state, interacted with in the UI, and controlled through API endpoints.

## Usage

### TypeScript
Import and use the Magastructer class:
```ts
import { Magastructer } from "../lib/Magastructers";
```

### Game State
Magastructers are part of the game state via the `useGameState` hook:
```ts
const { gameState, addMagastructer, upgradeMagastructer, activateMagastructerStealth } = useGameState();
```

### UI Component
Display and interact with Magastructers:
```tsx
<MagastructersDashboard
  magastructers={gameState.magastructers}
  onUpgrade={upgradeMagastructer}
  onActivateStealth={activateMagastructerStealth}
/>
```

### API Endpoints
- `GET /api/magastructers` - List all magastructers
- `POST /api/magastructers` - Create a new magastructer
- `POST /api/magastructers/:index/upgrade` - Upgrade magastructer
- `POST /api/magastructers/:index/stealth` - Activate stealth

## Example Magastructer
```ts
const demoMagastructer = new Magastructer(
  {
    name: "Starbase One",
    description: "Federation's primary orbital facility.",
    level: 1,
    owner: "player-001",
  },
  { power: 100, defense: 200, speed: 10, capacity: 500 },
  { shield: 150, energyEfficiency: 80, repairRate: 20, stealth: 0 },
  { rarity: "epic", faction: "Federation", location: "Earth Orbit", isActive: false },
  { canUpgrade: true, canDefend: true, canRepair: true, canStealth: true }
);
```

## Extending
Add more features, stats, and logic as needed for your game design.
