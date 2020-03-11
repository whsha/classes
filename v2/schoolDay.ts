/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

/** A numeric value denoting the school day in the 7 day cycle */
export enum SchoolDay {
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7
}

/** An array of all of the school days */
export const SCHOOL_DAYS = Object.values(SchoolDay).filter(key => isNaN(Number(SchoolDay[key as unknown as keyof typeof SchoolDay]))) as unknown as SchoolDay[];