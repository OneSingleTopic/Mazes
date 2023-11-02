import { Grid } from "../grid/Grid.js"
import { Cell } from "../grid/Cell.js"
import { MazeBuilder } from "./MazeBuilder.js";
import { RandomWalk } from "./RandomWalk.js";
import { Wilson } from "./Wilson.js";


export class Hybrid extends MazeBuilder {

    wilson: Wilson;
    random_walk: RandomWalk;

    constructor(grid: Grid) {
        super(grid);

        this.wilson = new Wilson(grid);
        this.random_walk = new RandomWalk(grid);
    }

    step_maze(): boolean {
        if (this.grid.visited.size < (this.grid.dimension) / 2) {
            return this.random_walk.step_maze()
        } else {
            return this.wilson.step_maze()
        }
    }
    build_step_maze(): Promise<Grid> {
        if (this.grid.visited.size < (this.grid.dimension) / 2) {
            return this.random_walk.build_step_maze()
        } else {
            return this.wilson.build_step_maze()
        }
    }
}
