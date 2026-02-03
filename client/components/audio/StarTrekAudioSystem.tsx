import { useState, useEffect, useRef, createContext, useContext } from "react";

// Audio tracks database
export const STAR_TREK_AUDIO_TRACKS = {
  // Theme Songs from Shows
  themes: {
    tos_theme: {
      name: "The Original Series Theme",
      file: "/audio/themes/tos_theme.mp3",
      duration: 60,
      composer: "Alexander Courage",
    },
    tng_theme: {
      name: "The Next Generation Theme",
      file: "/audio/themes/tng_theme.mp3",
      duration: 90,
      composer: "Jerry Goldsmith & Dennis McCarthy",
    },
    ds9_theme: {
      name: "Deep Space Nine Theme",
      file: "/audio/themes/ds9_theme.mp3",
      duration: 75,
      composer: "Dennis McCarthy",
    },
    voy_theme: {
      name: "Voyager Theme",
      file: "/audio/themes/voy_theme.mp3",
      duration: 85,
      composer: "Jerry Goldsmith",
    },
    ent_theme: {
      name: "Enterprise Theme - Faith of the Heart",
      file: "/audio/themes/ent_theme.mp3",
      duration: 180,
      composer: "Dennis McCarthy",
    },
    discovery_theme: {
      name: "Discovery Theme",
      file: "/audio/themes/disc_theme.mp3",
      duration: 70,
      composer: "Jeff Russo",
    },
    picard_theme: {
      name: "Picard Theme",
      file: "/audio/themes/picard_theme.mp3",
      duration: 80,
      composer: "Jeff Russo",
    },
  },

  // Movie Soundtracks
  movies: {
    tmp_theme: {
      name: "The Motion Picture Theme",
      file: "/audio/movies/tmp_theme.mp3",
      duration: 240,
      composer: "Jerry Goldsmith",
    },
    wok_battle: {
      name: "Wrath of Khan - Battle",
      file: "/audio/movies/wok_battle.mp3",
      duration: 180,
      composer: "James Horner",
    },
    undiscovered_theme: {
      name: "The Undiscovered Country",
      file: "/audio/movies/undiscovered_theme.mp3",
      duration: 200,
      composer: "Cliff Eidelman",
    },
    first_contact: {
      name: "First Contact Theme",
      file: "/audio/movies/first_contact.mp3",
      duration: 190,
      composer: "Jerry Goldsmith",
    },
    nemesis_theme: {
      name: "Nemesis Theme",
      file: "/audio/movies/nemesis_theme.mp3",
      duration: 210,
      composer: "Jerry Goldsmith",
    },
    kelvin_theme: {
      name: "Kelvin Timeline Theme",
      file: "/audio/movies/kelvin_theme.mp3",
      duration: 220,
      composer: "Michael Giacchino",
    },
  },

  // Custom Prolog Theme (our creation)
  custom: {
    horizon_chronicles: {
      name: "The Horizon Chronicles - Main Theme",
      file: "/audio/custom/horizon_chronicles_theme.mp3",
      duration: 300,
      composer: "Starfleet Audio Division",
      description: "Epic orchestral theme for The Horizon Chronicles storyline",
    },
    delta_awakening: {
      name: "Delta Quadrant Awakening",
      file: "/audio/custom/delta_awakening.mp3",
      duration: 180,
      composer: "Starfleet Audio Division",
      description: "Mysterious and building theme for the Shadow Coalition",
    },
    nova_courage: {
      name: "Captain Nova's Courage",
      file: "/audio/custom/nova_courage.mp3",
      duration: 150,
      composer: "Starfleet Audio Division",
      description: "Heroic theme for Captain Elena Nova",
    },
  },

  // Sound Effects
  effects: {
    transporter: {
      name: "Transporter Effect",
      file: "/audio/effects/transporter.mp3",
      duration: 8,
    },
    phaser: {
      name: "Phaser Fire",
      file: "/audio/effects/phaser.mp3",
      duration: 3,
    },
    warp_engage: {
      name: "Warp Engage",
      file: "/audio/effects/warp_engage.mp3",
      duration: 5,
    },
    red_alert: {
      name: "Red Alert Klaxon",
      file: "/audio/effects/red_alert.mp3",
      duration: 10,
    },
    bridge_ambience: {
      name: "Bridge Ambience",
      file: "/audio/effects/bridge_ambience.mp3",
      duration: 60,
      loop: true,
    },
    computer_beeps: {
      name: "Computer Interface",
      file: "/audio/effects/computer_beeps.mp3",
      duration: 2,
    },
    door_swoosh: {
      name: "Sliding Door",
      file: "/audio/effects/door_swoosh.mp3",
      duration: 2,
    },
    communicator: {
      name: "Communicator Chirp",
      file: "/audio/effects/communicator.mp3",
      duration: 1,
    },
    ominous_tone: {
      name: "Ominous Drone",
      file: "/audio/effects/ominous_tone.mp3",
      duration: 30,
      loop: true,
    },
    dark_whispers: {
      name: "Shadow Whispers",
      file: "/audio/effects/dark_whispers.mp3",
      duration: 45,
      loop: true,
    },
    dark_power: {
      name: "Dark Power Surge",
      file: "/audio/effects/dark_power.mp3",
      duration: 15,
    },
    stellar_ambience: {
      name: "Deep Space Ambience",
      file: "/audio/effects/stellar_ambience.mp3",
      duration: 120,
      loop: true,
    },
  },
};

