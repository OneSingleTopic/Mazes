import { Grid } from "../grid/Grid.js"
import { Cell } from "../grid/Cell.js"
import { MazeBuilder } from "./MazeBuilder.js";


export class RandomWalk extends MazeBuilder {
    heap: Array<Cell> = [];
    current_cell: Cell;

    constructor(grid: Grid) {
        super(grid);
        this.current_cell = this.grid.random_cell()
    }

    step_maze(): boolean {
        if (this.grid.finished) {
            this.grid.current_cells.clear();
            return false;
        } else {
            if (this.heap.length == 0) {
                let neighbors: Cell[] = new Array<Cell>();
                this.current_cell?.neighbors().forEach(element => neighbors.push(element))

                const index: number = Math.floor(Math.random() * neighbors.length);
                if (neighbors.length > 0) {
                    this.heap.push(neighbors[index]);
                } else {
                    return false
                }
            }
        }
        return true;
    }

    async build_step_maze(): Promise<Grid> {
        const next_cell = this.heap.shift();

        this.grid.current_cells.clear();
        this.grid.current_cells.add(this.current_cell);
        this.grid.visited.add(this.current_cell)
        this.grid.not_visited.delete(this.current_cell)
        if (next_cell != null) {
            if (!this.grid.visited.has(next_cell)) {
                this.current_cell.link(next_cell);
            }
            this.current_cell = next_cell;
        }
        return this.grid;
    }
}
