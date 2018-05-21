type Set = { team_a: number, team_b: number }

export type Data = {
    team_a: { score: number, name: string },
    team_b: { score: number, name: string },
    sets: Set[]
}

export const initial_data: Data = {
    team_a: {score: 0, name: "Heim"},
    team_b: {score: 0, name: "Gast"},
    sets: []
};