import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { vi, expect, test, describe, afterEach } from "vitest";
import BusScheduleCard from "../../src/components/common/BusScheduleCard";

// Mocking the Date object to control the current time
const mockDate = (date) => {
  const RealDate = Date;
  global.Date = class extends RealDate {
    constructor(...args) {
      if (args.length) return super(...args);
      return new RealDate(date);
    }
  };
};

describe("BusScheduleCard", () => {
  afterEach(() => {
    // Restore the original Date object
    global.Date = Date;
  });

  test("should render with given props", () => {
    mockDate("2024-09-17T12:00:00Z"); // Mocking current time
    render(
      <BusScheduleCard
        stopName="Main Stop"
        startTime="08:00"
        endTime="18:00"
        frequency="15"
        direction="North"
      />
    );

    expect(screen.getByText(/Main Stop/i)).toBeDefined();
    expect(screen.getByText(/Next bus in:/i)).toBeDefined();
    expect(screen.getByText(/08:00 - 18:00/i)).toBeDefined();
    expect(screen.getByText(/Direction: North/i)).toBeDefined();
  });

  //   test("should calculate and display time remaining correctly", async () => {
  //     mockDate("2024-09-17T12:05:00Z"); // Mocking current time
  //     render(
  //       <BusScheduleCard
  //         stopName="Main Stop"
  //         startTime="12:00"
  //         endTime="18:00"
  //         frequency="15"
  //         direction="North"
  //       />
  //     );

  //     // Use queryAllByText to handle multiple elements
  //     const busTextElements = screen.getAllByText(/Next bus in:/i);
  //     expect(busTextElements.length).toBe(1); // Expect only one element

  //     // Expect the initial time remaining to be calculated
  //     expect(busTextElements[0]).toHaveTextContent("10:00"); // Assuming the next bus is in 10 minutes

  //     // Wait for the interval to update (approximately 1 minute later)
  //     await waitFor(
  //       () => {
  //         expect(busTextElements[0]).toHaveTextContent("09:00"); // Adjust based on frequency
  //       },
  //       { timeout: 70000 }
  //     ); // Adjust timeout if necessary
  //   });

  test("should clear interval on unmount", () => {
    mockDate("2024-09-17T12:00:00Z"); // Mocking current time
    const { unmount } = render(
      <BusScheduleCard
        stopName="Main Stop"
        startTime="08:00"
        endTime="18:00"
        frequency="15"
        direction="North"
      />
    );

    const spy = vi.spyOn(global, "clearInterval");
    unmount();
    expect(spy).toHaveBeenCalled();
  });
});
