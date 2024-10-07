import { pgTable, foreignKey, serial, integer, bigint, smallint, boolean, text, varchar, unique, type AnyPgColumn, index, char, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const playerData = pgTable("player_data", {
	id: serial().primaryKey().notNull(),
	kills: integer().default(0).notNull(),
	deaths: integer().default(0).notNull(),
	assists: integer().default(0).notNull(),
	level: integer().default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	gold: bigint({ mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	visionScore: bigint("vision_score", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	damage: bigint({ mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	healing: bigint({ mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	shielding: bigint({ mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	damageTaken: bigint("damage_taken", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	selfMitigatedDamage: bigint("self_mitigated_damage", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	damageToTurrets: bigint("damage_to_turrets", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	longestLife: bigint("longest_life", { mode: "number" }).default(0).notNull(),
	doubleKills: smallint("double_kills").default(0).notNull(),
	tripleKills: smallint("triple_kills").default(0).notNull(),
	quadraKills: smallint("quadra_kills").default(0).notNull(),
	pentaKills: smallint("penta_kills").default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	gameLength: bigint("game_length", { mode: "number" }).default(0).notNull(),
	win: boolean(),
	cs: integer().default(0),
	championName: text("champion_name"),
	teamKills: integer("team_kills").default(0),
	shortCode: varchar("short_code", { length: 100 }),
	performanceId: integer("performance_id"),
},
(table) => {
	return {
		fkPerformance: foreignKey({
			columns: [table.performanceId],
			foreignColumns: [performances.id],
			name: "fk_performance"
		}),
	}
});

export const performances = pgTable("performances", {
	id: serial().primaryKey().notNull(),
	playerId: integer("player_id"),
	teamId: integer("team_id"),
	divisionId: integer("division_id"),
	gameId: integer("game_id"),
},
(table) => {
	return {
		fkDivision: foreignKey({
			columns: [table.divisionId],
			foreignColumns: [divisions.id],
			name: "fk_division"
		}),
		fkGame: foreignKey({
			columns: [table.gameId],
			foreignColumns: [games.id],
			name: "fk_game"
		}),
		fkPlayer: foreignKey({
			columns: [table.playerId],
			foreignColumns: [players.id],
			name: "fk_player"
		}),
		fkTeam: foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "fk_team"
		}),
		performancesPlayerIdGameIdKey: unique("performances_player_id_game_id_key").on(table.playerId, table.gameId),
	}
});

export const teams: any = pgTable("teams", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	divisionId: integer("division_id"),
	groupId: char("group_id", { length: 1 }).notNull(),
	captainId: integer("captain_id"),
	logo: varchar(),
},
(table) => {
	return {
		lowerIdx: index("teams_lower_idx").using("btree", sql`lower((name)::text)`),
		fkCaptain: foreignKey({
			columns: [table.captainId],
			foreignColumns: [players.id],
			name: "fk_captain"
		}),
		fkDivision: foreignKey({
			columns: [table.divisionId],
			foreignColumns: [divisions.id],
			name: "fk_division"
		}),
		teamsCaptainIdPlayersIdFk: foreignKey({
			columns: [table.captainId],
			foreignColumns: [players.id],
			name: "teams_captain_id_players_id_fk"
		}).onUpdate("cascade").onDelete("set null"),
		teamsDivisionIdDivisionsIdFk: foreignKey({
			columns: [table.divisionId],
			foreignColumns: [divisions.id],
			name: "teams_division_id_divisions_id_fk"
		}).onUpdate("cascade").onDelete("set null"),
	}
});

export const series = pgTable("series", {
	id: serial().primaryKey().notNull(),
	team1Id: integer("team1_id"),
	team2Id: integer("team2_id"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	messageId: bigint("message_id", { mode: "number" }),
	playoffs: boolean().notNull(),
	winCondition: integer("win_condition").notNull(),
	winnerId: integer("winner_id"),
},
(table) => {
	return {
		fkTeam1: foreignKey({
			columns: [table.team1Id],
			foreignColumns: [teams.id],
			name: "fk_team1"
		}),
		fkTeam2: foreignKey({
			columns: [table.team2Id],
			foreignColumns: [teams.id],
			name: "fk_team2"
		}),
		fkWinner: foreignKey({
			columns: [table.winnerId],
			foreignColumns: [teams.id],
			name: "fk_winner"
		}).onUpdate("cascade").onDelete("set null"),
		seriesTeam1IdTeamsIdFk: foreignKey({
			columns: [table.team1Id],
			foreignColumns: [teams.id],
			name: "series_team1_id_teams_id_fk"
		}).onUpdate("cascade").onDelete("set null"),
		seriesTeam2IdTeamsIdFk: foreignKey({
			columns: [table.team2Id],
			foreignColumns: [teams.id],
			name: "series_team2_id_teams_id_fk"
		}).onUpdate("cascade").onDelete("set null"),
		seriesWinnerIdTeamsIdFk: foreignKey({
			columns: [table.winnerId],
			foreignColumns: [teams.id],
			name: "series_winner_id_teams_id_fk"
		}).onUpdate("cascade").onDelete("set null"),
		seriesTeam1IdTeam2IdPlayoffsKey: unique("series_team1_id_team2_id_playoffs_key").on(table.team1Id, table.team2Id, table.playoffs),
	}
});

export const games = pgTable("games", {
	id: serial().primaryKey().notNull(),
	shortCode: varchar("short_code", { length: 100 }).notNull(),
	winnerId: integer("winner_id"),
	loserId: integer("loser_id"),
	seriesId: integer("series_id").notNull(),
	resultId: integer("result_id"),
	gameNum: integer("game_num"),
	processed: boolean().default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
},
(table) => {
	return {
		fkLoser: foreignKey({
			columns: [table.loserId],
			foreignColumns: [teams.id],
			name: "fk_loser"
		}),
		fkResult: foreignKey({
			columns: [table.resultId],
			foreignColumns: [results.id],
			name: "fk_result"
		}),
		fkSeries: foreignKey({
			columns: [table.seriesId],
			foreignColumns: [series.id],
			name: "fk_series"
		}),
		fkWinner: foreignKey({
			columns: [table.winnerId],
			foreignColumns: [teams.id],
			name: "fk_winner"
		}),
		gamesLoserIdTeamsIdFk: foreignKey({
			columns: [table.loserId],
			foreignColumns: [teams.id],
			name: "games_loser_id_teams_id_fk"
		}).onUpdate("cascade"),
		gamesResultIdResultsIdFk: foreignKey({
			columns: [table.resultId],
			foreignColumns: [results.id],
			name: "games_result_id_results_id_fk"
		}).onUpdate("cascade").onDelete("set null"),
		gamesSeriesIdSeriesIdFk: foreignKey({
			columns: [table.seriesId],
			foreignColumns: [series.id],
			name: "games_series_id_series_id_fk"
		}).onUpdate("cascade").onDelete("set null"),
		gamesWinnerIdTeamsIdFk: foreignKey({
			columns: [table.winnerId],
			foreignColumns: [teams.id],
			name: "games_winner_id_teams_id_fk"
		}).onUpdate("cascade").onDelete("set null"),
	}
});

export const standings = pgTable("standings", {
	id: serial().primaryKey().notNull(),
	placement: integer().notNull(),
	divisionId: integer("division_id").notNull(),
	groupId: char("group_id", { length: 1 }).notNull(),
	teamId: integer("team_id").notNull(),
},
(table) => {
	return {
		fkTeam: foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "fk_team"
		}),
		standingsTeamIdTeamsIdFk: foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "standings_team_id_teams_id_fk"
		}).onUpdate("cascade").onDelete("set null"),
	}
});

export const schedules = pgTable("schedules", {
	id: serial().primaryKey().notNull(),
	week: integer().notNull(),
	divisionId: integer("division_id").notNull(),
	groupId: char("group_id", { length: 1 }).notNull(),
	seriesId: integer("series_id").notNull(),
},
(table) => {
	return {
		fkDivision: foreignKey({
			columns: [table.divisionId],
			foreignColumns: [divisions.id],
			name: "fk_division"
		}),
		fkSeries: foreignKey({
			columns: [table.seriesId],
			foreignColumns: [series.id],
			name: "fk_series"
		}),
		schedulesDivisionIdDivisionsIdFk: foreignKey({
			columns: [table.divisionId],
			foreignColumns: [divisions.id],
			name: "schedules_division_id_divisions_id_fk"
		}).onUpdate("cascade").onDelete("set null"),
		schedulesSeriesIdSeriesIdFk: foreignKey({
			columns: [table.seriesId],
			foreignColumns: [series.id],
			name: "schedules_series_id_series_id_fk"
		}).onUpdate("cascade").onDelete("set null"),
	}
});

export const divisions = pgTable("divisions", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 20 }).notNull(),
	description: text(),
	providerId: integer("provider_id").notNull(),
	tournamentId: integer("tournament_id").notNull(),
	groups: integer(),
},
(table) => {
	return {
		lowerIdx: index("divisions_lower_idx").using("btree", sql`lower((name)::text)`),
		divisionsTournamentIdKey: unique("divisions_tournament_id_key").on(table.tournamentId),
	}
});

export const players = pgTable("players", {
	id: serial().primaryKey().notNull(),
	primaryRiotPuuid: char("primary_riot_puuid", { length: 78 }).notNull(),
	teamId: integer("team_id"),
	summonerName: varchar("summoner_name", { length: 40 }),
},
(table) => {
	return {
		primaryRiotPuuidIdx: uniqueIndex("players_primary_riot_puuid_idx").using("btree", table.primaryRiotPuuid.asc().nullsLast()),
		fkTeam: foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "fk_team"
		}),
		playersTeamIdTeamsIdFk: foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "players_team_id_teams_id_fk"
		}).onUpdate("cascade").onDelete("set null"),
		playersPrimaryRiotPuuidKey: unique("players_primary_riot_puuid_key").on(table.primaryRiotPuuid),
		playersSummonerNameKey: unique("players_summoner_name_key").on(table.summonerName),
	}
});

export const accounts = pgTable("accounts", {
	id: serial().primaryKey().notNull(),
	riotPuuid: char("riot_puuid", { length: 78 }).notNull(),
	playerId: integer("player_id").notNull(),
	isPrimary: boolean("is_primary").notNull(),
},
(table) => {
	return {
		accountsPlayerIdPlayersIdFk: foreignKey({
			columns: [table.playerId],
			foreignColumns: [players.id],
			name: "accounts_player_id_players_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
		fkPlayer: foreignKey({
			columns: [table.playerId],
			foreignColumns: [players.id],
			name: "fk_player"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const results = pgTable("results", {
	id: serial().primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	startTime: bigint("start_time", { mode: "number" }),
	shortCode: varchar("short_code", { length: 100 }).notNull(),
	metaData: text("meta_data").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	gameId: bigint("game_id", { mode: "number" }),
	gameName: varchar("game_name", { length: 60 }),
	gameType: varchar("game_type", { length: 20 }),
	gameMap: integer("game_map"),
	gameMode: varchar("game_mode", { length: 20 }),
	region: varchar({ length: 20 }),
},
(table) => {
	return {
		uqShortCode: unique("uq_short_code").on(table.shortCode),
	}
});