/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { v4String } from "uuid/interfaces";

/** The uuid lib */
const uuid = jest.requireActual("uuid") as v4String;

/** The amount of times v4 has been called */
let called = 0;

/** Mock uuid function for snapshots */
export function v4() {
    let random = [];

    // tslint:disable-next-line: no-bitwise
    for (let i = 0; i < 16; i++, called << 16) {
        random.push(Math.trunc(called / Math.pow(256, i)));
    }
    random = random.reverse();
    called++;

    return uuid({ random });
}