import { useState, useEffect, useCallback } from "react";
import { Magastructer } from "../lib/Magastructers";

export interface GamePlayer {
  id: string;
  username: string;
  name: string;
  rank: string;
  division: string;
  ship: string;
  clearanceLevel: number;
  experience: number;
  level: number;
  credits: number;
  reputation: number;
  location: {
    galaxy: string;
    sector: string;
    system: string;
  };
  fleet: {
    ships: string[];
    activeShip: string;
  };
  missions: {
    active: string[];
    completed: string[];
    available: string[];
  };
  achievements: {
    unlocked: string[];
    progress: Record<string, number>;
  };
  resources: Record<string, number>;
  lastLogin: string;
  playTime: number;
}

export interface GameMission {
  id: string;
  title: string;
  description: string;
  type: "exploration" | "combat" | "diplomatic" | "research" | "trade";
  difficulty: number;
  timeLimit?: number;
  objectives: {
    id: string;
    description: string;
    completed: boolean;
    progress: number;
    target: number;
  }[];
  rewards: {
    experience: number;
    credits: number;
    reputation: number;
    items?: string[];
  };
  requirements: {
    level?: number;
    rank?: string;
    clearance?: number;
    location?: string;
  };
  status: "available" | "active" | "completed" | "failed" | "expired";
  assignedAt?: string;
  deadline?: string;
}

export interface GameAlert {
  id: string;
  type: "info" | "warning" | "critical" | "success";
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  category: "system" | "mission" | "fleet" | "diplomatic" | "security";
}

