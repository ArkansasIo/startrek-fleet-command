import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Progress } from "../ui/progress";
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Music,
  Radio,
  Headphones,
  Speaker,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
} from "lucide-react";
import {
  useStarTrekAudio,
  STAR_TREK_AUDIO_TRACKS,
  StarTrekAudioControls,
} from "../audio/StarTrekAudioSystem";

interface StarTrekAudioMenuProps {
  activeSubmenu?: string;
}

interface AudioTrack {
  id: string;
  name: string;
  file: string;
  duration: number;
  composer?: string;
  description?: string;
  category: string;
}

export default function StarTrekAudioMenu({
  activeSubmenu,
}: StarTrekAudioMenuProps) {
  const normalizeSubmenu = (submenu?: string) => {
    const allowed = new Set(["library", "player", "playlist", "settings"]);
    return submenu && allowed.has(submenu) ? submenu : "library";
  };

  const [activeTab, setActiveTab] = useState(normalizeSubmenu(activeSubmenu));
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [playlist, setPlaylist] = useState<AudioTrack[]>([]);
  const [isShuffleMode, setIsShuffleMode] = useState(false);
  const [isRepeatMode, setIsRepeatMode] = useState(false);

  useEffect(() => {
    setActiveTab(normalizeSubmenu(activeSubmenu));
  }, [activeSubmenu]);

  const {
    playTrack,
    stopAllAudio,
    isGlobalMuted,
    globalVolume,
    setGlobalVolume,
    setGlobalMuted,
  } = useStarTrekAudio();

  // Convert audio tracks to unified format
  const getAllTracks = (): AudioTrack[] => {
    const tracks: AudioTrack[] = [];

    Object.entries(STAR_TREK_AUDIO_TRACKS.themes).forEach(([id, track]) => {
      tracks.push({
        id,
        name: track.name,
        file: track.file,
        duration: track.duration,
        composer: track.composer,
        category: "themes",
      });
    });

    Object.entries(STAR_TREK_AUDIO_TRACKS.movies).forEach(([id, track]) => {
      tracks.push({
        id,
        name: track.name,
        file: track.file,
        duration: track.duration,
        composer: track.composer,
        category: "movies",
      });
    });

    Object.entries(STAR_TREK_AUDIO_TRACKS.custom).forEach(([id, track]) => {
      tracks.push({
        id,
        name: track.name,
        file: track.file,
        duration: track.duration,
        composer: track.composer,
        description: track.description,
        category: "custom",
      });
    });

    Object.entries(STAR_TREK_AUDIO_TRACKS.effects).forEach(([id, track]) => {
      tracks.push({
        id,
        name: track.name,
        file: track.file,
        duration: track.duration,
        category: "effects",
      });
    });

    return tracks;
  };

  const allTracks = getAllTracks();

  const filteredTracks = allTracks.filter((track) => {
    const matchesSearch =
      track.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (track.composer &&
        track.composer.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === "all" || track.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePlayTrack = (track: AudioTrack) => {
    playTrack(track.id, track.category as keyof typeof STAR_TREK_AUDIO_TRACKS);
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleStopAll = () => {
    stopAllAudio();
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  const addToPlaylist = (track: AudioTrack) => {
    if (
      !playlist.find((t) => t.id === track.id && t.category === track.category)
    ) {
      setPlaylist([...playlist, track]);
    }
  };

  const removeFromPlaylist = (trackId: string, category: string) => {
    setPlaylist(
      playlist.filter((t) => !(t.id === trackId && t.category === category)),
    );
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "themes":
        return <Music className="w-4 h-4" />;
      case "movies":
        return <Radio className="w-4 h-4" />;
      case "custom":
        return <Speaker className="w-4 h-4" />;
      case "effects":
        return <Headphones className="w-4 h-4" />;
      default:
        return <Music className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "themes":
        return "text-blue-400";
      case "movies":
        return "text-purple-400";
      case "custom":
        return "text-gold-400";
      case "effects":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-blue-400">
          STAR TREK AUDIO LIBRARY
        </h1>
        <p className="text-xl text-gray-300">
          Music, Themes & Sound Effects from the Final Frontier
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="library">Audio Library</TabsTrigger>
          <TabsTrigger value="player">Audio Player</TabsTrigger>
          <TabsTrigger value="playlist">Playlist</TabsTrigger>
          <TabsTrigger value="settings">Audio Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search tracks, composers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800/50 border-blue-500/30"
            />
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="themes">TV Themes</SelectItem>
                <SelectItem value="movies">Movie Soundtracks</SelectItem>
                <SelectItem value="custom">Original Compositions</SelectItem>
                <SelectItem value="effects">Sound Effects</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-blue-400">
                {filteredTracks.length} tracks
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTracks.map((track) => (
              <Card
                key={`${track.category}-${track.id}`}
                className="bg-gray-800/30 border-blue-500/30 hover:border-blue-400/50 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-blue-400">
                        {track.name}
                      </CardTitle>
                      {track.composer && (
                        <p className="text-sm text-gray-400 mt-1">
                          by {track.composer}
                        </p>
                      )}
                    </div>
                    <div className={`${getCategoryColor(track.category)}`}>
                      {getCategoryIcon(track.category)}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs capitalize">
                      {track.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {formatDuration(track.duration)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {track.description && (
                    <p className="text-sm text-gray-300">{track.description}</p>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handlePlayTrack(track)}
                      className="flex-1"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Play
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addToPlaylist(track)}
                    >
                      +
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="player" className="space-y-4">
          <Card className="bg-gray-800/30 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center">
                <Music className="w-5 h-5 mr-2" />
                Now Playing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentTrack ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-blue-400">
                      {currentTrack.name}
                    </h3>
                    {currentTrack.composer && (
                      <p className="text-lg text-gray-300 mt-2">
                        by {currentTrack.composer}
                      </p>
                    )}
                    <Badge variant="outline" className="mt-2 capitalize">
                      {currentTrack.category}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>0:00</span>
                      <span>{formatDuration(currentTrack.duration)}</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>

                  <div className="flex justify-center items-center space-x-4">
                    <Button size="sm" variant="outline">
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    <Button size="lg" onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </Button>
                    <Button size="sm" variant="outline">
                      <SkipForward className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleStopAll}>
                      <Square className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button
                      size="sm"
                      variant={isShuffleMode ? "default" : "outline"}
                      onClick={() => setIsShuffleMode(!isShuffleMode)}
                    >
                      <Shuffle className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={isRepeatMode ? "default" : "outline"}
                      onClick={() => setIsRepeatMode(!isRepeatMode)}
                    >
                      <Repeat className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Music className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                  <p className="text-gray-400">
                    No track selected. Choose a track from the library to start
                    playing.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playlist" className="space-y-4">
          <Card className="bg-gray-800/30 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center justify-between">
                <div className="flex items-center">
                  <Radio className="w-5 h-5 mr-2" />
                  Playlist
                </div>
                <Badge variant="outline">{playlist.length} tracks</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {playlist.length === 0 ? (
                <div className="text-center py-8">
                  <Radio className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                  <p className="text-gray-400">
                    Your playlist is empty. Add tracks from the library.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {playlist.map((track, index) => (
                    <div
                      key={`${track.category}-${track.id}-${index}`}
                      className="flex items-center justify-between p-3 bg-gray-900/50 rounded border border-blue-500/30"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-blue-400">
                          {track.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {track.composer} • {formatDuration(track.duration)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePlayTrack(track)}
                        >
                          <Play className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            removeFromPlaylist(track.id, track.category)
                          }
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400">Audio Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Master Volume</Label>
                  <div className="flex items-center space-x-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setGlobalMuted(!isGlobalMuted)}
                    >
                      {isGlobalMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>
                    <Slider
                      value={[globalVolume]}
                      onValueChange={(value) => setGlobalVolume(value[0])}
                      max={1}
                      step={0.1}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-400 w-8">
                      {Math.round(globalVolume * 100)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-400">
                    Playback Settings
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Crossfade</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Auto-play Next</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Show Notifications</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400">
                  Audio Library Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>TV Themes:</span>
                    <span className="text-blue-400">
                      {Object.keys(STAR_TREK_AUDIO_TRACKS.themes).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Movie Tracks:</span>
                    <span className="text-purple-400">
                      {Object.keys(STAR_TREK_AUDIO_TRACKS.movies).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Original Compositions:</span>
                    <span className="text-gold-400">
                      {Object.keys(STAR_TREK_AUDIO_TRACKS.custom).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sound Effects:</span>
                    <span className="text-green-400">
                      {Object.keys(STAR_TREK_AUDIO_TRACKS.effects).length}
                    </span>
                  </div>
                  <div className="border-t border-trek-accent pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total Tracks:</span>
                      <span className="text-blue-400">{allTracks.length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800/30 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400">
                Global Audio Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <StarTrekAudioControls />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
