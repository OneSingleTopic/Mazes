import { Grid } from "../grid/Grid.js"
import { Cell } from "../grid/Cell.js"
import { MazeBuilder } from "./MazeBuilder.js";

export class Wilson extends MazeBuilder {
    heap: Array<Cell> = [];
    current_cell!: Cell | null;
    current_path: Array<Cell> = [];

    constructor(grid: Grid) {
        super(grid);
    }

    step_maze(): boolean {
        if (this.grid.visited.size == 0) {
            const initial_cell = this.grid.random_cell()
            this.grid.visited.add(initial_cell)
            this.grid.not_visited.delete(initial_cell)
        }
        if (this.grid.finished) {
            this.grid.current_cells.clear();
            return false;
        } else {
            if (this.current_cell == null) {
                const tmp_current_cell = this.grid.random_not_visitied_cell()
                if (tmp_current_cell != null) {
                    this.current_cell = tmp_current_cell;
                    this.current_path.push(tmp_current_cell);
                }
            }
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

        if (this.current_cell != null && next_cell != null) {
            if (this.grid.visited.has(next_cell)) {
                for (let i = 1; i < this.current_path.length; i++) {
                    this.current_path[i].link(this.current_path[i - 1])
                }
                this.current_cell?.link(next_cell);
                this.current_path.forEach(cell => {
                    this.grid.not_visited.delete(cell);
                    this.grid.visited.add(cell);
                });
                this.current_path = []
                this.current_cell = null;
                this.grid.current_cells.clear();
            } else {
                if (this.current_path.includes(next_cell)) {
                    while (this.current_path.includes(next_cell)) {
                        this.current_path.pop()
                    }
                }
                this.current_path.push(next_cell);

                this.current_cell = next_cell;
                this.grid.current_cells.clear();
                this.grid.current_cells.add(this.current_cell);
            }
        }
        return this.grid;
    }
}