export interface GameState {
  player: GamePlayer | null;
  activeMissions: GameMission[];
  availableMissions: GameMission[];
  completedMissions: GameMission[];
  alerts: GameAlert[];
  systemStatus: {
    allSystems: "green" | "yellow" | "red";
    shields: number;
    hull: number;
    power: number;
    weapons: "online" | "offline" | "charging";
  };
  fleetStatus: {
    totalShips: number;
    activeShips: number;
    inMaintenance: number;
    onMissions: number;
  };
  magastructers: Magastructer[];
  gameMode: "story" | "sandbox" | "multiplayer" | "campaign";
  currentScene: string;
  timeAcceleration: number;
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    player: null,
    activeMissions: [],
    availableMissions: [],
    completedMissions: [],
    alerts: [],
    systemStatus: {
      allSystems: "green",
      shields: 100,
      hull: 100,
      power: 100,
      weapons: "online",
    },
    fleetStatus: {
      totalShips: 5,
      activeShips: 3,
      inMaintenance: 1,
      onMissions: 1,
    },
    magastructers: [],
    gameMode: "story",
    currentScene: "bridge",
    timeAcceleration: 1,
  });
  // Magastructer logic
  const addMagastructer = useCallback((magastructer: Magastructer) => {
    setGameState((prev) => ({
      ...prev,
      magastructers: [...prev.magastructers, magastructer],
    }));
  }, []);

  const upgradeMagastructer = useCallback((index: number) => {
    setGameState((prev) => {
      const updated = [...prev.magastructers];
      if (updated[index]) updated[index].upgrade();
      return { ...prev, magastructers: updated };
    });
  }, []);

  const activateMagastructerStealth = useCallback((index: number) => {
    setGameState((prev) => {
      const updated = [...prev.magastructers];
      if (updated[index]) updated[index].activateStealth();
      return { ...prev, magastructers: updated };
    });
  }, []);

  const researchMagastructerTech = useCallback((index: number, tech: string) => {
    setGameState((prev) => {
      const updated = [...prev.magastructers];
      if (updated[index]) {
        switch (tech) {
          case "Shield Enhancement":
            updated[index].subStats.shield += 50;
            break;
          case "Energy Optimization":
            updated[index].subStats.energyEfficiency += 20;
            break;
          case "Stealth Systems":
            updated[index].subStats.stealth += 30;
            break;
          case "Repair Automation":
            updated[index].subStats.repairRate += 15;
            break;
          case "Capacity Expansion":
            updated[index].stats.capacity += 100;
            break;
        }
      }
      return { ...prev, magastructers: updated };
    });
  }, []);

  // Initialize game state
  const initializePlayer = useCallback((officerData: any) => {
    const player: GamePlayer = {
      id: officerData.id,
      username: officerData.username,
      name: officerData.name,
      rank: officerData.rank,
      division: officerData.division,
      ship: officerData.ship,
      clearanceLevel: officerData.clearance_level,
      experience: 0,
      level: 1,
      credits: 10000,
      reputation: 100,
      location: {
        galaxy: "Milky Way",
        sector: "Sol Sector",
        system: "Sol System",
      },
      fleet: {
        ships: ["USS Enterprise NCC-1701-D", "USS Defiant NX-74205"],
        activeShip: "USS Enterprise NCC-1701-D",
      },
      missions: {
        active: [],
        completed: [],
        available: ["mission-001", "mission-002"],
      },
      achievements: {
        unlocked: ["first-login"],
        progress: {},
      },
      resources: {
        dilithium: 1000,
        latinum: 50,
        duranium: 500,
        tritanium: 750,
      },
      lastLogin: new Date().toISOString(),
      playTime: 0,
    };

    setGameState((prev) => ({ ...prev, player }));
    generateInitialMissions();
  }, []);

  // Generate missions based on player data
  const generateInitialMissions = useCallback(() => {
    const missions: GameMission[] = [
      {
        id: "mission-001",
        title: "First Contact Protocol",
        description:
          "Establish diplomatic relations with a newly discovered species in the Neutral Zone.",
        type: "diplomatic",
        difficulty: 2,
        objectives: [
          {
            id: "obj-001",
            description: "Navigate to coordinates 23.4, 15.7",
            completed: false,
            progress: 0,
            target: 1,
          },
          {
            id: "obj-002",
            description: "Establish peaceful contact",
            completed: false,
            progress: 0,
            target: 1,
          },
          {
            id: "obj-003",
            description: "Complete cultural exchange",
            completed: false,
            progress: 0,
            target: 1,
          },
        ],
        rewards: {
          experience: 500,
          credits: 2000,
          reputation: 100,
        },
        requirements: {
          level: 1,
          clearance: 3,
        },
        status: "available",
      },
      {
        id: "mission-002",
        title: "Asteroid Mining Operation",
        description:
          "Survey and establish mining operations in the Yridian Asteroid Belt.",
        type: "exploration",
        difficulty: 1,
        objectives: [
          {
            id: "obj-004",
            description: "Scan asteroid field for valuable minerals",
            completed: false,
            progress: 0,
            target: 10,
          },
          {
            id: "obj-005",
            description: "Deploy mining drones",
            completed: false,
            progress: 0,
            target: 5,
          },
        ],
        rewards: {
          experience: 300,
          credits: 1500,
          reputation: 50,
          items: ["Mining Equipment Mark I"],
        },
        requirements: {
          level: 1,
        },
        status: "available",
      },
      {
        id: "mission-003",
        title: "Borg Incursion Alert",
        description:
          "Investigate reports of Borg activity in Sector 47-Alpha. Extreme caution advised.",
        type: "combat",
        difficulty: 5,
        timeLimit: 3600, // 1 hour
        objectives: [
          {
            id: "obj-006",
            description: "Investigate anomalous readings",
            completed: false,
            progress: 0,
            target: 1,
          },
          {
            id: "obj-007",
            description: "Survive Borg encounter",
            completed: false,
            progress: 0,
            target: 1,
          },
          {
            id: "obj-008",
            description: "Rescue assimilated crew members",
            completed: false,
            progress: 0,
            target: 3,
          },
        ],
        rewards: {
          experience: 2000,
          credits: 5000,
          reputation: 300,
          items: ["Borg Technology Fragment", "Hero of the Federation Medal"],
        },
        requirements: {
          level: 5,
          clearance: 7,
        },
        status: "available",
      },
    ];

    setGameState((prev) => ({ ...prev, availableMissions: missions }));
  }, []);

  // Accept a mission
  const acceptMission = useCallback((missionId: string) => {
    setGameState((prev) => {
      const mission = prev.availableMissions.find((m) => m.id === missionId);
      if (!mission) return prev;

      const updatedMission = {
        ...mission,
        status: "active" as const,
        assignedAt: new Date().toISOString(),
        deadline: mission.timeLimit
          ? new Date(Date.now() + mission.timeLimit * 1000).toISOString()
          : undefined,
      };

      return {
        ...prev,
        activeMissions: [...prev.activeMissions, updatedMission],
        availableMissions: prev.availableMissions.filter(
          (m) => m.id !== missionId,
        ),
        player: prev.player
          ? {
              ...prev.player,
              missions: {
                ...prev.player.missions,
                active: [...prev.player.missions.active, missionId],
                available: prev.player.missions.available.filter(
                  (id) => id !== missionId,
                ),
              },
            }
          : null,
      };
    });

    addAlert({
      type: "info",
      title: "Mission Accepted",
      message: `New mission has been added to your active assignments.`,
      category: "mission",
    });
  }, []);

  // Complete mission objective
  const updateObjectiveProgress = useCallback(
    (missionId: string, objectiveId: string, progress: number) => {
      setGameState((prev) => {
        const activeMissions = prev.activeMissions.map((mission) => {
          if (mission.id !== missionId) return mission;

          const objectives = mission.objectives.map((obj) => {
            if (obj.id !== objectiveId) return obj;

            const newProgress = Math.min(progress, obj.target);
            return {
              ...obj,
              progress: newProgress,
              completed: newProgress >= obj.target,
            };
          });

          // Check if mission is complete
          const allCompleted = objectives.every((obj) => obj.completed);
          const status = allCompleted ? "completed" : mission.status;

          return { ...mission, objectives, status };
        });

        // Move completed missions
        const completedMissions = activeMissions.filter(
          (m) => m.status === "completed",
        );
        const stillActive = activeMissions.filter((m) => m.status === "active");

        // Award rewards for completed missions
        let updatedPlayer = prev.player;
        completedMissions.forEach((mission) => {
          if (
            updatedPlayer &&
            !prev.completedMissions.find((m) => m.id === mission.id)
          ) {
            updatedPlayer = {
              ...updatedPlayer,
              experience: updatedPlayer.experience + mission.rewards.experience,
              credits: updatedPlayer.credits + mission.rewards.credits,
              reputation: updatedPlayer.reputation + mission.rewards.reputation,
              missions: {
                ...updatedPlayer.missions,
                completed: [...updatedPlayer.missions.completed, mission.id],
                active: updatedPlayer.missions.active.filter(
                  (id) => id !== mission.id,
                ),
              },
            };
          }
        });

        return {
          ...prev,
          activeMissions: stillActive,
          completedMissions: [
            ...prev.completedMissions,
            ...completedMissions.filter(
              (m) => !prev.completedMissions.find((cm) => cm.id === m.id),
            ),
          ],
          player: updatedPlayer,
        };
      });
    },
    [],
  );

  // Add alert
  const addAlert = useCallback(
    (alert: Omit<GameAlert, "id" | "timestamp" | "acknowledged">) => {
      const newAlert: GameAlert = {
        ...alert,
        id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        acknowledged: false,
      };

      setGameState((prev) => ({
        ...prev,
        alerts: [newAlert, ...prev.alerts].slice(0, 50), // Keep last 50 alerts
      }));
    },
    [],
  );

  // Acknowledge alert
  const acknowledgeAlert = useCallback((alertId: string) => {
    setGameState((prev) => ({
      ...prev,
      alerts: prev.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert,
      ),
    }));
  }, []);

  // Update system status
  const updateSystemStatus = useCallback(
    (updates: Partial<GameState["systemStatus"]>) => {
      setGameState((prev) => ({
        ...prev,
        systemStatus: { ...prev.systemStatus, ...updates },
      }));
    },
    [],
  );

  // Change game mode
  const setGameMode = useCallback((mode: GameState["gameMode"]) => {
    setGameState((prev) => ({ ...prev, gameMode: mode }));
  }, []);

  // Auto-generate random events
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        // 10% chance every interval
        const events = [
          {
            type: "info" as const,
            title: "Sensor Reading",
            message: "Long-range sensors detect an unusual energy signature.",
            category: "system" as const,
          },
          {
            type: "warning" as const,
            title: "Minor System Alert",
            message:
              "Replicator efficiency down to 97%. Maintenance recommended.",
            category: "system" as const,
          },
          {
            type: "info" as const,
            title: "Diplomatic Update",
            message: "Received routine communication from Starfleet Command.",
            category: "diplomatic" as const,
          },
        ];

        addAlert(events[Math.floor(Math.random() * events.length)]);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [addAlert]);

  return {
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
  };
}
