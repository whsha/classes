/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { SchoolDay } from "./schoolDay";

/** The lunches for a day */
export enum Lunch {
    First,
    Second,
    Third,
    None
}

/** The lunches mapped by the school day. */
export type DayLunchMap = {
    [D in SchoolDay]: Lunch;
};