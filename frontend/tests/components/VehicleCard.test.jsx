import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, expect, test, describe } from "vitest";
import VehicleCard from "../../src/components/common/VehicleCard";

// Mock the imported images
vi.mock("../../assets/bike.svg", () => ({ default: "bike.svg" }));
vi.mock("../../assets/scooter.svg", () => ({ default: "scooter.svg" }));
vi.mock("../../assets/skateBoard.svg", () => ({ default: "skateBoard.svg" }));
vi.mock("../../assets/bus.png", () => ({ default: "bus.png" }));

describe("VehicleCard", () => {
  const defaultProps = {
    type: "Bikes",
    registration: "ABC123",
    make: "Giant",
    model: "Defy",
    year: "2022",
    location: "Main Street",
    onClick: vi.fn(),
  };

  test("renders VehicleCard with correct content", () => {
    render(<VehicleCard {...defaultProps} />);

    expect(screen.getByAltText("Bikes")).toBeDefined();
    expect(screen.getByText("Giant")).toBeDefined();
    expect(screen.getByText("ABC123")).toBeDefined();
    expect(screen.getByText("Giant Defy")).toBeDefined();
    expect(screen.getByText("2022")).toBeDefined();
    expect(screen.getByText("Main Street")).toBeDefined();
  });

  //   test("calls onClick when card is clicked", () => {
  //     render(<VehicleCard {...defaultProps} />);

  //     // Get the card element by its text
  //     const cards = screen
  //       .getAllByText("Giant")
  //       .map((element) => element.closest(".vehicle-card"));

  //     // Ensure that there is only one card
  //     expect(cards.length).toBe(1);

  //     // Click the card
  //     const card = cards[0];
  //     fireEvent.click(card);

  //     expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  //   });

  test.each([
    ["Bikes", "bike.svg"],
    ["Scooters", "scooter.svg"],
    ["Skateboards", "skateBoard.svg"],
    ["Buses", "bus.png"],
  ])("displays correct image for %s", (type, expectedImage) => {
    render(<VehicleCard {...defaultProps} type={type} />);

    const images = screen.getAllByAltText(type);
    expect(images.length).toBeGreaterThan(0); // Ensure there is at least one matching image

    images.forEach((image) => {
      expect(image.src).toContain(expectedImage);
    });
  });

  //   test("handles unknown vehicle type", () => {
  //     render(<VehicleCard {...defaultProps} type="Unknown" />);

  //     const image = screen.queryByAltText("Unknown");
  //     expect(image).toBeNull();
  //   });
});
