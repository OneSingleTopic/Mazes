import { Cell } from "../Cell.js"

export class PolarCell implements Cell {
    row: number;
    col: number;
    links: Map<string, boolean>;

    U: PolarCell[];
    D: PolarCell | null = null;
    L: PolarCell | null = null;
    R: PolarCell | null = null;

    get id(): string {
        return `${this.row}_${this.col}`;
    }

    get link_ids(): Array<string> {
        return Array.from(this.links.keys())
    }

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
        this.U = new Array<PolarCell>();
        this.links = new Map<string, boolean>();
    }

    link(other_cell: PolarCell | null): void {
        if (other_cell != null) {
            this.links.set(other_cell.id, true);
            other_cell.links.set(this.id, true);
        }
    }

    unlink(other_cell: PolarCell | null): void {
        if (other_cell != null) {
            this.links.delete(other_cell.id);
            other_cell.links.delete(this.id);
        }
    }

    linked(other_cell: PolarCell): boolean {
        return this.links.has(other_cell.id);
    }


    neighbors(): Array<PolarCell> {
        let neighbors: Array<PolarCell> = [];
        if (this.U) this.U.forEach(element => neighbors.push(element));
        if (this.D) neighbors.push(this.D);
        if (this.L) neighbors.push(this.L);
        if (this.R) neighbors.push(this.R);

        return neighbors;
    }
}