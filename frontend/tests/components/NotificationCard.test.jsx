import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, expect, test, describe } from "vitest";
import NotificationCard from "../../src/components/common/NotificationCard";

describe("NotificationCard", () => {
  test("renders notification content correctly", () => {
    const notification = {
      isRead: true,
      from: "John Doe",
      title: "Notification Title",
      body: "This is the body of the notification that should be truncated.",
    };

    render(<NotificationCard notification={notification} />);

    expect(screen.getByText("Notification Title")).toBeDefined();
    // expect(
    //   screen.getByText(
    //     "This is the body of the notification that should be truncated."
    //   )
    // ).toBeDefined();
  });

  test("applies correct styles based on isRead prop", () => {
    const notification = {
      isRead: false,
      from: "John Doe",
      title: "Unread Notification",
      body: "Body",
    };

    const { container } = render(
      <NotificationCard notification={notification} />
    );
    const card = container.firstChild;

    // Check for unread styles
    expect(card.classList.contains("bg-gray-100")).toBe(true);
    expect(card.classList.contains("font-bold")).toBe(true);

    // Update the notification to read
    notification.isRead = true;
    const { container: updatedContainer } = render(
      <NotificationCard notification={notification} />
    );
    const updatedCard = updatedContainer.firstChild;

    // Check for read styles
    expect(updatedCard.classList.contains("bg-white")).toBe(true);
  });

  //   test("handles onClick event", () => {
  //     const notification = {
  //       isRead: true,
  //       from: "John Doe",
  //       title: "Notification Title",
  //       body: "Body",
  //     };
  //     const handleClick = vi.fn();

  //     render(
  //       <NotificationCard notification={notification} onClick={handleClick} />
  //     );

  //     const titleElements = screen.queryAllByText("Notification Title");
  //     if (titleElements.length > 0) {
  //       fireEvent.click(titleElements[0]); // Click the first matching element
  //     }
  //     expect(handleClick).toHaveBeenCalled();
  //   });

  test("handles onDelete event", () => {
    const notification = {
      isRead: true,
      from: "John Doe",
      title: "Notification Title",
      body: "Body",
    };
    const handleDelete = vi.fn();

    render(
      <NotificationCard notification={notification} onDelete={handleDelete} />
    );

    const deleteButtons = screen.queryAllByText("Delete");
    if (deleteButtons.length > 0) {
      fireEvent.click(deleteButtons[0]); // Click the first delete button
    }
    expect(handleDelete).toHaveBeenCalled();
  });

  //   test("stops propagation of onDelete click event", () => {
  //     const notification = {
  //       isRead: true,
  //       from: "John Doe",
  //       title: "Notification Title",
  //       body: "Body",
  //     };
  //     const handleClick = vi.fn();
  //     const handleDelete = vi.fn();

  //     render(
  //       <NotificationCard
  //         notification={notification}
  //         onClick={handleClick}
  //         onDelete={handleDelete}
  //       />
  //     );

  //     const deleteButtons = screen.queryAllByText("Delete");
  //     if (deleteButtons.length > 0) {
  //       fireEvent.click(deleteButtons[0]); // Click the first delete button
  //     }

  //     // Check if onDelete is called
  //     expect(handleDelete).toHaveBeenCalled();

  //     // Check if onClick of the card is not called
  //     expect(handleClick).not.toHaveBeenCalled();
  //   });
});
