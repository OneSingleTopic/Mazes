import { PolarCell } from "./PolarCell.js";
import { Grid } from "../Grid.js";

export class PolarGrid implements Grid {
    rows: number;

    grid!: Array<Array<PolarCell>>;
    visited: Set<PolarCell>;
    not_visited: Set<PolarCell>;
    current_cells: Set<PolarCell>;

    constructor(rows: number) {
        this.rows = rows;

        this.create_grid();
        this.configure_grid();
        this.visited = new Set();
        this.not_visited = new Set();
        for (const cell of this.each_cell()) {
            this.not_visited.add(cell)
        }
        this.current_cells = new Set();

    }

    get dimension(): number {
        return (this.grid.map(element => element.length).reduce((sum, current) => sum + current), 0)
    }

    create_grid(): void {
        this.grid = new Array<Array<PolarCell>>();
        this.grid.push([new PolarCell(0, 0)])

        const row_height = 1.0 / this.rows;

        for (let i = 1; i < this.rows; i++) {
            const row = new Array<PolarCell>();
            const radius = i / this.rows;
            const circumference = 2 * Math.PI * radius;
            const previous_count = this.grid[i - 1].length;
            const estimated_cell_width = circumference / previous_count;
            const ratio = Math.round(estimated_cell_width / row_height);
            const cells = previous_count * ratio

            for (let j = 0; j < cells; j++) {
                row.push(new PolarCell(i, j));
            }
            this.grid.push(row)
        }

    }

