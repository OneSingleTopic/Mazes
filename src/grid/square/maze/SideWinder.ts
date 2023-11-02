import { SquareGrid } from "../SquareGrid.js"
import { Cell } from "../../Cell.js"
import { MazeBuilder } from "../../../mazes/MazeBuilder.js";
import { SquareCell } from "../SquareCell.js";


export class SideWinder extends MazeBuilder {
    grid: SquareGrid;
    current_run: Array<SquareCell>;
    heap!: Array<SquareCell>;
    generator: Generator<Array<SquareCell>, void, void>;

    constructor(grid: SquareGrid) {
        super(grid);
        this.grid = grid;
        this.current_run = [];
        this.generator = this.grid.each_row();
        this.update_heap()
    }

    update_heap(): boolean {
        let tmp_heap = this.generator.next();
        if (!tmp_heap.done) {
            this.heap = tmp_heap.value.slice();
            return true;
        } else {
            this.grid.current_cells.clear();
            return false;
        }
    }

    step_maze(): boolean {
        if (this.heap.length == 0) {
            return this.update_heap()
        }
        return true;
    }

    async build_step_maze(): Promise<SquareGrid> {
        const current_cell = this.heap.shift();

        if (current_cell != null) {
            this.grid.current_cells.clear();
            this.grid.current_cells.add(current_cell);
            this.grid.visited.add(current_cell)
            this.grid.not_visited.delete(current_cell)

            this.current_run.push(current_cell)
            if (current_cell.U == null && current_cell.R != null) {
                current_cell.link(current_cell.R);
            } else if (current_cell.R == null || Math.random() < 0.2) {
                const index: number = Math.floor(Math.random() * this.current_run.length);
                const random_cell = this.current_run[index];
                random_cell.link(random_cell.U);
                this.current_run = []
            } else {
                current_cell.link(current_cell.R);
            }
        }
        return this.grid;
    }


}
