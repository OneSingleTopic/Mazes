import { SquareGrid } from "../SquareGrid.js"
import { SquareCell } from "../SquareCell.js"
import { MazeBuilder } from "../../../mazes/MazeBuilder.js";


export class BinaryTree extends MazeBuilder {
    grid: SquareGrid;
    heap: Array<SquareCell> = [];
    generator: Generator<SquareCell, void, void>;

    constructor(grid: SquareGrid) {
        super(grid);
        this.grid = grid;
        this.generator = this.grid.each_cell();
        this.update_heap()
    }

    update_heap(): boolean {
        let tmp_heap = this.generator.next();
        if (!tmp_heap.done) {
            this.heap.push(tmp_heap.value);
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
            console.log("New Cell", current_cell.id);
            this.grid.current_cells.clear();
            this.grid.current_cells.add(current_cell);
            this.grid.visited.add(current_cell)
            this.grid.not_visited.delete(current_cell)

            let neighbors: SquareCell[] = []
            if (current_cell.U != null) { neighbors.push(current_cell.U) };
            if (current_cell.R != null) { neighbors.push(current_cell.R) };

            neighbors.forEach(cell => { console.log(cell.id) });
            const index: number = Math.floor(Math.random() * neighbors.length);
            if (neighbors.length > 0) {
                current_cell.link(neighbors[index]);
            }
        }
        return this.grid;
    }
}