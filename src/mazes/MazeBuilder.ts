import { Grid } from "../grid/Grid.js"

export abstract class MazeBuilder {
    grid: Grid;

    constructor(grid: Grid) {
        this.grid = grid;
    }
    abstract step_maze(): boolean;
    abstract build_step_maze(): Promise<Grid>;

    async build_maze(): Promise<Grid> {
        while (this.step_maze()) {
            this.grid = await this.build_step_maze()
        }
        return this.grid;
    }
}


