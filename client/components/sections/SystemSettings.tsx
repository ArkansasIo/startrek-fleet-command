import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Monitor,
  Volume2,
  Shield,
  Zap,
  Bell,
  Eye,
  Moon,
  Sun,
  Palette,
  Globe,
  Clock,
  Database,
  Wifi,
  Lock,
  User,
  Download,
  Upload,
  RefreshCw,
  Save,
  AlertTriangle,
  CheckCircle,
  Info,
  Wrench,
  Activity,
  BarChart3,
} from "lucide-react";

interface SystemSettings {
  display: {
    theme: "light" | "dark" | "auto" | "lcars";
    color_scheme: "blue" | "gold" | "red" | "green" | "purple" | "classic";
    font_size: number;
    animations: boolean;
    high_contrast: boolean;
    reduce_motion: boolean;
    show_grid: boolean;
    transparency: number;
  };

  audio: {
    master_volume: number;
    sound_effects: boolean;
    voice_alerts: boolean;
    background_music: boolean;
    alert_sounds: boolean;
    communication_beeps: boolean;
    tactical_alerts: boolean;
    engine_sounds: boolean;
  };

  interface: {
    auto_refresh: boolean;
    refresh_interval: number;
    show_tooltips: boolean;
    keyboard_shortcuts: boolean;
    quick_access_bar: boolean;
    status_indicators: boolean;
    breadcrumb_navigation: boolean;
    contextual_menus: boolean;
  };

  security: {
    auto_logout: boolean;
    logout_timer: number;
    require_authentication: boolean;
    two_factor_auth: boolean;
    security_level: "Low" | "Medium" | "High" | "Maximum";
    audit_logging: boolean;
    encryption_enabled: boolean;
    secure_communications: boolean;
  };

  notifications: {
    red_alerts: boolean;
    yellow_alerts: boolean;
    system_warnings: boolean;
    mission_updates: boolean;
    communication_alerts: boolean;
    tactical_alerts: boolean;
    engineering_alerts: boolean;
    medical_alerts: boolean;
    notification_sound: boolean;
    popup_duration: number;
  };

  performance: {
    auto_optimization: boolean;
    data_compression: boolean;
    cache_enabled: boolean;
    background_processing: boolean;
    power_saving: boolean;
    gpu_acceleration: boolean;
    memory_limit: number;
    cpu_priority: "Low" | "Normal" | "High";
  };

  backup: {
    auto_backup: boolean;
    backup_interval: "Hourly" | "Daily" | "Weekly" | "Monthly";
    backup_location: string;
    cloud_sync: boolean;
    version_history: number;
    compression_enabled: boolean;
  };

  advanced: {
    debug_mode: boolean;
    developer_tools: boolean;
    api_endpoint: string;
    custom_css: string;
    experimental_features: boolean;
    telemetry_enabled: boolean;
    error_reporting: boolean;
  };
}

interface SystemSettingsProps {
  activeSubmenu?: string;
}

