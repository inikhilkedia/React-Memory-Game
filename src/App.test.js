import React, { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

test("renders memory game title", () => {
  render(<App />);
  const titleElement = screen.getByText(/Nextdoor: Memory Game/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders all cards initially as not flipped", () => {
  render(<App />);
  const cardElements = screen.getAllByText("?");
  expect(cardElements.length).toBe(16); // 8 pairs of cards
});

test("flips a card when clicked", () => {
  render(<App />);
  const cardElements = screen.getAllByText("?");
  fireEvent.click(cardElements[0]);
  expect(cardElements[0].textContent).not.toBe("?");
});

test("matches a pair of cards", () => {
  render(<App />);
  const cardElements = screen.getAllByText("?");

  const firstCardIndex = cardElements.findIndex(
    (card) => card.textContent === "?"
  );
  fireEvent.click(cardElements[firstCardIndex]);
  const firstCardContent = cardElements[firstCardIndex].textContent;

  const secondCardIndex = cardElements.findIndex(
    (card, index) =>
      card.textContent === firstCardContent && index !== firstCardIndex
  );
  fireEvent.click(cardElements[secondCardIndex]);

  expect(cardElements[firstCardIndex].textContent).toBe(firstCardContent);
  expect(cardElements[secondCardIndex].textContent).toBe(firstCardContent);
});

test("does not match a pair of cards", () => {
  render(<App />);
  const cardElements = screen.getAllByText("?");

  const firstCardIndex = cardElements.findIndex(
    (card) => card.textContent === "?"
  );
  fireEvent.click(cardElements[firstCardIndex]);
  const firstCardContent = cardElements[firstCardIndex].textContent;

  const secondCardIndex = cardElements.findIndex(
    (card, index) =>
      card.textContent !== firstCardContent && index !== firstCardIndex
  );
  fireEvent.click(cardElements[secondCardIndex]);

  expect(cardElements[firstCardIndex].textContent).toBe(firstCardContent);
  expect(cardElements[secondCardIndex].textContent).not.toBe(firstCardContent);

  // Wait for the timeout to reset cards
  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(cardElements[firstCardIndex].textContent).toBe("?");
  expect(cardElements[secondCardIndex].textContent).toBe("?");
});

test("displays win message when all pairs are matched", () => {
  render(<App />);
  const cardElements = screen.getAllByText("?");

  // Utility function to simulate matching all pairs
  const matchAllPairs = () => {
    const cardContents = {};
    cardElements.forEach((card) => {
      fireEvent.click(card);
      const content = card.textContent;
      if (cardContents[content]) {
        fireEvent.click(cardContents[content]);
      } else {
        cardContents[content] = card;
      }
    });
  };

  act(() => {
    matchAllPairs();
    jest.advanceTimersByTime(1000);
  });

  const winMessage = screen.getByText(/You Win!/i);
  expect(winMessage).toBeInTheDocument();
});

test("resets the game when reset button is clicked", () => {
  render(<App />);
  const cardElements = screen.getAllByText("?");

  // Flip a card
  fireEvent.click(cardElements[0]);
  expect(cardElements[0].textContent).not.toBe("?");

  // Click the reset button
  const resetButton = screen.getByText(/Reset Game/i);
  fireEvent.click(resetButton);

  // All cards should be reset to "?"
  const resetCardElements = screen.getAllByText("?");
  expect(resetCardElements.length).toBe(16); // 8 pairs of cards
});

test("increments attempts when a pair of cards is flipped", () => {
  render(<App />);
  const cardElements = screen.getAllByText("?");

  // Click two different cards
  fireEvent.click(cardElements[0]);
  fireEvent.click(cardElements[1]);

  // Check that attempts is incremented
  const scoreElement = screen.getByText(/Attempts: 1/i);
  expect(scoreElement).toBeInTheDocument();
});

test("updates high score when a new high score is achieved", () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/Enter your name/i);
  fireEvent.change(inputElement, { target: { value: "Tester" } });

  const cardElements = screen.getAllByText("?");
  const firstCardIndex = cardElements.findIndex(
    (card) => card.textContent === "?"
  );
  fireEvent.click(cardElements[firstCardIndex]);
  const firstCardContent = cardElements[firstCardIndex].textContent;
  const secondCardIndex = cardElements.findIndex(
    (card, index) =>
      card.textContent === firstCardContent && index !== firstCardIndex
  );
  fireEvent.click(cardElements[secondCardIndex]);

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  const winMessage = screen.getByText(/You Win!/i);
  expect(winMessage).toBeInTheDocument();

  const highScoreElement = screen.getByText(/High Score: Tester - 1 attempts/i);
  expect(highScoreElement).toBeInTheDocument();
});
