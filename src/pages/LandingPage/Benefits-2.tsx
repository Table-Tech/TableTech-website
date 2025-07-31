import React, { useState, useEffect } from "react";

interface Table {
  id: number;
  name: string;
  seats: number;
  status: "vrij" | "bezet" | "bijna-klaar" | "wacht-personeel" | "nog-niet-besteld" | "eten-geleverd" | "gereserveerd";
  duration: string;
  shape: "round" | "square" | "rectangle";
  position: { x: number; y: number };
  zone?: string;
  customerType?: "family" | "business" | "couple";
  dish?: string;
  waitTime?: number;
  paid?: boolean;
  bill?: number;
  hasOrder?: boolean;
  reservationTime?: string;
  reservedBy?: string;
}

const initialTables: Table[] = [
  // Zone A tables (2x3 grid, alle 2p) - meer ruimte tussen tafels
  { id: 1, name: "T1", seats: 2, status: "nog-niet-besteld", duration: "0u 8m", shape: "round", position: { x: 8, y: 26 }, zone: "A", paid: false, bill: 0, hasOrder: false },
  { id: 2, name: "T2", seats: 2, status: "nog-niet-besteld", duration: "0u 12m", shape: "round", position: { x: 22, y: 26 }, zone: "A", paid: false, bill: 0, hasOrder: false },
  { id: 3, name: "T3", seats: 2, status: "bezet", duration: "1u 15m", shape: "round", position: { x: 36, y: 26 }, zone: "A", dish: "Hoofdgerecht", paid: false, bill: 45.5, hasOrder: true },
  { id: 4, name: "T4", seats: 2, status: "vrij", duration: "0u 0m", shape: "round", position: { x: 8, y: 44 }, zone: "A", paid: false, bill: 0, hasOrder: false },
  { id: 5, name: "T5", seats: 2, status: "eten-geleverd", duration: "1u 30m", shape: "round", position: { x: 22, y: 44 }, zone: "A", dish: "Toetje", paid: true, bill: 67.8, hasOrder: true },
  { id: 6, name: "T6", seats: 2, status: "bezet", duration: "1u 45m", shape: "round", position: { x: 36, y: 44 }, zone: "A", dish: "Rekening", paid: false, bill: 89.25, hasOrder: true },

  // Zone B tables (2x2 grid, alle 4p) - groter, meer verspreid en meer naar rechts
  { id: 7, name: "T7", seats: 4, status: "vrij", duration: "0u 0m", shape: "square", position: { x: 70, y: 26 }, zone: "B", paid: false, bill: 0, hasOrder: false },
  { id: 8, name: "T8", seats: 4, status: "bezet", duration: "0u 45m", shape: "square", position: { x: 84, y: 26 }, zone: "B", customerType: "family", dish: "Voorgerecht", paid: false, bill: 28.5, hasOrder: true },
  { id: 9, name: "T9", seats: 4, status: "eten-geleverd", duration: "1u 4m", shape: "square", position: { x: 70, y: 44 }, zone: "B", dish: "Toetje", paid: true, bill: 52.75, hasOrder: true },
  { id: 10, name: "T10", seats: 4, status: "bezet", duration: "1u 20m", shape: "square", position: { x: 84, y: 44 }, zone: "B", customerType: "couple", dish: "Hoofdgerecht", paid: false, bill: 52.75, hasOrder: true },

  // Zone C tables (5 rectangles, alle 8p) - groter en beter gecentreerd
  { id: 11, name: "T11", seats: 8, status: "gereserveerd", duration: "0u 0m", shape: "rectangle", position: { x: 20, y: 73 }, zone: "C", reservationTime: "19:30", reservedBy: "Wishant Bhajan" },
  { id: 12, name: "T12", seats: 8, status: "gereserveerd", duration: "0u 0m", shape: "rectangle", position: { x: 20, y: 85 }, zone: "C", reservationTime: "20:00", reservedBy: "Damian Willemse" },
  { id: 13, name: "T13", seats: 8, status: "gereserveerd", duration: "0u 0m", shape: "rectangle", position: { x: 78, y: 73 }, zone: "C", reservationTime: "18:45", reservedBy: "Hicham Tahiri" },
  { id: 14, name: "T14", seats: 8, status: "gereserveerd", duration: "0u 0m", shape: "rectangle", position: { x: 78, y: 85 }, zone: "C", reservationTime: "19:15", reservedBy: "Mohammed Falaha" },
  { id: 15, name: "T15", seats: 8, status: "gereserveerd", duration: "0u 0m", shape: "rectangle", position: { x: 50, y: 79 }, zone: "C", reservationTime: "20:15", reservedBy: "TableTech Familie" }
];

