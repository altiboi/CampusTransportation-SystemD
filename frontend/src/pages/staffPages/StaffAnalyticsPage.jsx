// pages/StaffAnalyticsPage.js
import React from "react";
import MobileHeader from "../../components/common/MobileHeader";
import PieChart from "../../components/PieChart";
import Card from "../../components/Card";
import { useAppContext } from "../../contexts/AppContext";
import { useEffect } from "react";

function StaffAnalyticsPage() {
  const { setTitle, setTask } = useAppContext();

  useEffect(() => {
    setTitle("Analytics");
    setTask(0);
  }, [setTitle, setTask]);
  return (
    <div className="flex flex-col h-screen">
      {/* Flex column with full height */}

      {/* Add padding top to avoid overlapping with the header */}
      <div className="flex-1 overflow-y-auto p-4 pt-16">
        {/* Add pt-16 to account for the header's height */}
        {/* Container for the cards */}
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Card className="w-64 h-64 p-4 flex flex-col items-center">
            <div className="text-sm font-semibold mb-4 text-center">
              Vehicle Usage 1
            </div>
            <div className="w-48 h-48">
              {" "}
              {/* Adjust the width and height */}
              <PieChart className="w-full h-full" />
            </div>
          </Card>

          <Card className="w-64 h-64 p-4 flex flex-col items-center">
            <div className="text-sm font-semibold mb-4 text-center">
              Vehicle Usage 2
            </div>
            <div className="w-48 h-48">
              {" "}
              {/* Adjust the width and height */}
              <PieChart className="w-full h-full" />
            </div>
          </Card>
        </div>

        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Card className="w-64 h-64 p-4 flex flex-col items-center">
            <div className="text-sm font-semibold mb-4 text-center">
              Vehicle Usage 1
            </div>
            <div className="w-48 h-48">
              {" "}
              {/* Adjust the width and height */}
              <PieChart className="w-full h-full" />
            </div>
          </Card>

          <Card className="w-64 h-64 p-4 flex flex-col items-center">
            <div className="text-sm font-semibold mb-4 text-center">
              Vehicle Usage 2
            </div>
            <div className="w-48 h-48">
              {" "}
              {/* Adjust the width and height */}
              <PieChart className="w-full h-full" />
            </div>
          </Card>
        </div>
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Card className="w-64 h-64 p-4 flex flex-col items-center">
            <div className="text-sm font-semibold mb-4 text-center">
              Vehicle Usage 1
            </div>
            <div className="w-48 h-48">
              {" "}
              {/* Adjust the width and height */}
              <PieChart className="w-full h-full" />
            </div>
          </Card>

          <Card className="w-64 h-64 p-4 flex flex-col items-center">
            <div className="text-sm font-semibold mb-4 text-center">
              Vehicle Usage 2
            </div>
            <div className="w-48 h-48">
              {" "}
              {/* Adjust the width and height */}
              <PieChart className="w-full h-full" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StaffAnalyticsPage;