    configure_grid(): void {
        for (let i = 1; i < this.rows; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                const ratio = this.grid[i].length / this.grid[i - 1].length;
                const parent_cell = this.grid[i - 1][Math.floor(j / ratio)];
                this.grid[i][j].D = parent_cell;
                parent_cell.U.push(this.grid[i][j]);
                this.grid[i][j].L = this.get(i, j - 1);
                this.grid[i][j].R = this.get(i, j + 1);

            }

            this.grid[i][0].L = this.get(i, this.grid[i].length - 1);
            this.grid[i][this.grid[i].length - 1].R = this.get(i, 0);
        }

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                console.log(this.grid[i][j].id, this.grid[i][j].neighbors())
            }
        }
    }

    get(row: number, col: number): PolarCell | null {
        if (row < 0 || row >= this.rows) { return null };
        if (col < 0 || col >= this.grid[row].length) { return null };

        return this.grid[row][col];
    }


    random_cell(): PolarCell {
        const random_row = Math.floor(Math.random() * this.rows);
        const random_col = Math.floor(Math.random() * this.grid[random_row].length);
        return this.grid[random_row][random_col];
    }


    get finished(): boolean {
        return this.visited.size == this.dimension
    }

    *each_row(): Generator<Array<PolarCell>, void, void> {
        for (const row of this.grid) {
            yield row;
        }
    }

    *each_cell(): Generator<PolarCell, void, void> {
        for (const row of this.grid) {
            for (const cell of row) {
                yield cell;
            }
        }
    }

    random_not_visitied_cell(): PolarCell | null {
        if (this.not_visited.size > 0) {
            const random_index = Math.floor(Math.random() * this.not_visited.size);
            return Array.from(this.not_visited)[random_index];
        } else {
            return null;
        }

    }

    compute_cell_size(wallSize: number, max_width: number, max_height: number): number {
        const walls_width = wallSize * (this.rows + 1)

        return Math.floor(
            Math.min(
                (max_width - 2 * walls_width) / (2 * this.rows),
                (max_height - 2 * walls_width) / (2 * this.rows)))
    }

    async render(canvas: HTMLCanvasElement): Promise<void> {

        const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const max_height = canvas.height;
        const max_width = canvas.width;
        const halfWallSize = 1;
        const wallSize = 2 * halfWallSize
        const cellSize = this.compute_cell_size(wallSize, max_width, max_height);

        const center = [max_height / 2, max_width / 2]
        const ring_height = cellSize;

        ctx.lineWidth = wallSize;

        // Set the stroke color (e.g., black)
        ctx.strokeStyle = "black";
        ctx.fillStyle = "lightgrey";

        function getCellPolygon(cell: PolarCell, n_cells: number): number[] {
            const x = cell.row;
            const y = cell.col;
            const theta = 2 * Math.PI / n_cells
            const inner_radius = x * ring_height;
            const outer_radius = (x + 1) * ring_height;
            const theta_ccw = y * theta;
            const theta_cw = (y + 1) * theta

            return [outer_radius, inner_radius, theta_ccw, theta_cw, theta];
        }

        function fill_cell(cellPolygon: number[], fillStyle: string) {

            ctx.fillStyle = fillStyle

            const [outerRadius, innerRadius, startAngle, endAngle, theta] = cellPolygon;

            ctx.beginPath();
            ctx.arc(center[0], center[1], outerRadius, startAngle, endAngle);
            ctx.arc(center[0], center[1], innerRadius, endAngle, startAngle, true); // Using counter-clockwise
            ctx.closePath();

            ctx.fill();
        }

        function draw_top(cellPolygon: number[]) {
            const [outerRadius, innerRadius, startAngle, endAngle, theta] = cellPolygon;
            ctx.beginPath();
            ctx.arc(center[0], center[1], outerRadius, startAngle, endAngle);
            ctx.stroke();
        }

        function draw_bot(cellPolygon: number[]) {
            const [outerRadius, innerRadius, startAngle, endAngle, theta] = cellPolygon;

            ctx.beginPath();
            ctx.arc(center[0], center[1], innerRadius, startAngle, endAngle);
            ctx.stroke();
        }
        function draw_left(cellPolygon: number[]) {
            ctx.beginPath();
            const [outerRadius, innerRadius, startAngle, endAngle, theta] = cellPolygon;
            const outerStartX = center[0] + outerRadius * Math.cos(startAngle);
            const outerStartY = center[1] + outerRadius * Math.sin(startAngle);
            ctx.moveTo(outerStartX, outerStartY);

            const innerStartX = center[0] + innerRadius * Math.cos(startAngle);
            const innerStartY = center[1] + innerRadius * Math.sin(startAngle);
            ctx.lineTo(innerStartX, innerStartY);
            ctx.stroke();
        }
        function draw_right(cellPolygon: number[]) {
            ctx.beginPath();
            const [outerRadius, innerRadius, startAngle, endAngle, theta] = cellPolygon;
            const outerStartX = center[0] + outerRadius * Math.cos(endAngle);
            const outerStartY = center[1] + outerRadius * Math.sin(endAngle);
            ctx.moveTo(outerStartX, outerStartY);

            const innerStartX = center[0] + innerRadius * Math.cos(endAngle);
            const innerStartY = center[1] + innerRadius * Math.sin(endAngle);
            ctx.lineTo(innerStartX, innerStartY);
            ctx.stroke();
        }
        for (const cell of this.each_cell()) {
            const cellPolygon = getCellPolygon(cell, this.grid[cell.row].length);
            if (this.current_cells.has(cell)) {
                fill_cell(cellPolygon, "red");
            } else if (this.visited.has(cell)) {
                fill_cell(cellPolygon, "lightgreen");
            } else {
                fill_cell(cellPolygon, "lightgrey");
            }
            if (cell.U?.length == 0) {
                draw_top(cellPolygon)
            } else {
                if (cell.U?.length == 1) {
                    if (!(cell.link_ids.includes(cell.U[0].id))) {
                        draw_top(cellPolygon)
                    }
                } else if (cell.U?.length == 2) {
                    if (!(cell.link_ids.includes(cell.U[0].id))) {
                        draw_top([cellPolygon[0], cellPolygon[1], cellPolygon[2], cellPolygon[2] + cellPolygon[4] / 2]);
                    }
                    if (!(cell.link_ids.includes(cell.U[1].id))) {
                        draw_top([cellPolygon[0], cellPolygon[1], cellPolygon[2] + cellPolygon[4] / 2, cellPolygon[3]]);
                    }
                }
            }
            if (cell.row > 0) {
                if (cell.D == null) {
                    draw_bot(cellPolygon)
                } else if (!(cell.link_ids.includes(cell.D.id))) {
                    draw_bot(cellPolygon)
                }
                if (cell.L == null) {
                    draw_left(cellPolygon)
                } else if (!(cell.link_ids.includes(cell.L.id))) {
                    draw_left(cellPolygon)
                }
                if (cell.R == null) {
                    draw_right(cellPolygon)
                } else if (!(cell.link_ids.includes(cell.R.id))) {
                    draw_right(cellPolygon)
                }
            }
        }

    }


}