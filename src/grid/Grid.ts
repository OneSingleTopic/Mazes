import { Cell } from "./Cell.js";

export interface Grid {

    get current_cells(): Set<Cell>;
    get visited(): Set<Cell>;
    get not_visited(): Set<Cell>;
    get finished(): boolean;
    get dimension(): number;
    configure_grid(): void;

    each_cell(): Generator<Cell, void, void>;

    random_cell(): Cell;
    random_not_visitied_cell(): Cell | null;

    render(canvas: HTMLCanvasElement): void;
}

