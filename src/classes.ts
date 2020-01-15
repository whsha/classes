/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { BlockColor } from "./block";
import { Lunch } from "./lunch";
import { SchoolDay } from "./schoolDay";

/** The advisory object, missing a class type due to the fact that there only ever is one and storage can be smplified */
export interface IAdvisory {
    /** The advisor for the advisory */
    advisor: string;

    /** The room number or name the advisory takes place in */
    room: string;
}

/** The most basic information needed to identify a major */
export interface IClass {
    /** The class UUID for identifying the class */
    readonly uuid: string;

    /** If the class has a Lab block or not (only affects classes that meet during a 2nd block) */
    lab: boolean;

    /** The block color which the class meets */
    block: BlockColor;

    /** The name of the class */
    name: string;

    /** The teacher for the class */
    teacher: string;

    /** The room number or name the class takes place in */
    room: string;

    /** The school days when the class meets */
    meets: MeetDays;

    /** The lunches that this class has */
    lunches: Lunches;
}

/** A map of the days that a class meet */
export type MeetDays = { [K in SchoolDay]: boolean };

/** A map of the days that a class has lunch */
export type Lunches = { [K in SchoolDay]?: Lunch };

/** Get the count of times the class meets */
export function timesClassMeetsPerCycle({ meets }: IClass): number {
    return (
        (meets[SchoolDay.One] ? 1 : 0) +
        (meets[SchoolDay.Two] ? 1 : 0) +
        (meets[SchoolDay.Three] ? 1 : 0) +
        (meets[SchoolDay.Four] ? 1 : 0) +
        (meets[SchoolDay.Five] ? 1 : 0) +
        (meets[SchoolDay.Six] ? 1 : 0) +
        (meets[SchoolDay.Seven] ? 1 : 0)
    );
}

/** Get the school days a class meets */
export function daysClassMeets({ meets }: IClass): SchoolDay[] {
    return Object.keys(meets)
        .filter(x => meets[(x as unknown) as keyof MeetDays])
        .map(x => parseInt(x, 10)) as unknown[] as SchoolDay[];
}

/** Join two meet day maps to form one */
export function joinMeetData(left: MeetDays, right: MeetDays): MeetDays {
    return {
        [SchoolDay.One]: left[SchoolDay.One] || right[SchoolDay.One],
        [SchoolDay.Two]: left[SchoolDay.Two] || right[SchoolDay.Two],
        [SchoolDay.Three]: left[SchoolDay.Three] || right[SchoolDay.Three],
        [SchoolDay.Four]: left[SchoolDay.Four] || right[SchoolDay.Four],
        [SchoolDay.Five]: left[SchoolDay.Five] || right[SchoolDay.Five],
        [SchoolDay.Six]: left[SchoolDay.Six] || right[SchoolDay.Six],
        [SchoolDay.Seven]: left[SchoolDay.Seven] || right[SchoolDay.Seven],
    };
}