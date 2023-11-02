import { Cell } from "../Cell.js";
import { SquareCell } from "./SquareCell.js";
import { Grid } from "../Grid.js";


export class SquareGrid implements Grid {
    rows: number;
    cols: number;

    grid!: Array<Array<SquareCell>>;
    visited: Set<SquareCell>;
    not_visited: Set<SquareCell>;
    current_cells: Set<SquareCell>;

    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;

        this.create_grid();
        this.configure_grid();
        this.visited = new Set();
        this.not_visited = new Set();
        for (const cell of this.each_cell()) {
            this.not_visited.add(cell)
        }
        this.current_cells = new Set();

    }

    create_grid(): void {
        this.grid = new Array<Array<SquareCell>>();
        for (let i = 0; i < this.rows; i++) {
            let row: Array<SquareCell> = [];
            for (let j = 0; j < this.cols; j++) {
                row.push(new SquareCell(i, j));
            }
            this.grid.push(row)
        }
    }

    get size(): number {
        return this.rows * this.cols;
    }

    get(row: number, col: number): Cell | null {
        if (row < 0 || row >= this.rows) { return null };
        if (col < 0 || col >= this.cols) { return null };

        return this.grid[row][col];
    }

    get finished(): boolean {
        return this.visited.size == (this.rows * this.cols)
    }

    *each_row(): Generator<Array<SquareCell>, void, void> {
        for (const row of this.grid) {
            yield row;
        }
    }

    *each_cell(): Generator<SquareCell, void, void> {
        for (const row of this.grid) {
            for (const cell of row) {
                yield cell;
            }
        }
    }

    random_not_visitied_cell(): SquareCell | null {
        if (this.not_visited.size > 0) {
            const random_index = Math.floor(Math.random() * this.not_visited.size);
            return Array.from(this.not_visited)[random_index];
        } else {
            return null;
        }

    }

    get dimension(): number {
        return this.cols * this.rows;
    }

    configure_grid(): void {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j].D = this.get(i - 1, j) as SquareCell;
                this.grid[i][j].U = this.get(i + 1, j) as SquareCell;
                this.grid[i][j].L = this.get(i, j - 1) as SquareCell;
                this.grid[i][j].R = this.get(i, j + 1) as SquareCell;
            }
        }
    }

    random_cell(): Cell {
        const random_row = Math.floor(Math.random() * this.rows);
        const random_col = Math.floor(Math.random() * this.cols);

        return this.grid[random_row][random_col];
    }

    compute_cell_size(wallSize: number, max_width: number, max_height: number): number {
        const walls_width = wallSize * (this.cols + 1)
        const walls_height = wallSize * (this.rows + 1)

        return Math.floor(Math.min((max_width - walls_width) / this.cols, (max_height - walls_height) / this.rows))
    }

    async render(canvas: HTMLCanvasElement): Promise<void> {
        const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const max_height = canvas.height;
        const max_width = canvas.width;
        const halfWallSize = 1;
        const wallSize = 2 * halfWallSize
        const cellSize = this.compute_cell_size(wallSize, max_width, max_height);

        ctx.lineWidth = wallSize;

        // Set the stroke color (e.g., black)
        ctx.strokeStyle = "black";
        ctx.fillStyle = "lightgrey";

        function draw_top(x: number, y: number) {
            ctx.beginPath();
            ctx.moveTo(
                y - halfWallSize,
                x - cellSize);
            ctx.lineTo(
                y + cellSize + halfWallSize,
                x - cellSize);
            ctx.stroke();
        }
        function draw_bot(x: number, y: number) {
            ctx.beginPath();
            ctx.moveTo(
                y - halfWallSize,
                x);
            ctx.lineTo(
                y + cellSize + halfWallSize,
                x);
            ctx.stroke();
        }
        function draw_right(x: number, y: number) {
            ctx.beginPath();
            ctx.moveTo(
                y + cellSize,
                x + halfWallSize);
            ctx.lineTo(
                y + cellSize,
                x - cellSize - halfWallSize);
            ctx.stroke();
        }
        function draw_left(x: number, y: number) {
            ctx.beginPath();
            ctx.moveTo(
                y,
                x + halfWallSize);
            ctx.lineTo(
                y,
                x - cellSize - halfWallSize);
            ctx.stroke();
        }
        function draw_not_visited(x: number, y: number) {
            ctx.fillStyle = "lightgrey";
            ctx.rect(y, x, cellSize, -cellSize);
            ctx.fill();
        }
        function draw_visited(x: number, y: number) {
            ctx.fillStyle = "lightgreen";
            ctx.rect(y, x, cellSize, -cellSize);
            ctx.fill();
        }
        function draw_current(x: number, y: number) {
            ctx.fillStyle = "red";
            ctx.rect(y, x, cellSize, -cellSize);
            ctx.fill();
        }

        for (const cell of this.each_cell()) {
            const x = max_height - halfWallSize - (cellSize) * (cell.row);
            const y = halfWallSize + (cellSize) * (cell.col);

            if (this.current_cells.has(cell)) {
                draw_current(x, y);
            } else if (this.visited.has(cell)) {
                draw_visited(x, y);
            } else {
                draw_not_visited(x, y);
            }
            if (cell.U == null) {
                draw_top(x, y)
            } else if (!(cell.link_ids.includes(cell.U.id))) {
                draw_top(x, y)
            }
            if (cell.D == null) {
                draw_bot(x, y)
            } else if (!(cell.link_ids.includes(cell.D.id))) {
                draw_bot(x, y)
            }
            if (cell.L == null) {
                draw_left(x, y)
            } else if (!(cell.link_ids.includes(cell.L.id))) {
                draw_left(x, y)
            }
            if (cell.R == null) {
                draw_right(x, y)
            } else if (!(cell.link_ids.includes(cell.R.id))) {
                draw_right(x, y)
            }
        }

    }
}
