import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  Map,
  Zap,
  Home,
  Smile,
  AlertTriangle,
  Star,
  Moon,
  MapPin,
  TrendingUp,
  Users,
  Award,
  Heart,
} from "lucide-react";
import UniverseGenerator, {
  Galaxy,
  SolarSystem,
  Planet,
  Moon as MoonType,
  Asteroid,
  SpaceStation,
  Star as StarType,
  NPC,
  DetailedBiome,
} from "../../../shared/UniverseGenerator";

interface UniverseExplorerProps {
  activeSubmenu?: string;
}

type ExplorationLevel = "galaxies" | "systems" | "planets" | "details";

interface ExplorationState {
  level: ExplorationLevel;
  galaxyIndex: number;
  systemIndex: number;
  planetIndex: number;
  selectedGalaxy: Galaxy | null;
  selectedSystem: SolarSystem | null;
  selectedPlanet: Planet | null;
  selectedMoon: MoonType | null;
}

export function ProcGenUniverse({ activeSubmenu }: UniverseExplorerProps) {
  const [seed, setSeed] = useState<string>("42");
  const [inputSeed, setInputSeed] = useState<string>("42");
  const [exploration, setExploration] = useState<ExplorationState>({
    level: "galaxies",
    galaxyIndex: 0,
    systemIndex: 0,
    planetIndex: 0,
    selectedGalaxy: null,
    selectedSystem: null,
    selectedPlanet: null,
    selectedMoon: null,
  });

  const generator = useMemo(() => new UniverseGenerator(parseInt(seed)), [seed]);

  // Generate galaxies
  const galaxies = useMemo(() => {
    const gens = [];
    for (let i = 0; i < 5; i++) {
      gens.push(generator.generateGalaxy(i));
    }
    return gens;
  }, [generator]);

  // Generate systems for selected galaxy
  const systems = useMemo(() => {
    if (!exploration.selectedGalaxy) return [];
    const syss = [];
    for (let i = 0; i < 10; i++) {
      syss.push(generator.generateSolarSystem(exploration.galaxyIndex, i));
    }
    return syss;
  }, [generator, exploration.galaxyIndex, exploration.selectedGalaxy]);

  const handleSeedChange = () => {
    setSeed(inputSeed);
    setExploration({
      level: "galaxies",
      galaxyIndex: 0,
      systemIndex: 0,
      planetIndex: 0,
      selectedGalaxy: null,
      selectedSystem: null,
      selectedPlanet: null,
      selectedMoon: null,
    });
  };

  const handleSelectGalaxy = (galaxy: Galaxy, index: number) => {
    setExploration({
      ...exploration,
      level: "systems",
      galaxyIndex: index,
      selectedGalaxy: galaxy,
    });
  };

  const handleSelectSystem = (system: SolarSystem) => {
    setExploration({
      ...exploration,
      level: "planets",
      selectedSystem: system,
    });
  };

  const handleSelectPlanet = (planet: Planet) => {
    setExploration({
      ...exploration,
      level: "details",
      selectedPlanet: planet,
    });
  };

  const handleBack = () => {
    if (exploration.level === "systems") {
      setExploration({
        ...exploration,
        level: "galaxies",
        selectedGalaxy: null,
      });
    } else if (exploration.level === "planets") {
      setExploration({
        ...exploration,
        level: "systems",
        selectedSystem: null,
      });
    } else if (exploration.level === "details") {
      setExploration({
        ...exploration,
        level: "planets",
        selectedPlanet: null,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Seed Control */}
      <Card className="bg-trek-panel border-trek-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-trek-gold">
            <Search className="w-5 h-5" />
            Universe Seed Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-sm text-trek-text/70 mb-2">Seed Value (any integer)</label>
              <input
                type="number"
                value={inputSeed}
                onChange={(e) => setInputSeed(e.target.value)}
                className="w-full bg-trek-dark border border-trek-blue/50 rounded px-3 py-2 text-trek-text focus:outline-none focus:border-trek-blue"
                placeholder="Enter seed..."
              />
            </div>
            <Button
              onClick={handleSeedChange}
              className="bg-trek-blue hover:bg-trek-blue/80 text-white font-bold"
            >
              Generate Universe
            </Button>
          </div>
          <p className="text-xs text-trek-text/50 mt-2">
            Same seed = Same universe. Try different numbers to explore new universes!
          </p>
        </CardContent>
      </Card>

      {/* Breadcrumb Navigation */}
      <div className="text-sm text-trek-text/70 bg-trek-dark/50 p-3 rounded border border-trek-blue/30">
        <span className="text-trek-gold">Current Location: </span>
        {exploration.level === "galaxies" && "Galaxy Browser"}
        {exploration.level === "systems" && `${exploration.selectedGalaxy?.name} > System Browser`}
        {exploration.level === "planets" && `${exploration.selectedSystem?.name} > Planet Browser`}
        {exploration.level === "details" && `${exploration.selectedPlanet?.name} > Details`}
        {exploration.level !== "galaxies" && (
          <Button
            onClick={handleBack}
            className="ml-4 text-xs bg-trek-blue/30 hover:bg-trek-blue/50 px-2 py-1 rounded"
          >
            ← Back
          </Button>
        )}
      </div>

      {/* Galaxy Browser */}
      {exploration.level === "galaxies" && (
        <div className="space-y-4">
          <h3 className="text-trek-gold font-bold flex items-center gap-2">
            <Map className="w-5 h-5" />
            Galaxies ({galaxies.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {galaxies.map((galaxy, idx) => (
              <Card
                key={galaxy.id}
                className="bg-trek-dark/50 border-trek-blue/30 hover:border-trek-blue cursor-pointer transition"
                onClick={() => handleSelectGalaxy(galaxy, idx)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-trek-gold font-bold">{galaxy.name}</h4>
                      <p className="text-xs text-trek-text/60">{galaxy.classification}</p>
                    </div>
                    <Map className="w-5 h-5 text-trek-blue" />
                  </div>
                  <div className="space-y-1 text-sm text-trek-text">
                    <div className="flex justify-between">
                      <span>Systems:</span>
                      <span className="text-trek-gold">{galaxy.systemCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stars:</span>
                      <span className="text-trek-gold">{(galaxy.stars / 1000000).toFixed(0)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Diameter:</span>
                      <span className="text-trek-gold">{galaxy.diameter.toLocaleString()} ly</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Age:</span>
                      <span className="text-trek-gold">{galaxy.age.toFixed(1)}B years</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* System Browser */}
      {exploration.level === "systems" && (
        <div className="space-y-4">
          <h3 className="text-trek-gold font-bold flex items-center gap-2">
            <Star className="w-5 h-5" />
            Systems in {exploration.selectedGalaxy?.name} (10)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systems.map((system, idx) => (
              <Card
                key={system.id}
                className="bg-trek-dark/50 border-trek-blue/30 hover:border-trek-blue cursor-pointer transition"
                onClick={() => handleSelectSystem(system)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-trek-gold font-bold">{system.name}</h4>
                      <p className="text-xs text-trek-text/60">{system.economyType} Economy</p>
                    </div>
                    <Star className="w-5 h-5 text-trek-blue" />
                  </div>
                  <div className="space-y-1 text-sm text-trek-text">
                    <div className="flex justify-between">
                      <span>Stars:</span>
                      <span className="text-trek-gold">{system.stars.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Planets:</span>
                      <span className="text-trek-gold">{system.planets.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Asteroids:</span>
                      <span className="text-trek-gold">{system.asteroids.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stations:</span>
                      <span className="text-trek-gold">{system.spaceStations.length}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-trek-blue/20">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                        Conflict:
                      </span>
                      <span className="text-trek-gold">{system.conflictLevel}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Planet Browser */}
      {exploration.level === "planets" && exploration.selectedSystem && (
        <div className="space-y-4">
          <h3 className="text-trek-gold font-bold flex items-center gap-2">
            <Home className="w-5 h-5" />
            Planets in {exploration.selectedSystem.name} ({exploration.selectedSystem.planets.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exploration.selectedSystem.planets.map((planet) => (
              <Card
                key={planet.id}
                className="bg-trek-dark/50 border-trek-blue/30 hover:border-trek-blue cursor-pointer transition"
                onClick={() => handleSelectPlanet(planet)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-trek-gold font-bold">{planet.name}</h4>
                      <p className="text-xs text-trek-text/60">{planet.classification}</p>
                    </div>
                    <Home className="w-5 h-5 text-trek-blue" />
                  </div>
                  <div className="space-y-1 text-sm text-trek-text">
                    <div className="flex justify-between">
                      <span>Radius:</span>
                      <span className="text-trek-gold">{(planet.radius / 1000).toFixed(0)}k km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gravity:</span>
                      <span className="text-trek-gold">{planet.gravity.toFixed(2)}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Temperature:</span>
                      <span className="text-trek-gold">{planet.temperature}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Water:</span>
                      <span className="text-trek-gold">{planet.waterPercentage}%</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-trek-blue/20">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                        Hazard:
                      </span>
                      <span className="text-trek-gold">{planet.hazardLevel}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Planet Details */}
      {exploration.level === "details" && exploration.selectedPlanet && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Basic Info */}
            <Card className="bg-trek-panel border-trek-accent md:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-trek-gold">
                  <Home className="w-5 h-5" />
                  {exploration.selectedPlanet.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="bg-trek-dark/50 p-3 rounded border border-trek-blue/30">
                    <div className="text-trek-text/70 text-xs">Classification</div>
                    <div className="text-trek-gold font-bold">{exploration.selectedPlanet.classification}</div>
                  </div>
                  <div className="bg-trek-dark/50 p-3 rounded border border-trek-blue/30">
                    <div className="text-trek-text/70 text-xs">Radius</div>
                    <div className="text-trek-gold font-bold">{(exploration.selectedPlanet.radius / 1000).toFixed(1)}k km</div>
                  </div>
                  <div className="bg-trek-dark/50 p-3 rounded border border-trek-blue/30">
                    <div className="text-trek-text/70 text-xs">Mass</div>
                    <div className="text-trek-gold font-bold">{exploration.selectedPlanet.mass.toFixed(2)} E</div>
                  </div>
                  <div className="bg-trek-dark/50 p-3 rounded border border-trek-blue/30">
                    <div className="text-trek-text/70 text-xs">Gravity</div>
                    <div className="text-trek-gold font-bold">{exploration.selectedPlanet.gravity.toFixed(2)}g</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Atmosphere */}
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold text-sm">Atmosphere</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="text-trek-text/70">Type:</span>
                  <span className="text-trek-gold ml-2">{exploration.selectedPlanet.atmosphere.type}</span>
                </div>
                <div className="text-sm">
                  <span className="text-trek-text/70">Density:</span>
                  <div className="w-full bg-trek-dark rounded h-2 mt-1">
                    <div
                      className="bg-trek-blue h-2 rounded"
                      style={{ width: `${exploration.selectedPlanet.atmosphere.density}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-trek-text/70">Toxicity:</span>
                  <div className="w-full bg-trek-dark rounded h-2 mt-1">
                    <div
                      className="bg-red-500 h-2 rounded"
                      style={{ width: `${exploration.selectedPlanet.atmosphere.toxicity}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-trek-text/70">Wind:</span>
                  <div className="w-full bg-trek-dark rounded h-2 mt-1">
                    <div
                      className="bg-trek-green h-2 rounded"
                      style={{ width: `${exploration.selectedPlanet.atmosphere.windStrength}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Climate */}
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold text-sm">Climate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="text-trek-text/70">Temperature:</span>
                  <span className="text-trek-gold ml-2">{exploration.selectedPlanet.temperature}°C</span>
                </div>
                <div className="text-sm">
                  <span className="text-trek-text/70">Day Length:</span>
                  <span className="text-trek-gold ml-2">{exploration.selectedPlanet.dayLength}h</span>
                </div>
                <div className="text-sm">
                  <span className="text-trek-text/70">Year Length:</span>
                  <span className="text-trek-gold ml-2">{exploration.selectedPlanet.yearLength} days</span>
                </div>
                <div className="text-sm">
                  <span className="text-trek-text/70">Water Coverage:</span>
                  <span className="text-trek-gold ml-2">{exploration.selectedPlanet.waterPercentage}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Hazards */}
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Hazards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="text-trek-text/70">Hazard Level:</span>
                  <div className="w-full bg-trek-dark rounded h-2 mt-1">
                    <div
                      className={`h-2 rounded ${
                        exploration.selectedPlanet.hazardLevel > 70
                          ? "bg-red-500"
                          : exploration.selectedPlanet.hazardLevel > 40
                            ? "bg-yellow-500"
                            : "bg-trek-green"
                      }`}
                      style={{ width: `${exploration.selectedPlanet.hazardLevel}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-trek-text/50 mt-1">
                    {exploration.selectedPlanet.hazardLevel > 70
                      ? "EXTREME"
                      : exploration.selectedPlanet.hazardLevel > 40
                        ? "MODERATE"
                        : "LOW"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Biomes */}
          {exploration.selectedPlanet.biomes.length > 0 && (
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold text-sm">Biomes ({exploration.selectedPlanet.biomes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exploration.selectedPlanet.biomes.map((biome, idx) => (
                    <div key={idx} className="bg-trek-dark/50 p-3 rounded border border-trek-blue/30">
                      <h5 className="text-trek-gold font-bold mb-2">{biome.name}</h5>
                      <p className="text-xs text-trek-text/70 mb-2">Terrain: {biome.terrainType}</p>
                      <div className="text-xs space-y-1">
                        <div>
                          <span className="text-trek-text/70">Flora:</span>
                          <span className="text-trek-green ml-2">{biome.flora.join(", ")}</span>
                        </div>
                        <div>
                          <span className="text-trek-text/70">Fauna:</span>
                          <span className="text-trek-green ml-2">{biome.fauna.join(", ")}</span>
                        </div>
                        {biome.hazards[0] !== "None" && (
                          <div>
                            <span className="text-trek-text/70">Hazards:</span>
                            <span className="text-red-500 ml-2">{biome.hazards.join(", ")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resources */}
          {exploration.selectedPlanet.resources.length > 0 && (
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Resources ({exploration.selectedPlanet.resources.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exploration.selectedPlanet.resources.map((resource, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-trek-text">{resource.name}</span>
                        <span className="text-trek-gold">{resource.abundance}%</span>
                      </div>
                      <div className="w-full bg-trek-dark rounded h-2">
                        <div
                          className="bg-trek-gold h-2 rounded"
                          style={{ width: `${resource.abundance}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Moons */}
          {exploration.selectedSystem &&
            exploration.selectedSystem.moons.filter((m) => m.parentPlanet === exploration.selectedPlanet?.id).length > 0 && (
              <Card className="bg-trek-panel border-trek-accent">
                <CardHeader>
                  <CardTitle className="text-trek-gold text-sm flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    Moons (
                    {exploration.selectedSystem.moons.filter((m) => m.parentPlanet === exploration.selectedPlanet?.id)
                      .length}
                    )
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {exploration.selectedSystem.moons
                      .filter((m) => m.parentPlanet === exploration.selectedPlanet?.id)
                      .map((moon) => (
                        <div key={moon.id} className="bg-trek-dark/50 p-3 rounded border border-trek-blue/30">
                          <h5 className="text-trek-gold font-bold mb-1">{moon.name}</h5>
                          <div className="text-xs space-y-1 text-trek-text/70">
                            <div>Classification: {moon.classification}</div>
                            <div>Radius: {(moon.radius / 1000).toFixed(1)}k km</div>
                            <div>Orbit: {moon.orbitPeriod} days</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* NPCs & Inhabitants */}
          {exploration.selectedPlanet && (
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Inhabitants & NPCs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, idx) => {
                    const npc = useMemo(() => {
                      const genForNPC = new UniverseGenerator(
                        parseInt(exploration.selectedPlanet?.seed.toString().substring(0, 10) || "42") + idx
                      );
                      return genForNPC.generateNPC(exploration.selectedPlanet?.seed || 42, idx);
                    }, [exploration.selectedPlanet?.id, idx]);

                    return (
                      <div key={idx} className="bg-trek-dark/50 p-4 rounded border border-trek-blue/30">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="text-trek-gold font-bold">{npc.name}</h5>
                            <p className="text-xs text-trek-text/70">
                              {npc.race} • {npc.class} • Level {npc.level}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded font-bold ${
                              npc.attitude === "friendly"
                                ? "bg-trek-green/20 text-trek-green"
                                : npc.attitude === "hostile"
                                  ? "bg-red-500/20 text-red-500"
                                  : "bg-trek-blue/20 text-trek-blue"
                            }`}
                          >
                            {npc.attitude.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs space-y-1 text-trek-text/70">
                          <div>Faction: {npc.faction.name}</div>
                          <div>Profession: {npc.profession}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <Award className="w-3 h-3" />
                            <span>Reputation: {npc.reputation > 0 ? "+" : ""}{npc.reputation}</span>
                          </div>
                          {npc.goods && (
                            <div className="flex items-center gap-2 mt-1">
                              <span>Goods: {npc.goods.join(", ")}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Space Stations Display */}
      {exploration.selectedSystem && exploration.selectedSystem.spaceStations.length > 0 && (
        <Card className="bg-trek-panel border-trek-accent">
          <CardHeader>
            <CardTitle className="text-trek-gold text-sm">Space Stations in {exploration.selectedSystem.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exploration.selectedSystem.spaceStations.map((station) => (
                <div key={station.id} className="bg-trek-dark/50 p-4 rounded border border-trek-blue/30">
                  <h5 className="text-trek-gold font-bold mb-2">{station.name}</h5>
                  <div className="text-xs space-y-1 text-trek-text/70">
                    <div>
                      Faction: <span className="text-trek-blue">{station.faction}</span>
                    </div>
                    <div>
                      Level: <span className="text-trek-gold">{station.level}/5</span>
                    </div>
                    <div>
                      Population: <span className="text-trek-gold">{station.population.toLocaleString()}</span>
                    </div>
                    <div>
                      Trading Posts: <span className="text-trek-gold">{station.tradingPosts}</span>
                    </div>
                    {station.facilities.length > 0 && (
                      <div>
                        <div>Facilities:</div>
                        <div className="text-trek-green ml-2">{station.facilities.join(", ")}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ProcGenUniverse;
