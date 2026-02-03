import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
  Package,
  BarChart3,
  Briefcase,
  ShoppingCart,
  Coins,
  Target,
  AlertTriangle,
} from "lucide-react";

interface Resource {
  id: string;
  name: string;
  symbol: string;
  current: number;
  previous: number;
  market_price: number;
  trend: number; // percentage change
  volatility: number;
  supply: number;
  demand: number;
}

interface TradeOffer {
  id: string;
  merchant: string;
  offering: string;
  quantity: number;
  price_per_unit: number;
  total_cost: number;
  expires_in: number; // hours
}

interface PlayerInventory {
  resource: string;
  amount: number;
  value: number;
}

interface EconomicIndex {
  inflation: number;
  market_health: number;
  trade_volume: number;
  timestamp: number;
}

export function ResourceEconomyUI() {
  const [credits, setCredits] = useState<number>(250000);
  const [inventory, setInventory] = useState<PlayerInventory[]>([
    { resource: "Dilithium Crystals", amount: 5000, value: 150000 },
    { resource: "Tritanium", amount: 8500, value: 85000 },
    { resource: "Latinum", amount: 2500, value: 100000 },
    { resource: "Plasma", amount: 3200, value: 32000 },
    { resource: "Isolinear Chips", amount: 1500, value: 30000 },
  ]);

  const [resources, setResources] = useState<Resource[]>([
    {
      id: "dilithium",
      name: "Dilithium Crystals",
      symbol: "DC",
      current: 30,
      previous: 28,
      market_price: 30,
      trend: 7.14,
      volatility: 5.2,
      supply: 8500,
      demand: 9200,
    },
    {
      id: "tritanium",
      name: "Tritanium",
      symbol: "TRI",
      current: 10,
      previous: 10,
      market_price: 10,
      trend: 0,
      volatility: 3.1,
      supply: 15000,
      demand: 14500,
    },
    {
      id: "latinum",
      name: "Latinum",
      symbol: "LAT",
      current: 40,
      previous: 38,
      market_price: 40,
      trend: 5.26,
      volatility: 8.7,
      supply: 2000,
      demand: 3500,
    },
    {
      id: "plasma",
      name: "Plasma",
      symbol: "PLS",
      current: 10,
      previous: 12,
      market_price: 10,
      trend: -16.67,
      volatility: 6.4,
      supply: 45000,
      demand: 38000,
    },
    {
      id: "isolinear",
      name: "Isolinear Chips",
      symbol: "ISO",
      current: 20,
      previous: 22,
      market_price: 20,
      trend: -9.09,
      volatility: 4.8,
      supply: 5000,
      demand: 4200,
    },
  ]);

  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>([
    {
      id: "offer_1",
      merchant: "Ferengi Trade Alliance",
      offering: "Dilithium Crystals",
      quantity: 1000,
      price_per_unit: 35,
      total_cost: 35000,
      expires_in: 4,
    },
    {
      id: "offer_2",
      merchant: "Bolian Mining Consortium",
      offering: "Tritanium",
      quantity: 5000,
      price_per_unit: 11,
      total_cost: 55000,
      expires_in: 8,
    },
    {
      id: "offer_3",
      merchant: "Vulcan Science Academy",
      offering: "Isolinear Chips",
      quantity: 500,
      price_per_unit: 18,
      total_cost: 9000,
      expires_in: 2,
    },
  ]);

  const [selectedBuyOffer, setSelectedBuyOffer] = useState<string | null>(null);
  const [buyQuantity, setBuyQuantity] = useState<number>(1);

  const economicIndex: EconomicIndex = useMemo(() => ({
    inflation: 2.3,
    market_health: 78,
    trade_volume: 450000,
    timestamp: Date.now(),
  }), []);

  const portfolioValue = useMemo(() => {
    return inventory.reduce((sum, item) => sum + item.value, 0);
  }, [inventory]);

  const totalAssets = useMemo(() => {
    return credits + portfolioValue;
  }, [credits, portfolioValue]);

  const demandSupplyRatio = useMemo(() => {
    return resources.map(r => ({
      name: r.name,
      ratio: (r.demand / r.supply * 100).toFixed(1),
      shortage: r.demand > r.supply,
    }));
  }, [resources]);

  const handleBuyResource = (offerId: string) => {
    const offer = tradeOffers.find(o => o.id === offerId);
    if (offer && credits >= offer.total_cost) {
      setCredits(credits - offer.total_cost);
      setInventory([
        ...inventory,
        {
          resource: offer.offering,
          amount: offer.quantity,
          value: offer.total_cost,
        },
      ]);
      setTradeOffers(tradeOffers.filter(o => o.id !== offerId));
      setSelectedBuyOffer(null);
    }
  };

  const handleSellResource = (resourceName: string, amount: number) => {
    const resource = resources.find(r => r.name === resourceName);
    if (resource && amount > 0) {
      const saleValue = amount * resource.market_price;
      setCredits(credits + saleValue);
      setInventory(
        inventory
          .map(item =>
            item.resource === resourceName
              ? { ...item, amount: item.amount - amount }
              : item
          )
          .filter(item => item.amount > 0)
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-8 h-8 text-yellow-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">Galactic Economics & Trading</h1>
          <p className="text-gray-400">Manage resources, trade commodities, and optimize your portfolio</p>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-yellow-500/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-400 mb-2">Available Credits</div>
            <div className="text-3xl font-bold text-yellow-300">{credits.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-2">+2,500 per hour</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-400 mb-2">Portfolio Value</div>
            <div className="text-3xl font-bold text-blue-300">{portfolioValue.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-2">{inventory.length} item types</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-purple-500/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-400 mb-2">Total Assets</div>
            <div className="text-3xl font-bold text-purple-300">{totalAssets.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-2">+5% from baseline</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-green-500/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-400 mb-2">Market Health</div>
            <Progress value={economicIndex.market_health} className="mb-2" />
            <div className="text-sm font-bold text-green-300">{economicIndex.market_health}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Economic Indicators */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Economic Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-400 mb-2">Inflation Rate</div>
              <div className="text-2xl font-bold text-red-300">{economicIndex.inflation}%</div>
              <div className="text-xs text-gray-500 mt-2">↑ Rising trend</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-2">Daily Trade Volume</div>
              <div className="text-2xl font-bold text-blue-300">{economicIndex.trade_volume.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-2">↑ +12% from average</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-2">Supply/Demand Shortage</div>
              <div className="text-2xl font-bold text-yellow-300">{demandSupplyRatio.filter(r => r.shortage).length}/{resources.length}</div>
              <div className="text-xs text-gray-500 mt-2">Resources in shortage</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="market" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="market" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Market Data
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Your Inventory
          </TabsTrigger>
          <TabsTrigger value="trading" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Trade Offers
          </TabsTrigger>
        </TabsList>

        {/* Market Data Tab */}
        <TabsContent value="market" className="space-y-4">
          <ScrollArea className="h-[600px] rounded-lg border border-gray-700 p-4">
            <div className="space-y-4 pr-4">
              {resources.map(resource => (
                <Card key={resource.id} className="bg-gray-900/50 border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-blue-300">{resource.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {resource.symbol} • Current Price: {resource.market_price} credits
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${resource.trend > 0 ? "text-green-300" : "text-red-300"}`}>
                          {resource.trend > 0 ? "+" : ""}{resource.trend.toFixed(2)}%
                        </div>
                        <div className="text-xs text-gray-500">vs. previous hour</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Price Chart (Simple representation) */}
                    <div className="h-16 bg-gray-800/50 rounded flex items-end gap-1 p-2">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-blue-500/60 rounded-t"
                          style={{
                            height: `${Math.random() * 100}%`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Supply and Demand */}
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-700">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Supply</div>
                        <div className="text-lg font-bold text-blue-300">{resource.supply.toLocaleString()}</div>
                        <Progress value={Math.min((resource.supply / 50000) * 100, 100)} className="h-1 mt-1" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Demand</div>
                        <div className="text-lg font-bold text-red-300">{resource.demand.toLocaleString()}</div>
                        <Progress value={Math.min((resource.demand / 50000) * 100, 100)} className="h-1 mt-1" />
                      </div>
                    </div>

                    {/* Market Status */}
                    <div className="flex items-center gap-2 pt-2">
                      <Badge className={resource.demand > resource.supply ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"}>
                        {resource.demand > resource.supply ? "In Shortage" : "In Surplus"}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Volatility: {resource.volatility}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {inventory.map(item => {
              const resourceData = resources.find(r => r.name === item.resource);
              return (
                <Card key={item.resource} className="bg-gray-900/50 border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-blue-300">{item.resource}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Amount Held</span>
                        <span className="text-blue-300 font-bold">{item.amount.toLocaleString()}</span>
                      </div>
                      <Progress value={Math.min((item.amount / 10000) * 100, 100)} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-700">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Total Value</div>
                        <div className="text-lg font-bold text-yellow-300">
                          {item.value.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Market Price</div>
                        <div className="text-lg font-bold text-green-300">
                          {resourceData?.market_price || 0}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Input
                        type="number"
                        placeholder="Amount to sell"
                        defaultValue={0}
                        onBlur={(e) => {
                          const amount = parseInt(e.target.value) || 0;
                          if (amount > 0 && amount <= item.amount) {
                            handleSellResource(item.resource, amount);
                            e.target.value = "0";
                          }
                        }}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <Button
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => {
                        const input = document.querySelector(`input[placeholder="Amount to sell"]`) as HTMLInputElement;
                        const amount = parseInt(input?.value) || 0;
                        if (amount > 0 && amount <= item.amount) {
                          handleSellResource(item.resource, amount);
                          input.value = "0";
                        }
                      }}
                    >
                      Sell Resource
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Trading Tab */}
        <TabsContent value="trading" className="space-y-4">
          <ScrollArea className="h-[600px] rounded-lg border border-gray-700 p-4">
            <div className="space-y-4 pr-4">
              {tradeOffers.map(offer => (
                <Card key={offer.id} className="bg-gray-900/50 border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-blue-300">{offer.merchant}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {offer.offering}
                        </CardDescription>
                      </div>
                      <Badge
                        className={
                          offer.expires_in <= 2
                            ? "bg-red-500/20 text-red-300"
                            : offer.expires_in <= 4
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-green-500/20 text-green-300"
                        }
                      >
                        {offer.expires_in}h remaining
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Offer Details */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Quantity</div>
                        <div className="text-lg font-bold text-blue-300">{offer.quantity.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Price/Unit</div>
                        <div className="text-lg font-bold text-yellow-300">{offer.price_per_unit}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Total Cost</div>
                        <div className="text-lg font-bold text-red-300">
                          {offer.total_cost.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Affordability Check */}
                    {credits < offer.total_cost && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded p-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-300" />
                        <span className="text-xs text-red-300">
                          Insufficient funds ({(offer.total_cost - credits).toLocaleString()} short)
                        </span>
                      </div>
                    )}

                    {/* Buy Button */}
                    <Button
                      onClick={() => handleBuyResource(offer.id)}
                      disabled={credits < offer.total_cost}
                      className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                    >
                      Purchase
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
