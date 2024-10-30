import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CustomLineChart({ data, timeframe, selectedVehicle }) {
  const getDayAbbreviation = (dateString) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const formatXAxis = (tickItem) => {
    if (timeframe === "days") {
      return getDayAbbreviation(tickItem);
    }
    return tickItem;
  };

  const fillMissingDays = (data) => {
    if (timeframe !== "days" || data.length === 0) return data;

    const filledData = [];
    const startDate = new Date(data[0].name);
    const endDate = new Date(data[data.length - 1].name);

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const existingData = data.find(
        (item) => new Date(item.name).toDateString() === d.toDateString()
      );
      if (existingData) {
        filledData.push(existingData);
      } else {
        filledData.push({
          name: d.toISOString().split("T")[0],
          [selectedVehicle]: 0,
        });
      }
    }
    return filledData;
  };

  // Sort the data chronologically and fill missing days
  const sortedData =
    data && data.length > 0
      ? [...data].sort((a, b) => new Date(a.name) - new Date(b.name))
      : [];
  const processedData = fillMissingDays(sortedData);

  const getLineColor = (vehicle) => {
    switch (vehicle) {
      case "scooters":
        return "#000000";
      case "bikes":
        return "#000000";
      case "skateboards":
        return "#000000";
      default:
        return "#000000";
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {processedData.length > 0 ? (
        <LineChart
          data={processedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid horizontal={true} vertical={false} stroke="#E5E7EB" />
          <XAxis
            dataKey="name"
            stroke="#000000"
            axisLine={false}
            tickLine={false}
            tickFormatter={formatXAxis}
            tick={{ fontWeight: "bold" }}
          />
          <YAxis
            stroke="#000000"
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tick={{ fontWeight: "bold" }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={selectedVehicle}
            name={
              selectedVehicle === "totalRentals"
                ? "Total Rentals"
                : selectedVehicle.charAt(0).toUpperCase() +
                  selectedVehicle.slice(1)
            }
            stroke={getLineColor(selectedVehicle)}
            strokeWidth={2}
            dot={{ r: 4, fill: getLineColor(selectedVehicle) }}
            activeDot={{
              r: 6,
              fill: "#FFFFFF",
              stroke: getLineColor(selectedVehicle),
              strokeWidth: 2,
            }}
          />
        </LineChart>
      ) : (
        <div>No data available</div>
      )}
    </ResponsiveContainer>
  );
}

export default CustomLineChart;
