/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { PropertiesOf } from "./store";

/** The severity of a problem */
export enum Severity {
    Warn,
    Error
}

/** A problem with the type */
export interface IProblem<T, F extends PropertiesOf<T>, P, S extends Severity, > {
    /** The field that has problems with it */
    readonly field: F;
    /** The problem with the field */
    readonly problem: P;
    /** The severity of a problem */
    readonly severity: S;
}

/** A problem that occurs between two Ts */
export interface IConflict<T, F extends PropertiesOf<T>, P> extends IProblem<T, F, P, Severity.Error> {
    /** The element that conflicts */
    readonly conflict: string;
}

/** Checks if a problem is a conflict */
export function isConflict<T, F extends PropertiesOf<T>, P>(p: IProblem<T, F, P, Severity.Error>): p is IConflict<T, F, P> {
    return (p as Object).hasOwnProperty("conflict") && p.severity === Severity.Error;
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