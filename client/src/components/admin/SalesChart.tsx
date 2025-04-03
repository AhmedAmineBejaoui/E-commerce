import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

// Sample data for the chart
const generateSampleData = () => {
  const months = [
    "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
    "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"
  ];
  
  const currentMonth = new Date().getMonth();
  const last12Months = [];
  
  for (let i = 0; i < 12; i++) {
    const monthIndex = (currentMonth - 11 + i) % 12;
    const month = months[monthIndex >= 0 ? monthIndex : monthIndex + 12];
    
    // Generate random sales data with some trend
    const salesValue = 1000 + Math.floor(Math.random() * 3000) + (i * 200);
    const ordersValue = 10 + Math.floor(Math.random() * 40) + (i * 2);
    
    last12Months.push({
      name: month,
      sales: salesValue,
      orders: ordersValue,
    });
  }
  
  return last12Months;
};

export default function SalesChart() {
  const [data, setData] = useState<any[]>([]);
  const [period, setPeriod] = useState<"1M" | "3M" | "6M" | "1Y">("1Y");
  
  useEffect(() => {
    const sampleData = generateSampleData();
    
    // Filter data based on selected period
    const filteredData = sampleData.slice(
      period === "1M" ? -1 :
      period === "3M" ? -3 :
      period === "6M" ? -6 :
      -12
    );
    
    setData(filteredData);
  }, [period]);

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Évolution des ventes</h3>
          <div className="flex space-x-2">
            <Button 
              variant={period === "1M" ? "default" : "outline"} 
              size="sm"
              onClick={() => setPeriod("1M")}
            >
              1M
            </Button>
            <Button 
              variant={period === "3M" ? "default" : "outline"} 
              size="sm"
              onClick={() => setPeriod("3M")}
            >
              3M
            </Button>
            <Button 
              variant={period === "6M" ? "default" : "outline"} 
              size="sm"
              onClick={() => setPeriod("6M")}
            >
              6M
            </Button>
            <Button 
              variant={period === "1Y" ? "default" : "outline"} 
              size="sm"
              onClick={() => setPeriod("1Y")}
            >
              1A
            </Button>
          </div>
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis 
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}€`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === "sales") return [`${value} €`, "Ventes"];
                  if (name === "orders") return [value, "Commandes"];
                  return [value, name];
                }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                fill="rgba(59, 130, 246, 0.2)"
                stroke="rgb(59, 130, 246)"
                activeDot={{ r: 8 }}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                fill="rgba(139, 92, 246, 0.2)"
                stroke="rgb(139, 92, 246)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