// Audio Context for managing global audio state
interface AudioContextType {
  isGlobalMuted: boolean;
  globalVolume: number;
  currentTrack: string | null;
  setGlobalMuted: (muted: boolean) => void;
  setGlobalVolume: (volume: number) => void;
  playTrack: (
    trackId: string,
    category: keyof typeof STAR_TREK_AUDIO_TRACKS,
  ) => void;
  stopAllAudio: () => void;
  playEffect: (effectId: string) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useStarTrekAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error(
      "useStarTrekAudio must be used within StarTrekAudioProvider",
    );
  }
  return context;
};

interface StarTrekAudioProviderProps {
  children: React.ReactNode;
}

export function StarTrekAudioProvider({
  children,
}: StarTrekAudioProviderProps) {
  const [isGlobalMuted, setIsGlobalMuted] = useState(false);
  const [globalVolume, setGlobalVolume] = useState(0.7);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const playTrack = (
    trackId: string,
    category: keyof typeof STAR_TREK_AUDIO_TRACKS,
  ) => {
    // Stop current track if playing
    if (currentTrack && audioRefs.current[currentTrack]) {
      audioRefs.current[currentTrack].pause();
    }

    const track =
      STAR_TREK_AUDIO_TRACKS[category][
        trackId as keyof (typeof STAR_TREK_AUDIO_TRACKS)[typeof category]
      ];
    if (!track) return;

    const fullTrackId = `${category}_${trackId}`;

    // Create audio element if it doesn't exist
    if (!audioRefs.current[fullTrackId]) {
      const audio = new Audio(track.file);
      audio.volume = globalVolume;
      audio.muted = isGlobalMuted;
      if ("loop" in track && track.loop) {
        audio.loop = true;
      }
      audioRefs.current[fullTrackId] = audio;
    }

    const audio = audioRefs.current[fullTrackId];
    audio.currentTime = 0;
    audio.play().catch(console.error);
    setCurrentTrack(fullTrackId);
  };

  const playEffect = (effectId: string) => {
    const effect =
      STAR_TREK_AUDIO_TRACKS.effects[
        effectId as keyof typeof STAR_TREK_AUDIO_TRACKS.effects
      ];
    if (!effect) return;

    const fullEffectId = `effect_${effectId}`;

    // Create audio element if it doesn't exist
    if (!audioRefs.current[fullEffectId]) {
      const audio = new Audio(effect.file);
      audio.volume = globalVolume * 0.8; // Effects slightly quieter
      audio.muted = isGlobalMuted;
      if ("loop" in effect && effect.loop) {
        audio.loop = true;
      }
      audioRefs.current[fullEffectId] = audio;
    }

    const audio = audioRefs.current[fullEffectId];
    audio.currentTime = 0;
    audio.play().catch(console.error);
  };

  const stopAllAudio = () => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    setCurrentTrack(null);
  };

  // Update volume and mute for all audio elements
  useEffect(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.volume = globalVolume;
      audio.muted = isGlobalMuted;
    });
  }, [globalVolume, isGlobalMuted]);

  const contextValue: AudioContextType = {
    isGlobalMuted,
    globalVolume,
    currentTrack,
    setGlobalMuted: setIsGlobalMuted,
    setGlobalVolume,
    playTrack,
    stopAllAudio,
    playEffect,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
}

// Hook for playing scene-specific audio
export function useSceneAudio() {
  const { playTrack, playEffect, stopAllAudio } = useStarTrekAudio();

  const playSceneMusic = (sceneId: string) => {
    switch (sceneId) {
      case "opening-title":
        playTrack("horizon_chronicles", "custom");
        break;
      case "nova-intro":
      case "nova-mission":
      case "nova-determination":
      case "final-call":
        playTrack("nova_courage", "custom");
        break;
      case "shadow-awakening":
      case "shadow-stirring":
      case "emperor-awakening":
        playTrack("delta_awakening", "custom");
        break;
      case "mission-brief-1":
      case "mission-brief-2":
        playTrack("tng_theme", "themes");
        break;
      case "thresh-report":
      case "vex-analysis":
        playEffect("bridge_ambience");
        break;
      case "begin-journey":
        playEffect("warp_engage");
        break;
      default:
        playEffect("stellar_ambience");
    }
  };

  const playSceneEffects = (effects: string[]) => {
    effects.forEach((effect) => {
      if (
        STAR_TREK_AUDIO_TRACKS.effects[
          effect as keyof typeof STAR_TREK_AUDIO_TRACKS.effects
        ]
      ) {
        playEffect(effect);
      }
    });
  };

  return {
    playSceneMusic,
    playSceneEffects,
    stopAllAudio,
  };
}

// Audio Control Panel Component
export function StarTrekAudioControls() {
  const {
    isGlobalMuted,
    globalVolume,
    currentTrack,
    setGlobalMuted,
    setGlobalVolume,
    stopAllAudio,
  } = useStarTrekAudio();

  return (
    <div className="flex items-center gap-2 p-2 bg-trek-panel/50 border border-trek-accent rounded">
      <button
        onClick={() => setGlobalMuted(!isGlobalMuted)}
        className="p-1 text-trek-text hover:text-trek-blue transition-colors"
        title={isGlobalMuted ? "Unmute Audio" : "Mute Audio"}
      >
        {isGlobalMuted ? "🔇" : "🔊"}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={globalVolume}
        onChange={(e) => setGlobalVolume(parseFloat(e.target.value))}
        className="w-20 accent-trek-blue"
        title="Volume"
      />

      <button
        onClick={stopAllAudio}
        className="p-1 text-trek-text hover:text-red-400 transition-colors text-xs"
        title="Stop All Audio"
      >
        ⏹️
      </button>

      {currentTrack && (
        <div className="text-xs text-trek-text/70 ml-2">
          Playing: {currentTrack.replace(/_/g, " ")}
        </div>
      )}
    </div>
  );
}
