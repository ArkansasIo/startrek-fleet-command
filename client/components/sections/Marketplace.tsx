import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, DollarSign, TrendingUp, Package } from "lucide-react";

interface MarketplaceProps {
  activeSubmenu?: string;
}

export function Marketplace({ activeSubmenu }: MarketplaceProps) {
  const [selectedTab, setSelectedTab] = useState<"resources" | "ships" | "blueprints">("resources");
  const [credits, setCredits] = useState(50000);
  const [inventory, setInventory] = useState({
    dilithium: 5000,
    tritanium: 3000,
    deuterium: 2500,
  });

  const resourceListings = [
    { id: 1, name: "Dilithium Crystals", price: 100, quantity: 1000, seller: "Dabo Station", rating: 4.8 },
    { id: 2, name: "Tritanium Ore", price: 80, quantity: 500, seller: "Starbase 12", rating: 4.5 },
    { id: 3, name: "Deuterium", price: 50, quantity: 2000, seller: "Ferengi Traders", rating: 4.2 },
    { id: 4, name: "Latinum", price: 150, quantity: 100, seller: "Quarks Bar", rating: 5.0 },
  ];

  const shipListings = [
    { id: 1, name: "Scout Vessel", price: 10000, seller: "Federation Fleet", condition: "New" },
    { id: 2, name: "Transport Ship", price: 25000, seller: "Civilian Merchants", condition: "Used" },
    { id: 3, name: "Cruiser", price: 50000, seller: "Starfleet Command", condition: "Refurbished" },
  ];

  const blueprintListings = [
    { id: 1, name: "Warp Drive Enhancement", price: 5000, rarity: "Uncommon" },
    { id: 2, name: "Advanced Weapons System", price: 12000, rarity: "Rare" },
    { id: 3, name: "Quantum Processor", price: 25000, rarity: "Epic" },
  ];

  const handlePurchase = (price: number, name: string) => {
    if (credits >= price) {
      setCredits(credits - price);
      alert(`Purchased ${name} for ${price} credits!`);
    } else {
      alert("Insufficient credits!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Balance */}
      <Card className="bg-trek-panel border-trek-accent">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-trek-dark/50 rounded border border-trek-gold/50">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-trek-gold" />
                <span className="text-trek-text/70">Credits</span>
              </div>
              <div className="text-3xl font-bold text-trek-gold">{credits.toLocaleString()}</div>
            </div>
            <div className="text-center p-4 bg-trek-dark/50 rounded border border-trek-blue/50">
              <div className="text-trek-text/70 text-sm mb-2">Active Listings</div>
              <div className="text-3xl font-bold text-trek-blue">42</div>
            </div>
            <div className="text-center p-4 bg-trek-dark/50 rounded border border-trek-green/50">
              <div className="text-trek-text/70 text-sm mb-2">Reputation</div>
              <div className="text-3xl font-bold text-trek-green">4.7★</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button
          onClick={() => setSelectedTab("resources")}
          className={`flex-1 ${
            selectedTab === "resources"
              ? "bg-trek-blue text-trek-dark"
              : "bg-trek-panel text-trek-text border border-trek-accent"
          }`}
        >
          <Package className="w-4 h-4 mr-2" />
          Resources
        </Button>
        <Button
          onClick={() => setSelectedTab("ships")}
          className={`flex-1 ${
            selectedTab === "ships"
              ? "bg-trek-blue text-trek-dark"
              : "bg-trek-panel text-trek-text border border-trek-accent"
          }`}
        >
          Resources
        </Button>
        <Button
          onClick={() => setSelectedTab("blueprints")}
          className={`flex-1 ${
            selectedTab === "blueprints"
              ? "bg-trek-blue text-trek-dark"
              : "bg-trek-panel text-trek-text border border-trek-accent"
          }`}
        >
          Blueprints
        </Button>
      </div>

      {/* Resources Tab */}
      {selectedTab === "resources" && (
        <div className="space-y-4">
          {resourceListings.map((listing) => (
            <Card key={listing.id} className="bg-trek-dark border-trek-accent">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-trek-gold text-lg">{listing.name}</h3>
                    <p className="text-xs text-trek-text/60">Seller: {listing.seller}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-trek-gold font-bold text-2xl">{listing.price}</div>
                    <div className="text-xs text-trek-text/60">credits each</div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="bg-trek-panel/50 p-2 rounded text-sm">
                      <span className="text-trek-text/70">Stock: </span>
                      <span className="text-trek-blue font-bold">{listing.quantity}</span>
                    </div>
                    <div className="bg-trek-panel/50 p-2 rounded text-sm">
                      <span className="text-trek-text/70">Rating: </span>
                      <span className="text-trek-gold font-bold">{listing.rating}★</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handlePurchase(listing.price, listing.name)}
                    className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Ships Tab */}
      {selectedTab === "ships" && (
        <div className="space-y-4">
          {shipListings.map((listing) => (
            <Card key={listing.id} className="bg-trek-dark border-trek-accent">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-trek-gold text-lg">{listing.name}</h3>
                    <p className="text-xs text-trek-text/60">
                      Seller: {listing.seller} | Condition: {listing.condition}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-trek-gold font-bold text-2xl">{listing.price.toLocaleString()}</div>
                    <div className="text-xs text-trek-text/60">credits</div>
                  </div>
                </div>

                <Button
                  onClick={() => handlePurchase(listing.price, listing.name)}
                  className="w-full bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Purchase Ship
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Blueprints Tab */}
      {selectedTab === "blueprints" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blueprintListings.map((listing) => (
            <Card key={listing.id} className="bg-trek-dark border-trek-accent">
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-trek-gold">{listing.name}</h3>
                  <span className={`text-xs font-bold ${
                    listing.rarity === "Uncommon" ? "text-trek-green" :
                    listing.rarity === "Rare" ? "text-trek-blue" : "text-trek-gold"
                  }`}>
                    {listing.rarity}
                  </span>
                </div>

                <div className="text-2xl font-bold text-trek-gold">{listing.price} credits</div>

                <Button
                  onClick={() => handlePurchase(listing.price, listing.name)}
                  className="w-full bg-trek-gold hover:bg-trek-gold/80 text-trek-dark"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Purchase Blueprint
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Price Trends */}
      <Card className="bg-trek-panel border-trek-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-trek-gold">
            <TrendingUp className="w-5 h-5" />
            Market Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "Dilithium", change: 5.2, direction: "up" },
            { name: "Tritanium", change: -2.1, direction: "down" },
            { name: "Latinum", change: 8.7, direction: "up" },
          ].map((trend, idx) => (
            <div key={idx} className="flex justify-between items-center p-2 bg-trek-dark/50 rounded border border-trek-blue/30">
              <span className="text-trek-text">{trend.name}</span>
              <span className={`font-bold ${trend.direction === "up" ? "text-trek-green" : "text-red-400"}`}>
                {trend.direction === "up" ? "↑" : "↓"} {Math.abs(trend.change)}%
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
