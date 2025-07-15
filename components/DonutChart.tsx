"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "Velo V2 USDC+USDD", value: 30, color: "#7ed957" },
  { name: "USDT ERC20", value: 20, color: "#8664ff" },
  { name: "Ethereum", value: 10.02, color: "#57c0ff" },
  { name: "Ethereum", value: 10.02, color: "#57c0ff" },
  { name: "USDT ERC20", value: 9.93, color: "#8664ff" },
  { name: "USDC", value: 5.89, color: "#d9d9d9" },
  { name: "Velo V2 USDC+USDD", value: 3.93, color: "#7ed957" },
  { name: "DAI", value: 3.0, color: "#5871f5" },
];

const renderLegend = () => {
  return (
    <div className="text-sm text-white">
      {data.map((entry, index) => (
        <div key={index} className="flex justify-between items-center py-1">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.name}</span>
          </div>
          <span className="text-gray-400">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
};

export function DonutChartWithLegend() {
  return (
    <div className="grid md:grid-cols-2 gap-6 bg-[#171717] p-6 rounded-xl w-full max-w-3xl">
      {/* Chart */}
      <div className="w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={50}
              outerRadius={100}
              paddingAngle={4}
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#1e1e1e", border: "none", borderRadius: "6px" }}
              itemStyle={{ color: "#fff" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-col justify-center">{renderLegend()}</div>
    </div>
  );
}
