export interface Cell {
    get row(): number;
    get col(): number;
    get id(): string;
    get link_ids(): Array<string>;
    link(other_cell: Cell | null): void;
    unlink(other_cell: Cell | null): void;
    linked(other_cell: Cell): boolean;
    neighbors(): Array<Cell>;
}