import { type Match } from "../../db/schema";
import { v4 as uuidv4 } from "uuid";

// Get current year
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

// Match data seed
export const matchSeed: Match[] = [
  // Constellation from date 1 - 20
  ...Array.from({ length: 13 }, (_, i) => i).map((i) => {
    return {
      id: uuidv4(),
      mode: "constellation",
      createdAt: new Date(currentYear, currentMonth, i + 1),
      result: "correct",
      userId: "74607127-c007-4a95-bb74-857e931a205f",
      astronomicalObjectId: "fd08b640-e009-4801-9f0a-2e042bbbfc89",
    } as Match;
  }),
  ...Array.from({ length: 7 }, (_, i) => i + 13).map((i) => {
    return {
      id: uuidv4(),
      mode: "constellation",
      createdAt: new Date(currentYear, currentMonth, i + 1),
      result: "incorrect",
      userId: "74607127-c007-4a95-bb74-857e931a205f",
      astronomicalObjectId: "fd08b640-e009-4801-9f0a-2e042bbbfc89",
    } as Match;
  }),
  // Messier from date 9 - 28
  ...Array.from({ length: 15 }, (_, i) => i + 8).map((i) => {
    return {
      id: uuidv4(),
      mode: "messier",
      createdAt: new Date(currentYear, currentMonth, i + 1),
      result: "correct",
      userId: "74607127-c007-4a95-bb74-857e931a205f",
      astronomicalObjectId: "01efd3b4-d985-4d29-ad55-ee2342cfe9a8",
    } as Match;
  }),
  ...Array.from({ length: 5 }, (_, i) => i + 23).map((i) => {
    return {
      id: uuidv4(),
      mode: "messier",
      createdAt: new Date(currentYear, currentMonth, i + 1),
      result: "incorrect",
      userId: "74607127-c007-4a95-bb74-857e931a205f",
      astronomicalObjectId: "01efd3b4-d985-4d29-ad55-ee2342cfe9a8",
    } as Match;
  }),
  // Test user 1 constellation corrects i = 40 - 44
  ...Array.from({ length: 5 }, (_, i) => i).map((i) => {
    return {
      id: uuidv4(),
      mode: "constellation",
      createdAt: new Date(2023, 10, 1),
      result: "correct",
      userId: "user-1",
      astronomicalObjectId: "fd08b640-e009-4801-9f0a-2e042bbbfc89",
    } as Match;
  }),
  // Test user 2 constellation corrects i = 45 - 48
  ...Array.from({ length: 4 }, (_, i) => i).map((i) => {
    return {
      id: uuidv4(),
      mode: "constellation",
      createdAt: new Date(2023, 10, 1),
      result: "correct",
      userId: "user-2",
      astronomicalObjectId: "fd08b640-e009-4801-9f0a-2e042bbbfc89",
    } as Match;
  }),
  // Test user 3 constellation corrects i = 49 - 51
  ...Array.from({ length: 3 }, (_, i) => i).map((i) => {
    return {
      id: uuidv4(),
      mode: "constellation",
      createdAt: new Date(2023, 10, 1),
      result: "correct",
      userId: "user-3",
      astronomicalObjectId: "fd08b640-e009-4801-9f0a-2e042bbbfc89",
    } as Match;
  }),
  // Test user 4 constellation correct i = 52 - 53
  ...Array.from({ length: 2 }, (_, i) => i).map((i) => {
    return {
      id: uuidv4(),
      mode: "constellation",
      createdAt: new Date(2023, 10, 1),
      result: "correct",
      userId: "user-4",
      astronomicalObjectId: "fd08b640-e009-4801-9f0a-2e042bbbfc89",
    } as Match;
  }),
  // Test user 5 messier corrects i = 54 - 58
  ...Array.from({ length: 5 }, (_, i) => i).map((i) => {
    return {
      id: uuidv4(),
      mode: "messier",
      createdAt: new Date(2023, 10, 1),
      result: "correct",
      userId: "user-5",
      astronomicalObjectId: "01efd3b4-d985-4d29-ad55-ee2342cfe9a8",
    } as Match;
  }),
  // Test user 6 messier corrects i = 59 - 62
  ...Array.from({ length: 4 }, (_, i) => i).map((i) => {
    return {
      id: uuidv4(),
      mode: "messier",
      createdAt: new Date(2023, 10, 1),
      result: "correct",
      userId: "user-6",
      astronomicalObjectId: "01efd3b4-d985-4d29-ad55-ee2342cfe9a8",
    } as Match;
  }),
  // Test user 7 messier corrects i = 63 - 65
  ...Array.from({ length: 3 }, (_, i) => i).map((i) => {
    return {
      id: uuidv4(),
      mode: "messier",
      createdAt: new Date(2023, 10, 1),
      result: "correct",
      userId: "user-7",
      astronomicalObjectId: "01efd3b4-d985-4d29-ad55-ee2342cfe9a8",
    } as Match;
  }),
  // Test user 8 messier correct i = 66 - 67
  ...Array.from({ length: 2 }, (_, i) => i).map((i) => {
    return {
      id: uuidv4(),
      mode: "messier",
      createdAt: new Date(2023, 10, 1),
      result: "correct",
      userId: "user-8",
      astronomicalObjectId: "01efd3b4-d985-4d29-ad55-ee2342cfe9a8",
    } as Match;
  }),
];
