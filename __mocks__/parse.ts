/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { observable } from "mobx";
import { ClassesStorev1 } from "../v1/store";

/** Method to parse the v1 classes from their json form */
export function parsev1(json: unknown): ClassesStorev1 {
    const parsed = json as Partial<ClassesStorev1>;
    const store = new ClassesStorev1();

    if (parsed.DRs === undefined
        || parsed.advisory === undefined
        || parsed.majors === undefined
        || parsed.minors === undefined
        || parsed.lunches === undefined) {
        throw new Error();
    }
    store.DRs = observable.map(parsed.DRs);
    store.advisory = parsed.advisory;
    store.majors = observable.map(parsed.majors);
    store.minors = observable.map(parsed.minors);
    store.lunches = parsed.lunches;

    return store;
}