const statusColors = {
  vrij: "bg-slate-600/80 border border-slate-400/60 shadow-lg",
  bezet: "bg-orange-500/85 border border-orange-400/70 shadow-lg", 
  "bijna-klaar": "bg-yellow-500/85 border border-yellow-400/70 shadow-lg",
  "wacht-personeel": "bg-red-500/85 border border-red-400/70 shadow-lg",
  "nog-niet-besteld": "bg-orange-500/85 border border-orange-400/70 shadow-lg",
  "eten-geleverd": "bg-emerald-500/85 border border-emerald-400/70 shadow-lg",
  gereserveerd: "bg-purple-600/85 border border-purple-400/70 shadow-lg",
};

const statusLabels = {
  vrij: "Beschikbaar",
  bezet: "Bezet", 
  "bijna-klaar": "Bijna klaar",
  "wacht-personeel": "Wacht op personeel",
  "nog-niet-besteld": "Nog niet besteld",
  "eten-geleverd": "Eten geleverd",
  gereserveerd: "Gereserveerd",
};

const getTooltipPosition = (table: Table) => {
  const { x, y } = table.position;
  
  // Specifieke fixes voor problematische tafels
  if (table.id === 3) { // T3 - altijd rechts in het midden
    return {
      positionClasses: "left-full ml-3 top-1/2 transform -translate-y-1/2",
      arrowClasses: "right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-black/98"
    };
  }
  
  if (table.id === 8) { // T8 - rechts boven in Zone B  
    return {
      positionClasses: "right-full mr-3 top-0",
      arrowClasses: "left-full top-4 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-black/98"
    };
  }
  
  // Algemene logica voor andere tafels
  const isTopQuarter = y < 35;
  const isBottomQuarter = y > 70;
  const isLeftSide = x < 30;
  const isRightSide = x > 70;

  let positionClasses = "";
  let arrowClasses = "";

  // Verticale positionering
  if (isTopQuarter) {
    // Show tooltip below the table
    positionClasses = "top-full mt-3";
    arrowClasses = "bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black/98";
  } else if (isBottomQuarter) {
    // Show tooltip above the table
    positionClasses = "bottom-full mb-3";
    arrowClasses = "top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/98";
  } else {
    // Show tooltip to the side for middle tables
    if (x < 50) {
      // Show to the right
      positionClasses = "left-full ml-3 top-1/2 transform -translate-y-1/2";
      arrowClasses = "right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-black/98";
    } else {
      // Show to the left
      positionClasses = "right-full mr-3 top-1/2 transform -translate-y-1/2";
      arrowClasses = "left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-black/98";
    }
  }

  // Horizontale positionering voor boven/onder tooltips
  if (isTopQuarter || isBottomQuarter) {
    if (isLeftSide) {
      positionClasses += " left-0";
    } else if (isRightSide) {
      positionClasses += " right-0";
    } else {
      positionClasses += " left-1/2 transform -translate-x-1/2";
    }
  }

  return { positionClasses, arrowClasses };
};

