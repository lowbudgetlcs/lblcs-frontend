import { db } from "../index";
import { divisions, performances, playerData, players, teams } from "../schema";

export async function getPlayers() {
  const allPlayers = await db.select().from(players);
  return allPlayers;
}

export async function getTeams() {
  const allTeams = await db.select().from(teams);
  return allTeams;
}

export async function getDivisions() {
  const allDivisions = await db.select().from(divisions);
  return allDivisions;
}

export async function getStats() {
  const allPlayerStats = await db.select().from(playerData);
  return allPlayerStats;
}

export async function getPerformances() {
  const allPlayerPerformances = await db.select().from(performances);
  return allPlayerPerformances;
}
