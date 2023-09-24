export declare class DuplicateError extends Error {
    constructor(message?: string);
}
export declare class DuplicateConstraintError extends DuplicateError {
    constructor(field: string);
}