export const BenefitsTwo: React.FC = () => {
  const [tables] = useState<Table[]>(initialTables);
  const [hoveredTable, setHoveredTable] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="benefits-2"
      className="benefits-section relative w-full h-full flex items-center justify-center overflow-y-auto"
    >
        {/* Main content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 min-h-0 flex-1 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full">
            {/* Titel bovenaan - buiten frame */}
            <div className="lg:col-span-2 text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg tracking-tight">
                Slim tafelbeheer in één oogopslag.
              </h1>
              {/* Hover instruction */}
              <div className="flex items-center justify-center space-x-2 text-white/80 text-sm">
                <span>▽</span>
                <span>Beweeg de muis over de tafels</span>
              </div>
            </div>
            {/* Left side - Restaurant Floor Plan - Alles in één frame zoals afbeelding 3 */}
            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border-2 border-gray-600/50 p-4 shadow-2xl">
              {/* Tijd bovenaan in de frame */}
              <div className="text-center mb-4">
                <div className="text-white text-xl font-mono font-bold drop-shadow-lg">
                  {currentTime.toLocaleTimeString("nl-NL", {
                    hour: "2-digit",
                    minute: "2-digit", 
                    second: "2-digit",
                  })}
                </div>
              </div>
              {/* Restaurant Floor Plan */}
            <div className="relative h-64 w-full bg-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-600/40 p-3 shadow-xl mb-4">
              
              {/* Zone A Background - Groter */}
              <div className="absolute top-4 left-4 w-48 h-32 bg-blue-900/25 border border-blue-500/40 rounded-xl backdrop-blur-sm shadow-lg">
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-white text-xs font-medium">Zone A</span>
                </div>
              </div>

              {/* Zone B Background - Groter */}
              <div className="absolute top-4 right-4 w-48 h-32 bg-green-900/25 border border-green-500/40 rounded-xl backdrop-blur-sm shadow-lg">
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white text-xs font-medium">Zone B</span>
                </div>
              </div>

              {/* Zone C Background - Groter */}
              <div className="absolute bottom-4 left-4 right-4 h-20 bg-purple-900/25 border border-purple-500/40 rounded-xl backdrop-blur-sm shadow-lg">
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-white text-xs font-medium">Zone C</span>
                </div>
              </div>

              {/* Tables */}
              {tables.map((table) => {
                const { positionClasses, arrowClasses } = getTooltipPosition(table);

                // Zone C tables get special purple styling, T10 stays orange
                const tableColorClass = table.zone === "C" && table.id !== 10
                  ? "bg-purple-600/85 border border-purple-400/70 shadow-lg"
                  : table.id === 10
                  ? "bg-orange-500/85 border border-orange-400/70 shadow-lg"
                  : statusColors[table.status];

                return (
                  <div
                    key={table.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${
                      hoveredTable === table.id ? "scale-110" : ""
                    }`}
                    style={{
                      left: `${table.position.x}%`,
                      top: `${table.position.y}%`,
                      zIndex: hoveredTable === table.id ? 9998 : 10,
                    }}
                    onMouseEnter={() => setHoveredTable(table.id)}
                    onMouseLeave={() => setHoveredTable(null)}
                  >
                    <div
                      className={`
                        ${tableColorClass} 
                        cursor-pointer transition-all duration-200 ease-out backdrop-blur-sm
                        hover:brightness-110 hover:shadow-xl hover:scale-105
                        ${
                          table.shape === "square"
                            ? "rounded-lg w-10 h-10"
                            : table.shape === "rectangle"
                              ? table.id === 15 
                                ? "w-28 h-8 rounded-full" // Large center table - groter
                                : "w-20 h-5 rounded-full"  // Side tables - groter
                              : "rounded-full w-8 h-8"
                        }
                        relative group
                      `}
                    >
                      {/* Payment status indicator */}
                      {table.zone !== "C" && table.status !== "vrij" && table.status !== "nog-niet-besteld" && table.status !== "gereserveerd" && (
                        <div className="absolute -top-0.5 -right-0.5">
                          {table.paid ? (
                            <div className="bg-green-500 rounded-full w-2 h-2 flex items-center justify-center shadow-sm">
                              <span className="text-white text-[8px]">💳</span>
                            </div>
                          ) : (
                            <div className="bg-orange-500 rounded-full w-2 h-2 flex items-center justify-center shadow-sm">
                              <span className="text-white text-[8px]">⚠️</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Status icons */}
                      {table.zone !== "C" && table.status === "nog-niet-besteld" && (
                        <div className="absolute -top-1 -left-1 bg-orange-500 rounded-full w-3 h-3 flex items-center justify-center shadow-sm">
                          <span className="text-white text-[8px]">🍽️</span>
                        </div>
                      )}

                      {((table.zone !== "C" && table.status === "eten-geleverd" && table.id !== 10) || table.id === 10) && (
                        <div className="absolute -top-1 -left-1 bg-green-500 rounded-full w-3 h-3 flex items-center justify-center shadow-sm">
                          <span className="text-white text-[8px]">✅</span>
                        </div>
                      )}
                      {/* Extra: groen vinkje icoon bij T3 als bestelling geleverd */}
                      {table.id === 3 && (
                        <div className="absolute -top-1 -left-1 bg-green-500 rounded-full w-3 h-3 flex items-center justify-center shadow-sm">
                          <span className="text-white text-[8px]">✅</span>
                        </div>
                      )}

                      <div className="flex flex-col justify-center items-center h-full">
                        <div className="text-white text-xs font-bold drop-shadow-lg">{table.seats}p</div>
                      </div>

                      {/* Tooltip */}
                      {hoveredTable === table.id && (
                        <div
                          className={`absolute ${positionClasses} bg-black/98 backdrop-blur-md text-white text-xs px-4 py-3 rounded-lg whitespace-nowrap border-2 border-gray-500/60 shadow-2xl min-w-max max-w-xs`}
                          style={{ zIndex: 9999 }}
                        >
                          <div className="font-medium text-center mb-1 text-sm text-white">{table.name}</div>
                          <div className="text-gray-200 mb-1">
                            Status: <span className="text-white font-medium">
                              {(table.id === 5 || table.id === 9) && table.status === "eten-geleverd" 
                                ? "Afgerond" 
                                : statusLabels[table.status]}
                            </span>
                          </div>

                          {table.status === "gereserveerd" && (
                            <>
                              <div className="text-yellow-300 mb-1">
                                Gereserveerd door: <span className="text-white font-medium">{table.reservedBy}</span>
                              </div>
                              <div className="text-blue-300 mb-1">
                                Tijd: <span className="text-white font-medium">{table.reservationTime}</span>
                              </div>
                            </>
                          )}

                          {table.status !== "gereserveerd" && (
                            <div className="text-gray-200 mb-1">
                              Tijd: <span className="text-white font-medium">{table.duration}</span>
                            </div>
                          )}

                          {table.dish && (
                            <div className="text-gray-200 mb-1">
                              Fase: <span className="text-white font-medium">{table.dish}</span>
                            </div>
                          )}

                          {table.status !== "vrij" && table.status !== "nog-niet-besteld" && table.status !== "gereserveerd" && (
                            <div className="border-t border-gray-600 mt-2 pt-2">
                              <div className="text-gray-200 mb-1">
                                Rekening: <span className="text-white font-medium">€{table.bill?.toFixed(2)}</span>
                              </div>
                              <div className={`font-medium text-xs ${table.paid ? "text-green-400" : "text-orange-400"}`}>
                                {table.paid ? "✅ Betaald" : "⏳ Nog te betalen"}
                              </div>
                            </div>
                          )}

                          {table.status === "nog-niet-besteld" && (
                            <div className="text-orange-300 font-medium text-xs mt-1">🍽️ Wacht op bestelling</div>
                          )}

                          {/* Extra: Labels voor T5, T9 en T10 */}
                          {(table.id === 5 && table.status === "eten-geleverd") || (table.id === 9 && table.status === "eten-geleverd") ? (
                            <div className="text-green-400 font-bold text-xs flex items-center justify-start mt-2">
                              <span className="mr-1">✅</span> Eten geleverd
                            </div>
                          ) : null}
                          {table.id === 10 && hoveredTable === 10 ? (
                            <div className="text-green-400 font-bold text-xs flex items-center justify-start mt-2">
                              <span className="mr-1">✅</span> Bestelling geleverd
                            </div>
                          ) : null}
                          {/* Extra: Bestelling geleverd label bij T3, boven rekening */}
                          {table.id === 3 && (
                            <div className="text-green-400 font-bold text-xs flex items-center justify-start mb-2">
                              <span className="mr-1">✅</span> Bestelling geleverd
                            </div>
                          )}
                          {/* Extra: Tooltip label bij T8 zoals T4 (Beschikbaar) */}
                          {/* Extra: Bestelling nog niet geleverd label bij T8, zoals T6 */}
                          {table.id === 8 && table.status === "bezet" && (
                            <div className="text-yellow-400 font-bold text-xs flex items-center justify-start mb-2">
                              <span className="mr-1">🧑‍🍳</span> Bestelling nog niet geleverd
                            </div>
                          )}
                          {/* Extra: Bestelling nog niet geleverd label bij T9 wordt niet meer getoond omdat T9 nu eten-geleverd status heeft */}

                          {/* Extra: Bestelling nog niet geleverd label onderaan bij T6 */}
                          {table.id === 6 && table.status === "bezet" && (
                            <div className="text-yellow-400 font-bold text-xs flex items-center justify-start mt-2">
                              <span className="mr-1">🧑‍🍳</span> Bestelling nog niet geleverd
                            </div>
                          )}

                          <div className={`absolute ${arrowClasses}`}></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Zone status bars - binnen de frame */}
            <div className="grid grid-cols-3 gap-3 w-full">
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg border border-blue-500/30 p-3 shadow-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300 font-medium text-sm">Zone A</span>
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-white text-lg font-bold">83%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1 overflow-hidden">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: "83%" }}
                  />
                </div>
                <div className="text-gray-300 text-xs">Gem. wachttijd: 6m</div>
              </div>

              <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg border border-green-500/30 p-3 shadow-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300 font-medium text-sm">Zone B</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-white text-lg font-bold">75%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1 overflow-hidden">
                  <div
                    className="bg-green-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: "75%" }}
                  />
                </div>
                <div className="text-gray-300 text-xs">Gem. 3m</div>
              </div>

              <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg border border-purple-500/30 p-3 shadow-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300 font-medium text-sm">Zone C</span>
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-white text-lg font-bold">100%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1 overflow-hidden">
                  <div
                    className="bg-purple-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="text-gray-300 text-xs">Gereserveerd</div>
              </div>
            </div>
          </div>

          {/* Right side - Features - Naar beneden verplaatst en transparant onderkant */}
          <div className="space-y-4 flex flex-col justify-start h-full pb-2">
            <div className="bg-white/20 backdrop-blur-lg border border-white/40 rounded-2xl p-4 shadow-2xl relative overflow-hidden hover:bg-white/25 transition-all duration-300">
              <div className="flex items-start space-x-3 relative z-10">
                <div className="w-12 h-12 bg-gray-600/60 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-gray-400/60 hover:bg-gray-600/80 transition-all duration-300">
                  <span className="text-xl">⚙️</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 drop-shadow-sm">Slimme algoritmen</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">AI berekent de beste tafelindeling, zelfs tijdens piekmomenten</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/20 backdrop-blur-lg border border-blue-300/50 rounded-2xl p-4 shadow-2xl relative overflow-hidden hover:bg-blue-500/30 transition-all duration-300">
              <div className="flex items-start space-x-3 relative z-10">
                <div className="w-12 h-12 bg-blue-400/50 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-blue-200/60 hover:bg-blue-400/70 transition-all duration-300">
                  <span className="text-xl">📊</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 drop-shadow-sm">Capaciteit & wachttijd</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">Real-time voorspellingen op basis van bezetting en bestelhistoriek</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-500/20 backdrop-blur-lg border border-orange-300/50 rounded-2xl p-4 shadow-2xl relative overflow-hidden hover:bg-orange-500/30 transition-all duration-300">
              <div className="flex items-start space-x-3 relative z-10">
                <div className="w-12 h-12 bg-orange-400/50 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-orange-200/60 hover:bg-orange-400/70 transition-all duration-300">
                  <span className="text-xl">📍</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 drop-shadow-sm">Locatie gebaseerde service</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">Personeel ziet exact welke tafel wat nodig heeft</p>
                </div>
              </div>
            </div>

            <div className="bg-green-500/20 backdrop-blur-lg border border-green-300/50 rounded-2xl p-4 shadow-2xl relative overflow-hidden hover:bg-green-500/30 transition-all duration-300">
              <div className="flex items-start space-x-3 relative z-10">
                <div className="w-12 h-12 bg-green-400/50 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-green-200/60 hover:bg-green-400/70 transition-all duration-300">
                  <span className="text-xl">✅</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 drop-shadow-sm">Automatisch plannen</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">Reserveringen + walk-ins worden automatisch ingedeeld & bijgewerkt</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};