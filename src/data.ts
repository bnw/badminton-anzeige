type Set = { team_a: number, team_b: number }

export type Data = {
    team_a: { score: number, name: string },
    team_b: { score: number, name: string },
    sets: Set[],
    last_score: string | null
}

export const initial_data: Data = {
    team_a: {score: 0, name: "Heim"},
    team_b: {score: 0, name: "Gast"},
    sets: [],
    last_score: null
};