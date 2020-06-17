/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { PropertiesOf } from "./store";

/** The severity of a problem */
export enum Severity {
    Warn,
    Error
}

/** Problems that can arise */
export enum Problem {
    /** A selection is empty */
    Empty,
    /** A selection is invalid */
    Invalid,
    /** A selection conflicts with another */
    Conflict,
    /** A selection is lacking */
    Bare,
}

/** A problem with the type */
interface IProblem<T, F extends PropertiesOf<T>, P extends Problem, S extends Severity> {
    /** The field that has problems with it */
    readonly field: F;
    /** The problem with the field */
    readonly problem: P;
    /** The severity of a problem */
    readonly severity: S;
}

/** An error that exists on type T and in field F */
export interface IError<T, F extends PropertiesOf<T>, P extends Problem> extends IProblem<T, F, P, Severity.Error> { }
/** A warning that exists on type T and in field F */
export interface IWarning<T, F extends PropertiesOf<T>, P extends Problem> extends IProblem<T, F, P, Severity.Warn> { }
/** A problem that occurs between two Ts */
export interface IConflict<T, F extends PropertiesOf<T>> extends IError<T, F, Problem.Conflict> {
    /** The element that conflicts */
    readonly conflict: string;
}

/** Checks if a problem is an error */
export function isError<T, F extends PropertiesOf<T>, P extends Problem>(p: IProblem<T, F, P, Severity>): p is IError<T, F, P> {
    return p.severity === Severity.Error;
}

/** Checks if a problem is an error */
export function isWarning<T, F extends PropertiesOf<T>, P extends Problem>(p: IProblem<T, F, P, Severity>): p is IWarning<T, F, P> {
    return p.severity === Severity.Error;
}

/** Checks if an error is a conflict */
export function isConflict<T, F extends PropertiesOf<T>>(p: IError<T, F, Problem>): p is IConflict<T, F> {
    return (p as Object).hasOwnProperty("conflict") && p.severity === Severity.Error && p.problem === Problem.Conflict;
}

/** A map to store problems */
export class ProblemMap<P> extends Map<string, P[]> {
    /** The key to use for a problem that applies to all UUIDs */
    public static readonly ALL_KEY = "HEAD";

    /** Add a value to the array under the key */
    public add(key: string, value: P) {
        let prevalue = this.get(key);
        if (prevalue === undefined) {
            prevalue = [];
        }
        prevalue.push(value);

        this.set(key, prevalue);
    }
}