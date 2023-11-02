import { Grid } from "../grid/Grid.js"
import { Cell } from "../grid/Cell.js"
import { MazeBuilder } from "./MazeBuilder.js";

export class RecursiveBackTracker extends MazeBuilder {
    stack: Array<Cell>;
    current_cell: Cell;
    next_cell!: Cell | null;

    constructor(grid: Grid) {
        super(grid);
        this.current_cell = this.grid.random_cell()
        this.stack = []
        this.stack.push(this.current_cell);
    }

    step_maze(): boolean {
        if (this.stack.length == 0) {
            this.grid.current_cells.clear();
            return false;
        } else {
            let neighbors: Cell[] = []
            this.current_cell.neighbors().forEach(neighbor => {
                if (!this.grid.visited.has(neighbor)) {
                    neighbors.push(neighbor);
                }
            })

            const index: number = Math.floor(Math.random() * neighbors.length);
            if (neighbors.length > 0) {
                this.next_cell = neighbors[index];
            } else {
                this.next_cell = null;
            }
        }
        return true;
    }

    async build_step_maze(): Promise<Grid> {
        this.grid.visited.add(this.current_cell);
        this.grid.current_cells.clear();
        this.grid.current_cells.add(this.current_cell);

        if (this.next_cell != null) {
            this.current_cell.link(this.next_cell);
            this.current_cell = this.next_cell;
            this.stack.push(this.current_cell);
        } else {
            let found = false;

            while (this.stack.length > 0 && !found) {
                const new_cell = this.stack.pop();
                if (new_cell != null) {
                    for (const neighbor of new_cell.neighbors()) {
                        if (!this.grid.visited.has(neighbor)) {
                            this.current_cell = new_cell;
                            this.stack.push(new_cell);
                            found = true
                        }
                    }
                }
            }
        }

        return this.grid;
    }
}