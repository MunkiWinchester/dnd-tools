export namespace DndRadio {
    export type Option<T = number> = {
        value: T;
        label: string;
        disabled?: boolean;
    };
}
