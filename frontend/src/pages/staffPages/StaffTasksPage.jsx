// StaffHomePage.js

import MobileHeader from "../../components/common/MobileHeader";

function StaffTasksPage() {
  return (
    <div className="flex flex-col h-screen">
      {/* Flex column with full height */}
      <MobileHeader title={"Tasks"} />
      {/* Add padding top to avoid overlapping with the header */}
      <div className="flex-1 overflow-y-auto p-4 pt-16">
        {/* Add pt-16 to account for the header's height */}
        <div>Tasks</div>
      </div>
    </div>
  );
}

export default StaffTasksPage;
