import { Cell } from "../Cell.js";

export class SquareCell implements Cell {
    row: number;
    col: number;
    links: Map<string, boolean>;

    U: SquareCell | null = null;
    D: SquareCell | null = null;
    L: SquareCell | null = null;
    R: SquareCell | null = null;

    get id(): string {
        return `${this.row}_${this.col}`;
    }

    get link_ids(): Array<string> {
        return Array.from(this.links.keys())
    }

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
        this.links = new Map<string, boolean>();
    }

    link(other_cell: SquareCell | null): void {
        if (other_cell != null) {
            this.links.set(other_cell.id, true);
            other_cell.links.set(this.id, true);
        }
    }

    unlink(other_cell: SquareCell | null): void {
        if (other_cell != null) {
            this.links.delete(other_cell.id);
            other_cell.links.delete(this.id);
        }
    }

    linked(other_cell: SquareCell): boolean {
        return this.links.has(other_cell.id);
    }

    neighbors(): Array<SquareCell> {
        let neighbors: Array<SquareCell> = [];
        if (this.U) neighbors.push(this.U);
        if (this.D) neighbors.push(this.D);
        if (this.L) neighbors.push(this.L);
        if (this.R) neighbors.push(this.R);

        return neighbors;
    }
}