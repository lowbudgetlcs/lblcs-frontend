import { useState, useEffect } from "react";
type FetchError = Error & { message: string };

export interface PlayerProps {
  id: number;
  primaryRiotId: string;
  teamId?: number;
  summonerName: string;
}

export interface TeamProps {
  id: number;
  teamName: string;
  divisionId: number;
  groupId: string;
  captainId: number | null;
  logo: string | null;
  playerList: string[];
}

export interface DivisionProps {
  id: number;
  divisionName: string;
  description: string | null;
  providerId: number;
  tournamentId: number;
  groups: number;
}

export interface StatProps {
    id: number;
    kills: number;
    deaths: number;
    assists: number;
    level: number;
    gold: number;
    visionScore: number;
    damage: number;
    healing: number;
    shielding: number;
    damageTaken: number;
    selfMitigatedDamage: number;
    damageToTurrets: number;
    longestLife: number;
    doubleKills: number;
    tripleKills: number;
    quadraKills: number;
    pentaKills: number;
    gameLength: number;
    win: number;
    cs: number;
    championName: Text;
    teamKills: number;
    shortCode: Text;
    performanceId: number | null;

}

export interface PerformanceProps {
  id: number;
  teamId: number | null;
  playerId: number | null;
  divisionId: number | null;
  gameId: number | null;
}

export const useFetchData = () => {
  const [players, setPlayers] = useState<PlayerProps[]>([]);
  const [teams, setTeams] = useState<TeamProps[]>([]);
  const [divisions, setDivisions] = useState<DivisionProps[]>([]);
  const [stats, setStats] = useState<StatProps[]>([]);
  const [performance, setPerformance] = useState<PerformanceProps[]>([])
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersResponse, teamsResponse, divisionsResponse, statsResponse, performancesResponse] = await Promise.all([
          fetch("https://backend.lowbudgetlcs.com/api/getPlayers"),
          fetch("https://backend.lowbudgetlcs.com/api/getTeams"),
          fetch("https://backend.lowbudgetlcs.com/api/getDivisions"),
          fetch("https://backend.lowbudgetlcs.com/api/getStats"),
          fetch("https://backend.lowbudgetlcs.com/api/getPerformances"),

        ]);

        if (!playersResponse.ok || !teamsResponse.ok || !divisionsResponse.ok || !statsResponse.ok || !performancesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [playersData, teamsData, divisionsData, statsData, performanceData] = await Promise.all([
          playersResponse.json() as Promise<PlayerProps[]>,
          teamsResponse.json() as Promise<TeamProps[]>,
          divisionsResponse.json() as Promise<DivisionProps[]>,
          statsResponse.json() as Promise<StatProps[]>,
          performancesResponse.json(), 
        ]);

        setPlayers(playersData);
        setTeams(teamsData);
        setDivisions(divisionsData);
        setStats(statsData);
        setPerformance(performanceData);
      } catch (err) {
        const error = err as FetchError;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { players, teams, divisions, stats, performance, error, loading };
};
