import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';
import { GameState, ALL_FACTIONS } from '@/lib/ModernGameIntegration';
import { upgadeGenerator as upgradeGenerator, buyResource, sellResource } from '@/lib/ResourceEconomySystem';

interface ResourceCenterPageProps {
  gameState: GameState;
  onUpdate: (state: GameState) => void;
}

export default function ResourceCenterPage({ gameState, onUpdate }: ResourceCenterPageProps) {
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [tradeAmount, setTradeAmount] = useState(100);

  const handleUpgradeGenerator = (resourceName: string) => {
    const generator = gameState.economy.generators.get(resourceName);
    if (!generator) return;

    const cost = 1000 * Math.pow(1.5, generator.level);
    const credits = gameState.economy.resources.get('credits') || 0;

    if (credits >= cost) {
      const newGenerator = { ...generator, level: generator.level + 1 };
      gameState.economy.generators.set(resourceName, newGenerator);
      gameState.economy.resources.set('credits', credits - cost);
      onUpdate({ ...gameState });
      alert(`Upgraded ${resourceName} generator to level ${newGenerator.level}`);
    } else {
      alert(`Insufficient credits. Need ${cost.toLocaleString()}, have ${credits.toLocaleString()}`);
    }
  };

  const handleBuy = (resourceName: string) => {
    const result = buyResource(gameState.economy, resourceName as any, tradeAmount);
    if (result) {
      onUpdate({ ...gameState });
      alert(`Purchased ${tradeAmount} ${resourceName}`);
    } else {
      alert('Purchase failed - insufficient credits');
    }
  };

  const handleSell = (resourceName: string) => {
    const result = sellResource(gameState.economy, resourceName as any, tradeAmount);
    if (result) {
      onUpdate({ ...gameState });
      alert(`Sold ${tradeAmount} ${resourceName}`);
    } else {
      alert('Sale failed - insufficient resources');
    }
  };

  const resources = Array.from(gameState.economy.resources.entries());
  const generators = Array.from(gameState.economy.generators.entries());

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Resource Center</h1>
          <p className="text-green-200">
            Manage your empire's economy and trade resources
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resource List */}
          <div className="lg:col-span-2 space-y-4">
            {generators.map(([resourceName, generator]) => {
              const amount = gameState.economy.resources.get(resourceName as any) || 0;
              const capacity = gameState.economy.maxStorage.get(resourceName as any) || 10000;
              const percentage = (amount / capacity) * 100;
              const upgradeCost = 1000 * Math.pow(1.5, generator.level);
              const generationRate = generator.baseGeneration * generator.efficiency;
              const marketPrice = gameState.economy.marketPrices.get(resourceName as any) || 100;

              return (
                <Card 
                  key={resourceName}
                  className="bg-gray-800 border-gray-700 hover:border-green-500 transition-all cursor-pointer"
                  onClick={() => setSelectedResource(resourceName)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-white capitalize">
                          {resourceName}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {amount.toLocaleString()} / {capacity.toLocaleString()}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-green-900 text-green-200">
                        Lv {generator.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Storage</span>
                          <span className="text-white">{percentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400">Generation:</span>
                          <div className="text-green-400 font-semibold">
                            +{generationRate.toFixed(1)}/min
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Market Price:</span>
                          <div className="text-yellow-400 font-semibold">
                            {marketPrice} credits
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Upgrade:</span>
                          <div className="text-blue-400 font-semibold">
                            {upgradeCost.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpgradeGenerator(resourceName);
                          }}
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Upgrade
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedResource(resourceName);
                          }}
                        >
                          <ArrowUpDown className="h-3 w-3 mr-1" />
                          Trade
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Trading Panel */}
          <div className="lg:col-span-1">
            {selectedResource ? (
              <Card className="bg-gray-800 border-gray-700 sticky top-6">
                <CardHeader>
                  <CardTitle className="text-white capitalize">{selectedResource}</CardTitle>
                  <CardDescription>Trading & Management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Current Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">In Storage</span>
                        <span className="text-white">
                          {(gameState.economy.resources.get(selectedResource as any) || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Market Price</span>
                        <span className="text-yellow-400">
                          {(gameState.economy.marketPrices.get(selectedResource as any) || 100)} credits
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Generation</span>
                        <span className="text-green-400">
                          +{((gameState.economy.generators.get(selectedResource)?.baseGeneration || 0) * (gameState.economy.generators.get(selectedResource)?.efficiency || 1)).toFixed(1)}/min
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <h4 className="text-sm font-semibold text-white mb-3">Trading</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Amount</label>
                        <input
                          type="number"
                          value={tradeAmount}
                          onChange={(e) => setTradeAmount(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                          min="1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm"
                          className="w-full"
                          onClick={() => handleBuy(selectedResource)}
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Buy
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => handleSell(selectedResource)}
                        >
                          <TrendingDown className="h-3 w-3 mr-1" />
                          Sell
                        </Button>
                      </div>

                      <div className="text-xs text-gray-400 space-y-1">
                        <div className="flex justify-between">
                          <span>Buy Cost:</span>
                          <span className="text-red-400">
                            {(tradeAmount * (gameState.economy.marketPrices.get(selectedResource as any) || 100)).toLocaleString()} credits
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sell Value:</span>
                          <span className="text-green-400">
                            {(tradeAmount * (gameState.economy.marketPrices.get(selectedResource as any) || 100) * 0.8).toLocaleString()} credits
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <h4 className="text-sm font-semibold text-white mb-2">Generator Upgrade</h4>
                    <p className="text-xs text-gray-400 mb-3">
                      Upgrade to increase passive generation rate and storage capacity
                    </p>
                    <Button 
                      size="sm"
                      className="w-full"
                      onClick={() => handleUpgradeGenerator(selectedResource)}
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Upgrade Generator
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Zap className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Select a resource to trade</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