export function SystemSettings({ activeSubmenu }: SystemSettingsProps) {
  const defaultTab = "display";
  const [activeTab, setActiveTab] = useState(activeSubmenu || defaultTab);

  useEffect(() => {
    setActiveTab(activeSubmenu || defaultTab);
  }, [activeSubmenu]);
  const [settings, setSettings] = useState<SystemSettings>({
    display: {
      theme: "dark",
      color_scheme: "blue",
      font_size: 14,
      animations: true,
      high_contrast: false,
      reduce_motion: false,
      show_grid: false,
      transparency: 85,
    },
    audio: {
      master_volume: 75,
      sound_effects: true,
      voice_alerts: true,
      background_music: false,
      alert_sounds: true,
      communication_beeps: true,
      tactical_alerts: true,
      engine_sounds: false,
    },
    interface: {
      auto_refresh: true,
      refresh_interval: 30,
      show_tooltips: true,
      keyboard_shortcuts: true,
      quick_access_bar: true,
      status_indicators: true,
      breadcrumb_navigation: true,
      contextual_menus: true,
    },
    security: {
      auto_logout: true,
      logout_timer: 30,
      require_authentication: true,
      two_factor_auth: false,
      security_level: "Medium",
      audit_logging: true,
      encryption_enabled: true,
      secure_communications: true,
    },
    notifications: {
      red_alerts: true,
      yellow_alerts: true,
      system_warnings: true,
      mission_updates: true,
      communication_alerts: true,
      tactical_alerts: true,
      engineering_alerts: true,
      medical_alerts: true,
      notification_sound: true,
      popup_duration: 5,
    },
    performance: {
      auto_optimization: true,
      data_compression: true,
      cache_enabled: true,
      background_processing: true,
      power_saving: false,
      gpu_acceleration: true,
      memory_limit: 2048,
      cpu_priority: "Normal",
    },
    backup: {
      auto_backup: true,
      backup_interval: "Daily",
      backup_location: "/backup/starfleet",
      cloud_sync: false,
      version_history: 10,
      compression_enabled: true,
    },
    advanced: {
      debug_mode: false,
      developer_tools: false,
      api_endpoint: "https://starfleet.federation/api",
      custom_css: "",
      experimental_features: false,
      telemetry_enabled: true,
      error_reporting: true,
    },
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const updateSetting = (
    category: keyof SystemSettings,
    key: string,
    value: any,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    setUnsavedChanges(true);
  };

  const saveSettings = () => {
    // In a real application, this would save to backend/localStorage
    console.log("Saving settings:", settings);
    setUnsavedChanges(false);
    // Show success notification
  };

  const resetToDefaults = () => {
    // Reset all settings to default values
    setUnsavedChanges(true);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "starfleet-settings.json";
    link.click();
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          setUnsavedChanges(true);
        } catch (error) {
          console.error("Failed to import settings:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case "light":
        return <Sun className="w-4 h-4" />;
      case "dark":
        return <Moon className="w-4 h-4" />;
      case "auto":
        return <Monitor className="w-4 h-4" />;
      case "lcars":
        return <Zap className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getSecurityIcon = (level: string) => {
    switch (level) {
      case "Low":
        return <Shield className="w-4 h-4 text-green-400" />;
      case "Medium":
        return <Shield className="w-4 h-4 text-trek-warning" />;
      case "High":
        return <Shield className="w-4 h-4 text-red-400" />;
      case "Maximum":
        return <Shield className="w-4 h-4 text-red-600" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          SYSTEM SETTINGS
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={saveSettings}
            disabled={!unsavedChanges}
            className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark font-semibold"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button
            variant="outline"
            onClick={exportSettings}
            className="border-trek-accent text-trek-text hover:bg-trek-accent"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <input
            type="file"
            id="import-settings"
            accept=".json"
            onChange={importSettings}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById("import-settings")?.click()}
            className="border-trek-accent text-trek-text hover:bg-trek-accent"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {unsavedChanges && (
        <Card className="bg-trek-warning/10 border-trek-warning p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-trek-warning" />
            <span className="text-trek-warning font-medium">
              You have unsaved changes
            </span>
            <Button
              size="sm"
              onClick={saveSettings}
              className="ml-auto bg-trek-warning hover:bg-trek-warning/80 text-trek-dark"
            >
              Save Now
            </Button>
          </div>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8 bg-trek-panel border border-trek-accent">
          <TabsTrigger
            value="display"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Display
          </TabsTrigger>
          <TabsTrigger
            value="audio"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Audio
          </TabsTrigger>
          <TabsTrigger
            value="interface"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Interface
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Alerts
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Performance
          </TabsTrigger>
          <TabsTrigger
            value="backup"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Backup
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="display" className="mt-6">
          <div className="space-y-6">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Display Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-trek-text mb-2 block">Theme</Label>
                  <Select
                    value={settings.display.theme}
                    onValueChange={(value) =>
                      updateSetting("display", "theme", value)
                    }
                  >
                    <SelectTrigger className="bg-trek-dark border-trek-accent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          Light Theme
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          Dark Theme
                        </div>
                      </SelectItem>
                      <SelectItem value="auto">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          Auto (System)
                        </div>
                      </SelectItem>
                      <SelectItem value="lcars">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          LCARS Classic
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-trek-text mb-2 block">
                    Color Scheme
                  </Label>
                  <Select
                    value={settings.display.color_scheme}
                    onValueChange={(value) =>
                      updateSetting("display", "color_scheme", value)
                    }
                  >
                    <SelectTrigger className="bg-trek-dark border-trek-accent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Starfleet Blue</SelectItem>
                      <SelectItem value="gold">Command Gold</SelectItem>
                      <SelectItem value="red">Alert Red</SelectItem>
                      <SelectItem value="green">Science Green</SelectItem>
                      <SelectItem value="purple">Temporal Purple</SelectItem>
                      <SelectItem value="classic">Classic LCARS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-trek-text mb-2 block">Font Size</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.display.font_size]}
                      onValueChange={(value) =>
                        updateSetting("display", "font_size", value[0])
                      }
                      max={24}
                      min={10}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-trek-text/70">
                      <span>10px</span>
                      <span className="text-trek-blue font-semibold">
                        {settings.display.font_size}px
                      </span>
                      <span>24px</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-trek-text mb-2 block">
                    Interface Transparency
                  </Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.display.transparency]}
                      onValueChange={(value) =>
                        updateSetting("display", "transparency", value[0])
                      }
                      max={100}
                      min={50}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-trek-text/70">
                      <span>50%</span>
                      <span className="text-trek-blue font-semibold">
                        {settings.display.transparency}%
                      </span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="animations" className="text-trek-text">
                    Enable Animations
                  </Label>
                  <Switch
                    id="animations"
                    checked={settings.display.animations}
                    onCheckedChange={(checked) =>
                      updateSetting("display", "animations", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="high-contrast" className="text-trek-text">
                    High Contrast Mode
                  </Label>
                  <Switch
                    id="high-contrast"
                    checked={settings.display.high_contrast}
                    onCheckedChange={(checked) =>
                      updateSetting("display", "high_contrast", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="reduce-motion" className="text-trek-text">
                    Reduce Motion
                  </Label>
                  <Switch
                    id="reduce-motion"
                    checked={settings.display.reduce_motion}
                    onCheckedChange={(checked) =>
                      updateSetting("display", "reduce_motion", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-grid" className="text-trek-text">
                    Show Grid Lines
                  </Label>
                  <Switch
                    id="show-grid"
                    checked={settings.display.show_grid}
                    onCheckedChange={(checked) =>
                      updateSetting("display", "show_grid", checked)
                    }
                  />
                </div>
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Display Preview
              </h3>
              <div
                className="border border-trek-accent rounded p-4 bg-trek-dark/50"
                style={{
                  fontSize: `${settings.display.font_size}px`,
                  opacity: settings.display.transparency / 100,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getThemeIcon(settings.display.theme)}
                  <span className="text-trek-gold font-semibold">
                    Sample LCARS Interface
                  </span>
                </div>
                <p className="text-trek-text">
                  This is a preview of how your interface will appear with the
                  current settings. The font size is{" "}
                  {settings.display.font_size}px and transparency is{" "}
                  {settings.display.transparency}%.
                </p>
                <div className="flex gap-2 mt-3">
                  <Badge
                    variant="outline"
                    className="border-trek-blue text-trek-blue"
                  >
                    System Status
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-trek-gold text-trek-gold"
                  >
                    All Systems
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-green-400 text-green-400"
                  >
                    Operational
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audio" className="mt-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-6">
              Audio Settings
            </h3>

            <div className="space-y-6">
              <div>
                <Label className="text-trek-text mb-2 block">
                  Master Volume
                </Label>
                <div className="space-y-2">
                  <Slider
                    value={[settings.audio.master_volume]}
                    onValueChange={(value) =>
                      updateSetting("audio", "master_volume", value[0])
                    }
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-trek-text/70">
                    <span>0%</span>
                    <span className="text-trek-blue font-semibold">
                      {settings.audio.master_volume}%
                    </span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-trek-blue" />
                    <Label htmlFor="sound-effects" className="text-trek-text">
                      Sound Effects
                    </Label>
                  </div>
                  <Switch
                    id="sound-effects"
                    checked={settings.audio.sound_effects}
                    onCheckedChange={(checked) =>
                      updateSetting("audio", "sound_effects", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-trek-warning" />
                    <Label htmlFor="voice-alerts" className="text-trek-text">
                      Voice Alerts
                    </Label>
                  </div>
                  <Switch
                    id="voice-alerts"
                    checked={settings.audio.voice_alerts}
                    onCheckedChange={(checked) =>
                      updateSetting("audio", "voice_alerts", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-trek-blue" />
                    <Label
                      htmlFor="background-music"
                      className="text-trek-text"
                    >
                      Background Music
                    </Label>
                  </div>
                  <Switch
                    id="background-music"
                    checked={settings.audio.background_music}
                    onCheckedChange={(checked) =>
                      updateSetting("audio", "background_music", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <Label htmlFor="alert-sounds" className="text-trek-text">
                      Alert Sounds
                    </Label>
                  </div>
                  <Switch
                    id="alert-sounds"
                    checked={settings.audio.alert_sounds}
                    onCheckedChange={(checked) =>
                      updateSetting("audio", "alert_sounds", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-green-400" />
                    <Label
                      htmlFor="communication-beeps"
                      className="text-trek-text"
                    >
                      Communication Beeps
                    </Label>
                  </div>
                  <Switch
                    id="communication-beeps"
                    checked={settings.audio.communication_beeps}
                    onCheckedChange={(checked) =>
                      updateSetting("audio", "communication_beeps", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-red-400" />
                    <Label htmlFor="tactical-alerts" className="text-trek-text">
                      Tactical Alerts
                    </Label>
                  </div>
                  <Switch
                    id="tactical-alerts"
                    checked={settings.audio.tactical_alerts}
                    onCheckedChange={(checked) =>
                      updateSetting("audio", "tactical_alerts", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-trek-warning" />
                    <Label htmlFor="engine-sounds" className="text-trek-text">
                      Engine Sounds
                    </Label>
                  </div>
                  <Switch
                    id="engine-sounds"
                    checked={settings.audio.engine_sounds}
                    onCheckedChange={(checked) =>
                      updateSetting("audio", "engine_sounds", checked)
                    }
                  />
                </div>
              </div>

              <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                <h4 className="font-semibold text-trek-gold mb-2">
                  Audio Test
                </h4>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                  >
                    Test Alert Sound
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-warning text-trek-warning hover:bg-trek-warning hover:text-trek-dark"
                  >
                    Test Communication Beep
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                  >
                    Test Red Alert
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="interface" className="mt-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-6">
              Interface Settings
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-trek-text mb-2 block">
                    Auto Refresh Interval (seconds)
                  </Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.interface.refresh_interval]}
                      onValueChange={(value) =>
                        updateSetting("interface", "refresh_interval", value[0])
                      }
                      max={300}
                      min={5}
                      step={5}
                      className="w-full"
                      disabled={!settings.interface.auto_refresh}
                    />
                    <div className="flex justify-between text-xs text-trek-text/70">
                      <span>5s</span>
                      <span className="text-trek-blue font-semibold">
                        {settings.interface.refresh_interval}s
                      </span>
                      <span>300s</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-trek-blue" />
                    <Label htmlFor="auto-refresh" className="text-trek-text">
                      Auto Refresh
                    </Label>
                  </div>
                  <Switch
                    id="auto-refresh"
                    checked={settings.interface.auto_refresh}
                    onCheckedChange={(checked) =>
                      updateSetting("interface", "auto_refresh", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-trek-blue" />
                    <Label htmlFor="show-tooltips" className="text-trek-text">
                      Show Tooltips
                    </Label>
                  </div>
                  <Switch
                    id="show-tooltips"
                    checked={settings.interface.show_tooltips}
                    onCheckedChange={(checked) =>
                      updateSetting("interface", "show_tooltips", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-trek-blue" />
                    <Label
                      htmlFor="keyboard-shortcuts"
                      className="text-trek-text"
                    >
                      Keyboard Shortcuts
                    </Label>
                  </div>
                  <Switch
                    id="keyboard-shortcuts"
                    checked={settings.interface.keyboard_shortcuts}
                    onCheckedChange={(checked) =>
                      updateSetting("interface", "keyboard_shortcuts", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-trek-blue" />
                    <Label
                      htmlFor="quick-access-bar"
                      className="text-trek-text"
                    >
                      Quick Access Bar
                    </Label>
                  </div>
                  <Switch
                    id="quick-access-bar"
                    checked={settings.interface.quick_access_bar}
                    onCheckedChange={(checked) =>
                      updateSetting("interface", "quick_access_bar", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-trek-blue" />
                    <Label
                      htmlFor="status-indicators"
                      className="text-trek-text"
                    >
                      Status Indicators
                    </Label>
                  </div>
                  <Switch
                    id="status-indicators"
                    checked={settings.interface.status_indicators}
                    onCheckedChange={(checked) =>
                      updateSetting("interface", "status_indicators", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-trek-blue" />
                    <Label
                      htmlFor="breadcrumb-navigation"
                      className="text-trek-text"
                    >
                      Breadcrumb Navigation
                    </Label>
                  </div>
                  <Switch
                    id="breadcrumb-navigation"
                    checked={settings.interface.breadcrumb_navigation}
                    onCheckedChange={(checked) =>
                      updateSetting(
                        "interface",
                        "breadcrumb_navigation",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-trek-blue" />
                    <Label
                      htmlFor="contextual-menus"
                      className="text-trek-text"
                    >
                      Contextual Menus
                    </Label>
                  </div>
                  <Switch
                    id="contextual-menus"
                    checked={settings.interface.contextual_menus}
                    onCheckedChange={(checked) =>
                      updateSetting("interface", "contextual_menus", checked)
                    }
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-6">
              Security Settings
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-trek-text mb-2 block">
                    Security Level
                  </Label>
                  <Select
                    value={settings.security.security_level}
                    onValueChange={(value) =>
                      updateSetting("security", "security_level", value)
                    }
                  >
                    <SelectTrigger className="bg-trek-dark border-trek-accent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">
                        <div className="flex items-center gap-2">
                          {getSecurityIcon("Low")}
                          Low Security
                        </div>
                      </SelectItem>
                      <SelectItem value="Medium">
                        <div className="flex items-center gap-2">
                          {getSecurityIcon("Medium")}
                          Medium Security
                        </div>
                      </SelectItem>
                      <SelectItem value="High">
                        <div className="flex items-center gap-2">
                          {getSecurityIcon("High")}
                          High Security
                        </div>
                      </SelectItem>
                      <SelectItem value="Maximum">
                        <div className="flex items-center gap-2">
                          {getSecurityIcon("Maximum")}
                          Maximum Security
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-trek-text mb-2 block">
                    Auto Logout Timer (minutes)
                  </Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.security.logout_timer]}
                      onValueChange={(value) =>
                        updateSetting("security", "logout_timer", value[0])
                      }
                      max={120}
                      min={5}
                      step={5}
                      className="w-full"
                      disabled={!settings.security.auto_logout}
                    />
                    <div className="flex justify-between text-xs text-trek-text/70">
                      <span>5 min</span>
                      <span className="text-trek-blue font-semibold">
                        {settings.security.logout_timer} min
                      </span>
                      <span>120 min</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-trek-warning" />
                    <Label htmlFor="auto-logout" className="text-trek-text">
                      Auto Logout
                    </Label>
                  </div>
                  <Switch
                    id="auto-logout"
                    checked={settings.security.auto_logout}
                    onCheckedChange={(checked) =>
                      updateSetting("security", "auto_logout", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-trek-blue" />
                    <Label
                      htmlFor="require-authentication"
                      className="text-trek-text"
                    >
                      Require Authentication
                    </Label>
                  </div>
                  <Switch
                    id="require-authentication"
                    checked={settings.security.require_authentication}
                    onCheckedChange={(checked) =>
                      updateSetting(
                        "security",
                        "require_authentication",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-red-400" />
                    <Label htmlFor="two-factor-auth" className="text-trek-text">
                      Two-Factor Authentication
                    </Label>
                  </div>
                  <Switch
                    id="two-factor-auth"
                    checked={settings.security.two_factor_auth}
                    onCheckedChange={(checked) =>
                      updateSetting("security", "two_factor_auth", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-trek-blue" />
                    <Label htmlFor="audit-logging" className="text-trek-text">
                      Audit Logging
                    </Label>
                  </div>
                  <Switch
                    id="audit-logging"
                    checked={settings.security.audit_logging}
                    onCheckedChange={(checked) =>
                      updateSetting("security", "audit_logging", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <Label
                      htmlFor="encryption-enabled"
                      className="text-trek-text"
                    >
                      Data Encryption
                    </Label>
                  </div>
                  <Switch
                    id="encryption-enabled"
                    checked={settings.security.encryption_enabled}
                    onCheckedChange={(checked) =>
                      updateSetting("security", "encryption_enabled", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-green-400" />
                    <Label
                      htmlFor="secure-communications"
                      className="text-trek-text"
                    >
                      Secure Communications
                    </Label>
                  </div>
                  <Switch
                    id="secure-communications"
                    checked={settings.security.secure_communications}
                    onCheckedChange={(checked) =>
                      updateSetting(
                        "security",
                        "secure_communications",
                        checked,
                      )
                    }
                  />
                </div>
              </div>

              <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                <h4 className="font-semibold text-trek-gold mb-2">
                  Security Status
                </h4>
                <div className="flex items-center gap-2">
                  {getSecurityIcon(settings.security.security_level)}
                  <span className="text-trek-text">
                    Current security level:{" "}
                    <span className="text-trek-blue font-semibold">
                      {settings.security.security_level}
                    </span>
                  </span>
                  {settings.security.security_level === "Maximum" && (
                    <Badge
                      variant="outline"
                      className="border-red-500 text-red-400 ml-auto"
                    >
                      Classified Access
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-6">
              Alert & Notification Settings
            </h3>

            <div className="space-y-6">
              <div>
                <Label className="text-trek-text mb-2 block">
                  Notification Popup Duration (seconds)
                </Label>
                <div className="space-y-2">
                  <Slider
                    value={[settings.notifications.popup_duration]}
                    onValueChange={(value) =>
                      updateSetting("notifications", "popup_duration", value[0])
                    }
                    max={30}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-trek-text/70">
                    <span>1s</span>
                    <span className="text-trek-blue font-semibold">
                      {settings.notifications.popup_duration}s
                    </span>
                    <span>30s</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <Label htmlFor="red-alerts" className="text-trek-text">
                      Red Alerts
                    </Label>
                  </div>
                  <Switch
                    id="red-alerts"
                    checked={settings.notifications.red_alerts}
                    onCheckedChange={(checked) =>
                      updateSetting("notifications", "red_alerts", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-trek-warning" />
                    <Label htmlFor="yellow-alerts" className="text-trek-text">
                      Yellow Alerts
                    </Label>
                  </div>
                  <Switch
                    id="yellow-alerts"
                    checked={settings.notifications.yellow_alerts}
                    onCheckedChange={(checked) =>
                      updateSetting("notifications", "yellow_alerts", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-trek-blue" />
                    <Label htmlFor="system-warnings" className="text-trek-text">
                      System Warnings
                    </Label>
                  </div>
                  <Switch
                    id="system-warnings"
                    checked={settings.notifications.system_warnings}
                    onCheckedChange={(checked) =>
                      updateSetting("notifications", "system_warnings", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-trek-gold" />
                    <Label htmlFor="mission-updates" className="text-trek-text">
                      Mission Updates
                    </Label>
                  </div>
                  <Switch
                    id="mission-updates"
                    checked={settings.notifications.mission_updates}
                    onCheckedChange={(checked) =>
                      updateSetting("notifications", "mission_updates", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-green-400" />
                    <Label
                      htmlFor="communication-alerts"
                      className="text-trek-text"
                    >
                      Communication Alerts
                    </Label>
                  </div>
                  <Switch
                    id="communication-alerts"
                    checked={settings.notifications.communication_alerts}
                    onCheckedChange={(checked) =>
                      updateSetting(
                        "notifications",
                        "communication_alerts",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-red-400" />
                    <Label htmlFor="tactical-alerts" className="text-trek-text">
                      Tactical Alerts
                    </Label>
                  </div>
                  <Switch
                    id="tactical-alerts"
                    checked={settings.notifications.tactical_alerts}
                    onCheckedChange={(checked) =>
                      updateSetting("notifications", "tactical_alerts", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-trek-warning" />
                    <Label
                      htmlFor="engineering-alerts"
                      className="text-trek-text"
                    >
                      Engineering Alerts
                    </Label>
                  </div>
                  <Switch
                    id="engineering-alerts"
                    checked={settings.notifications.engineering_alerts}
                    onCheckedChange={(checked) =>
                      updateSetting(
                        "notifications",
                        "engineering_alerts",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-green-400" />
                    <Label htmlFor="medical-alerts" className="text-trek-text">
                      Medical Alerts
                    </Label>
                  </div>
                  <Switch
                    id="medical-alerts"
                    checked={settings.notifications.medical_alerts}
                    onCheckedChange={(checked) =>
                      updateSetting("notifications", "medical_alerts", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-trek-blue" />
                    <Label
                      htmlFor="notification-sound"
                      className="text-trek-text"
                    >
                      Notification Sounds
                    </Label>
                  </div>
                  <Switch
                    id="notification-sound"
                    checked={settings.notifications.notification_sound}
                    onCheckedChange={(checked) =>
                      updateSetting(
                        "notifications",
                        "notification_sound",
                        checked,
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-6">
              Performance Settings
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-trek-text mb-2 block">
                    Memory Limit (MB)
                  </Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.performance.memory_limit]}
                      onValueChange={(value) =>
                        updateSetting("performance", "memory_limit", value[0])
                      }
                      max={8192}
                      min={512}
                      step={256}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-trek-text/70">
                      <span>512 MB</span>
                      <span className="text-trek-blue font-semibold">
                        {settings.performance.memory_limit} MB
                      </span>
                      <span>8192 MB</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-trek-text mb-2 block">
                    CPU Priority
                  </Label>
                  <Select
                    value={settings.performance.cpu_priority}
                    onValueChange={(value) =>
                      updateSetting("performance", "cpu_priority", value)
                    }
                  >
                    <SelectTrigger className="bg-trek-dark border-trek-accent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low Priority</SelectItem>
                      <SelectItem value="Normal">Normal Priority</SelectItem>
                      <SelectItem value="High">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-trek-blue" />
                    <Label
                      htmlFor="auto-optimization"
                      className="text-trek-text"
                    >
                      Auto Optimization
                    </Label>
                  </div>
                  <Switch
                    id="auto-optimization"
                    checked={settings.performance.auto_optimization}
                    onCheckedChange={(checked) =>
                      updateSetting("performance", "auto_optimization", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-trek-blue" />
                    <Label
                      htmlFor="data-compression"
                      className="text-trek-text"
                    >
                      Data Compression
                    </Label>
                  </div>
                  <Switch
                    id="data-compression"
                    checked={settings.performance.data_compression}
                    onCheckedChange={(checked) =>
                      updateSetting("performance", "data_compression", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-green-400" />
                    <Label htmlFor="cache-enabled" className="text-trek-text">
                      Enable Caching
                    </Label>
                  </div>
                  <Switch
                    id="cache-enabled"
                    checked={settings.performance.cache_enabled}
                    onCheckedChange={(checked) =>
                      updateSetting("performance", "cache_enabled", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-trek-warning" />
                    <Label
                      htmlFor="background-processing"
                      className="text-trek-text"
                    >
                      Background Processing
                    </Label>
                  </div>
                  <Switch
                    id="background-processing"
                    checked={settings.performance.background_processing}
                    onCheckedChange={(checked) =>
                      updateSetting(
                        "performance",
                        "background_processing",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-400" />
                    <Label htmlFor="power-saving" className="text-trek-text">
                      Power Saving Mode
                    </Label>
                  </div>
                  <Switch
                    id="power-saving"
                    checked={settings.performance.power_saving}
                    onCheckedChange={(checked) =>
                      updateSetting("performance", "power_saving", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-trek-blue" />
                    <Label
                      htmlFor="gpu-acceleration"
                      className="text-trek-text"
                    >
                      GPU Acceleration
                    </Label>
                  </div>
                  <Switch
                    id="gpu-acceleration"
                    checked={settings.performance.gpu_acceleration}
                    onCheckedChange={(checked) =>
                      updateSetting("performance", "gpu_acceleration", checked)
                    }
                  />
                </div>
              </div>

              <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                <h4 className="font-semibold text-trek-gold mb-2">
                  Performance Status
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-trek-text/70">Memory Usage:</span>
                    <div className="text-trek-blue font-semibold">
                      {Math.round(settings.performance.memory_limit * 0.67)} /{" "}
                      {settings.performance.memory_limit} MB
                    </div>
                  </div>
                  <div>
                    <span className="text-trek-text/70">CPU Priority:</span>
                    <div className="text-trek-warning font-semibold">
                      {settings.performance.cpu_priority}
                    </div>
                  </div>
                  <div>
                    <span className="text-trek-text/70">Cache Status:</span>
                    <div
                      className={`font-semibold ${settings.performance.cache_enabled ? "text-green-400" : "text-red-400"}`}
                    >
                      {settings.performance.cache_enabled
                        ? "Enabled"
                        : "Disabled"}
                    </div>
                  </div>
                  <div>
                    <span className="text-trek-text/70">Optimization:</span>
                    <div
                      className={`font-semibold ${settings.performance.auto_optimization ? "text-green-400" : "text-trek-text"}`}
                    >
                      {settings.performance.auto_optimization
                        ? "Active"
                        : "Manual"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="mt-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-6">
              Backup & Sync Settings
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-trek-text mb-2 block">
                    Backup Interval
                  </Label>
                  <Select
                    value={settings.backup.backup_interval}
                    onValueChange={(value) =>
                      updateSetting("backup", "backup_interval", value)
                    }
                    disabled={!settings.backup.auto_backup}
                  >
                    <SelectTrigger className="bg-trek-dark border-trek-accent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hourly">Every Hour</SelectItem>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-trek-text mb-2 block">
                    Version History Limit
                  </Label>
                  <div className="space-y-2">
                    <Slider
                      value={[settings.backup.version_history]}
                      onValueChange={(value) =>
                        updateSetting("backup", "version_history", value[0])
                      }
                      max={50}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-trek-text/70">
                      <span>1</span>
                      <span className="text-trek-blue font-semibold">
                        {settings.backup.version_history} versions
                      </span>
                      <span>50</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="backup-location" className="text-trek-text">
                    Backup Location
                  </Label>
                  <Input
                    id="backup-location"
                    value={settings.backup.backup_location}
                    onChange={(e) =>
                      updateSetting("backup", "backup_location", e.target.value)
                    }
                    placeholder="/backup/starfleet"
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4 text-trek-blue" />
                    <Label htmlFor="auto-backup" className="text-trek-text">
                      Auto Backup
                    </Label>
                  </div>
                  <Switch
                    id="auto-backup"
                    checked={settings.backup.auto_backup}
                    onCheckedChange={(checked) =>
                      updateSetting("backup", "auto_backup", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-trek-blue" />
                    <Label htmlFor="cloud-sync" className="text-trek-text">
                      Cloud Sync
                    </Label>
                  </div>
                  <Switch
                    id="cloud-sync"
                    checked={settings.backup.cloud_sync}
                    onCheckedChange={(checked) =>
                      updateSetting("backup", "cloud_sync", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-green-400" />
                    <Label
                      htmlFor="compression-enabled"
                      className="text-trek-text"
                    >
                      Backup Compression
                    </Label>
                  </div>
                  <Switch
                    id="compression-enabled"
                    checked={settings.backup.compression_enabled}
                    onCheckedChange={(checked) =>
                      updateSetting("backup", "compression_enabled", checked)
                    }
                  />
                </div>
              </div>

              <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                <h4 className="font-semibold text-trek-gold mb-3">
                  Backup Actions
                </h4>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Backup Now
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-accent text-trek-text hover:bg-trek-accent"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Restore from Backup
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-accent text-trek-text hover:bg-trek-accent"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View History
                  </Button>
                </div>
              </div>

              <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                <h4 className="font-semibold text-trek-gold mb-2">
                  Last Backup Status
                </h4>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-trek-text">
                    Last backup completed successfully on{" "}
                    {new Date().toLocaleDateString()} at{" "}
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-trek-text/70 mt-1">
                  Next backup scheduled:{" "}
                  {settings.backup.backup_interval.toLowerCase()}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-trek-warning" />
              <h3 className="text-xl font-bold text-trek-gold">
                Advanced Settings
              </h3>
              <Badge
                variant="outline"
                className="border-trek-warning text-trek-warning"
              >
                Starfleet Personnel Only
              </Badge>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="api-endpoint" className="text-trek-text">
                    API Endpoint
                  </Label>
                  <Input
                    id="api-endpoint"
                    value={settings.advanced.api_endpoint}
                    onChange={(e) =>
                      updateSetting("advanced", "api_endpoint", e.target.value)
                    }
                    placeholder="https://starfleet.federation/api"
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="custom-css" className="text-trek-text">
                  Custom CSS
                </Label>
                <Textarea
                  id="custom-css"
                  value={settings.advanced.custom_css}
                  onChange={(e) =>
                    updateSetting("advanced", "custom_css", e.target.value)
                  }
                  placeholder="/* Custom LCARS styling */\n.lcars-button { border-radius: 20px; }"
                  className="bg-trek-dark border-trek-accent font-mono"
                  rows={6}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-trek-warning" />
                    <Label htmlFor="debug-mode" className="text-trek-text">
                      Debug Mode
                    </Label>
                  </div>
                  <Switch
                    id="debug-mode"
                    checked={settings.advanced.debug_mode}
                    onCheckedChange={(checked) =>
                      updateSetting("advanced", "debug_mode", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-trek-blue" />
                    <Label htmlFor="developer-tools" className="text-trek-text">
                      Developer Tools
                    </Label>
                  </div>
                  <Switch
                    id="developer-tools"
                    checked={settings.advanced.developer_tools}
                    onCheckedChange={(checked) =>
                      updateSetting("advanced", "developer_tools", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <Label
                      htmlFor="experimental-features"
                      className="text-trek-text"
                    >
                      Experimental Features
                    </Label>
                  </div>
                  <Switch
                    id="experimental-features"
                    checked={settings.advanced.experimental_features}
                    onCheckedChange={(checked) =>
                      updateSetting(
                        "advanced",
                        "experimental_features",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-trek-blue" />
                    <Label
                      htmlFor="telemetry-enabled"
                      className="text-trek-text"
                    >
                      Telemetry
                    </Label>
                  </div>
                  <Switch
                    id="telemetry-enabled"
                    checked={settings.advanced.telemetry_enabled}
                    onCheckedChange={(checked) =>
                      updateSetting("advanced", "telemetry_enabled", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <Label htmlFor="error-reporting" className="text-trek-text">
                      Error Reporting
                    </Label>
                  </div>
                  <Switch
                    id="error-reporting"
                    checked={settings.advanced.error_reporting}
                    onCheckedChange={(checked) =>
                      updateSetting("advanced", "error_reporting", checked)
                    }
                  />
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500 rounded p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="font-semibold text-red-400">Warning</span>
                </div>
                <p className="text-sm text-trek-text">
                  Advanced settings can affect system stability and security.
                  Only modify these settings if you understand the implications.
                  Unauthorized changes may result in system lockout or data
                  loss.
                </p>
              </div>

              <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                <h4 className="font-semibold text-trek-gold mb-3">
                  System Actions
                </h4>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-warning text-trek-warning hover:bg-trek-warning hover:text-trek-dark"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                  >
                    <Wrench className="w-4 h-4 mr-2" />
                    Factory Reset
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-accent text-trek-text hover:bg-trek-accent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Logs
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
