import React, { useEffect, useState } from "react";
import MobileHeader from "../../components/common/MobileHeader";
import PieChart from "../../components/PieChart";
import CustomBarChart from "../../components/CustomBarChart";
import Card from "../../components/Card";
import ProgressCircle from "../../components/ProgressCircle";
import { useAppContext } from "../../contexts/AppContext";
import scooter from "../../assets/scooter.svg";
import skateboard from "../../assets/skateBoard.svg";
import bike from "../../assets/bike.svg";
import { getAllVehicles, getAllRentals, getAllFines } from "../../api/functions";
import CustomLineChart from "../../components/CustomLineChart";

function StaffAnalyticsPage({ vehicles }) {
  const { setTitle, setTask } = useAppContext();
  const [vehicleData, setVehicleData] = useState({
    scooter: { total: 0, used: 0 },
    bike: { total: 0, used: 0 },
    skateboard: { total: 0, used: 0 },
  });
  const [allRentals, setAllRentals] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [timeframe, setTimeframe] = useState("days");
  const [selectedVehicle, setSelectedVehicle] = useState("totalRentals");
  const [finesChartData, setFinesChartData] = useState([]);
  const [finesData, setFinesData] = useState([]);

  useEffect(() => {
    setTitle("Analytics");
    setTask(0);

    // Fetch vehicles and rentals when component mounts
    fetchVehiclesAndRentals();
    fetchFinesData();
  }, [setTitle, setTask]);

  const fetchVehiclesAndRentals = async () => {
    try {
      // Count vehicles based on type and availability
      const vehicleCounts = vehicles.reduce(
        (acc, vehicle) => {
          const type = vehicle.type?.toLowerCase();
          if (!acc[type]) {
            acc[type] = { total: 0, used: 0 };
          }
          acc[type].total += 1;
          if (vehicle.currentRentalID) {
            acc[type].used += 1;
          }
          return acc;
        },
        {
          scooter: { total: 0, used: 0 },
          bike: { total: 0, used: 0 },
          skateboard: { total: 0, used: 0 },
        }
      );
      setVehicleData(vehicleCounts);

      // Fetch all rentals
      const rentals = await getAllRentals();
      setAllRentals(rentals);
      processRentalsByTimeframe(rentals);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchFinesData = async () => {
    try {
        const fines = await getAllFines();
        setFinesData(fines);
        const categorizedFines = fines.reduce((acc, fine) => {
            const vehicleType = fine.vehicleType.toLowerCase();
            if (!acc[vehicleType]) {
                acc[vehicleType] = { paidFines: 0, unpaidFines: 0 };
            }
            if (fine.paid) {
                acc[vehicleType].paidFines += fine.amount;
            } else {
                acc[vehicleType].unpaidFines += fine.amount;
            }
            return acc;
        }, {
            scooter: { paidFines: 0, unpaidFines: 0 },
            bike: { paidFines: 0, unpaidFines: 0 },
            skateboard: { paidFines: 0, unpaidFines: 0 },
        });

        const finesData = [
            { name: "Scooters", ...categorizedFines.scooter },
            { name: "Bikes", ...categorizedFines.bike },
            { name: "Skateboards", ...categorizedFines.skateboard },
        ];

        setFinesChartData(finesData);
    } catch (error) {
        console.error("Error fetching fines data:", error);
    }
  };

  useEffect(() => {
    processRentalsByTimeframe(allRentals);
  }, [timeframe, allRentals]);

  const processRentalsByTimeframe = (rentals) => {
    // Sort rentals by date
    const sortedRentals = rentals.sort(
      (a, b) => new Date(a.rentedAt) - new Date(b.rentedAt)
    );

    const rentalsByTimeframe = sortedRentals.reduce((acc, rental) => {
      let rentedTime;

      // Determine time grouping based on selected timeframe
      switch (timeframe) {
        case "days":
          rentedTime = new Date(rental.rentedAt).toISOString().slice(0, 10);
          break;
        case "weeks":
          const date = new Date(rental.rentedAt);
          const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
          const daysSinceStartOfYear = Math.floor(
            (date - firstDayOfYear) / (24 * 60 * 60 * 1000)
          );
          const week = Math.ceil(
            (daysSinceStartOfYear + firstDayOfYear.getDay() + 1) / 7
          );
          rentedTime = `${date.getFullYear()}-W${week}`;
          break;
        case "months":
        default:
          rentedTime = new Date(rental.rentedAt).toLocaleString("default", {
            month: "long",
            year: "numeric",
          });
          break;
      }

      if (!acc[rentedTime]) {
        acc[rentedTime] = {
          scooter: 0,
          bike: 0,
          skateboard: 0,
          totalRentals: 0,
        };
      }

      const rentalType = rental.type.toLowerCase();
      if (acc[rentedTime][rentalType] !== undefined) {
        acc[rentedTime][rentalType] += 1;
        acc[rentedTime].totalRentals += 1;
      }

      return acc;
    }, {});

    console.log(rentalsByTimeframe);

    // Add demo fines data
    const chartData = Object.keys(rentalsByTimeframe).map((time) => ({
      name: time,
      scooters: rentalsByTimeframe[time].scooter,
      bikes: rentalsByTimeframe[time].bike,
      skateboards: rentalsByTimeframe[time].skateboard,
      totalRentals: rentalsByTimeframe[time].totalRentals,
      fines: Math.floor(Math.random() * 100), // Random fines data between 0 and 100
    }));

    setBarChartData(chartData);
    setLineChartData(chartData);
  };

  const calculatePercentage = (used, total) =>
    total === 0 ? 0 : ((used / total) * 100).toFixed(2);

  const pieChartData = [
    { name: "Scooters", value: vehicleData.scooter.used },
    { name: "Bikes", value: vehicleData.bike.used },
    { name: "Skateboards", value: vehicleData.skateboard.used },
  ];

  // Mapping images to vehicle types
  const vehicleImages = {
    scooter: scooter,
    bike: bike,
    skateboard: skateboard,
  };

  //console.log(vehicleData);
  //console.log(barChartData);

  return (
    <div className="flex flex-col h-screen">
      <MobileHeader />
      <div className="flex-1 overflow-y-auto p-4 pt-16">
        <div className="flex flex-wrap gap-4 pb-20 justify-center pt-4">
          {/* Line chart for rentals */}
          <Card className="w-full p-4 bg-white">
            <div className="flex items-center mr-20 mb-4">
              <div className="text-sm font-semibold mr-4">Rentals:</div>
              {["totalRentals", "scooters", "bikes", "skateboards"].map(
                (vehicle) => (
                  <label
                    key={vehicle}
                    className={`mr-4 cursor-pointer ${
                      selectedVehicle === vehicle
                        ? "font-bold text-black"
                        : "text-gray-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="vehicleType"
                      value={vehicle}
                      checked={selectedVehicle === vehicle}
                      onChange={() => setSelectedVehicle(vehicle)}
                      className="hidden"
                    />
                    {vehicle === "totalRentals"
                      ? "All"
                      : vehicle.charAt(0).toUpperCase() + vehicle.slice(1)}
                  </label>
                )
              )}
            </div>
            {/* Timeframe selection buttons */}
            <div className="flex justify-center mb-4">
              <button
                className={`mx-2 p-2 ${
                  timeframe === "days" ? "bg-black text-white" : "bg-gray-200"
                }`}
                onClick={() => setTimeframe("days")}
              >
                Days
              </button>
              <button
                className={`mx-2 p-2 ${
                  timeframe === "weeks" ? "bg-black text-white" : "bg-gray-200"
                }`}
                onClick={() => setTimeframe("weeks")}
              >
                Weeks
              </button>
              <button
                className={`mx-2 p-2 ${
                  timeframe === "months" ? "bg-black text-white" : "bg-gray-200"
                }`}
                onClick={() => setTimeframe("months")}
              >
                Months
              </button>
            </div>
            <div className="w-full h-64">
              <CustomLineChart
                data={lineChartData}
                timeframe={timeframe}
                selectedVehicle={selectedVehicle}
              />
            </div>
          </Card>

          {/* Card for each vehicle type */}
          {Object.keys(vehicleData).map((vehicle) => {
            const data = vehicleData[vehicle];
            const percentage = calculatePercentage(data.used, data.total);
            return (
              <Card key={vehicle} className="flex-grow max-w-xs bg-white p-4">
                <div className="text-lg font-semibold mb-2 text-center">
                  {vehicle.charAt(0).toUpperCase() + vehicle.slice(1)} Usage
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src={vehicleImages[vehicle]}
                    alt={`${vehicle} icon`}
                    className="w-16 h-16 mb-2"
                  />
                  <ProgressCircle percentage={percentage} size={120} />
                  <div className="mt-2">
                    {data.used}/{data.total} Currently In Use
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Pie chart for vehicle usage */}
          <Card className="flex-grow max-w-sm bg-white p-4">
            <div className="text-sm font-semibold mb-4 text-center">
              Vehicle Usage Breakdown
            </div>
            <PieChart data={pieChartData} />
          </Card>

          {/* Bar chart for fines */}
          <Card className="w-full p-4 bg-white">
            <div className="text-lg font-semibold mb-4">Fines Overview</div>
            <div className="w-full h-64">
              <CustomBarChart chartData={finesChartData} fines={finesData}/>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StaffAnalyticsPage;
