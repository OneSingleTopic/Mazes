import { Grid } from "../grid/Grid.js"
import { Cell } from "../grid/Cell.js"
import { MazeBuilder } from "./MazeBuilder.js";


export class HuntAndKill extends MazeBuilder {
    heap: Array<Cell> = [];
    current_cell!: Cell | null;

    constructor(grid: Grid) {
        super(grid);
    }

    step_maze(): boolean {
        if (this.grid.visited.size == 0) {
            const initial_cell = this.grid.random_cell()
            this.current_cell = initial_cell;
            this.heap = []
        }
        if (this.grid.finished) {
            this.grid.current_cells.clear();
            return false;
        } else {
            if (this.current_cell == null) {
                const new_cell = this.hunt_new_cell();
                if (new_cell != null) {
                    this.current_cell = new_cell;
                    this.heap = []
                }
            }
            if (this.heap.length == 0) {
                let neighbors: Cell[] = new Array<Cell>();
                this.current_cell?.neighbors().forEach(element => neighbors.push(element))

                const index: number = Math.floor(Math.random() * neighbors.length);
                if (neighbors.length > 0) {
                    this.heap.push(neighbors[index]);
                }
            }
        }
        return true;
    }

    hunt_new_cell(): Cell | null {
        for (const cell of this.grid.each_cell()) {
            if (!this.grid.visited.has(cell)) {
                for (const neighbor of cell.neighbors()) {
                    if (this.grid.visited.has(neighbor)) {
                        cell.link(neighbor);
                        return cell;
                    }
                }
            }
        }
        return null;
    }

    async build_step_maze(): Promise<Grid> {
        if (this.current_cell != null) {
            this.grid.visited.add(this.current_cell);
            this.grid.not_visited.delete(this.current_cell);
            this.grid.current_cells.clear();
            this.grid.current_cells.add(this.current_cell);

            if (this.heap.length > 0) {
                const next_cell = this.heap.shift();
                if (next_cell != null) {
                    if (!this.grid.visited.has(next_cell)) {
                        this.current_cell?.link(next_cell);
                        this.current_cell = next_cell;
                    } else {
                        this.current_cell = null;
                    }
                }
            } else {
                this.current_cell = null;
            }
        }
        return this.grid;
    }
}