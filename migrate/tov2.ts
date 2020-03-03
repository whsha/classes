/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { v4 as uuidv4 } from "uuid";
import { ClassesStorev1 } from "../v1/store";
import { LunchBlock } from "../v2/block";
import { IAdvisory } from "../v2/class";
import { colorMeetsOnDay, getBlockForColorOnDay } from "../v2/days";
import { SchoolDay } from "../v2/schoolDay";
import { Semester } from "../v2/semester";
import { ClassesStorev2 } from "../v2/store";

/** Function to migrate a classes store from v1 to v2 */
// tslint:disable-next-line: cyclomatic-complexity
export default function migratetov2(v1: ClassesStorev1): ClassesStorev2 {
    // Create the new classes store type
    const v2 = new ClassesStorev2();

    // Set the advisory to the same as the v1
    const advisory: IAdvisory = {
        advisor: v1.advisory.teacher,
        meets: {
            [SchoolDay.One]: true,
            [SchoolDay.Two]: true,
            [SchoolDay.Three]: true,
            [SchoolDay.Four]: true,
            [SchoolDay.Five]: true,
            [SchoolDay.Six]: true,
            [SchoolDay.Seven]: true
        },
        room: v1.advisory.room,
        uuid: uuidv4()
    };
    v2.advisories.set(advisory.uuid, advisory);

    // Loop through majors
    for (const [uuid, major] of v1.majors) {
        v2.classes.set(uuid, {
            block: major.block,
            lab: major.lab,
            lunches: {
                // If the class has a block D on that day then get the lunch from the array in .lunches, else just leave undefined
                [SchoolDay.One]: getBlockForColorOnDay(major.block, SchoolDay.One) === LunchBlock ? v1.lunches[SchoolDay.One] : undefined,
                [SchoolDay.Two]: getBlockForColorOnDay(major.block, SchoolDay.Two) === LunchBlock ? v1.lunches[SchoolDay.Two] : undefined,
                [SchoolDay.Three]: getBlockForColorOnDay(major.block, SchoolDay.Three) === LunchBlock ? v1.lunches[SchoolDay.Three] : undefined,
                [SchoolDay.Four]: getBlockForColorOnDay(major.block, SchoolDay.Four) === LunchBlock ? v1.lunches[SchoolDay.Four] : undefined,
                [SchoolDay.Five]: getBlockForColorOnDay(major.block, SchoolDay.Five) === LunchBlock ? v1.lunches[SchoolDay.Five] : undefined,
                [SchoolDay.Six]: getBlockForColorOnDay(major.block, SchoolDay.Six) === LunchBlock ? v1.lunches[SchoolDay.Six] : undefined,
                [SchoolDay.Seven]: getBlockForColorOnDay(major.block, SchoolDay.Seven) === LunchBlock ? v1.lunches[SchoolDay.Seven] : undefined
            },
            meets: {
                // If the color meets on that day, mark it
                [SchoolDay.One]: colorMeetsOnDay(major.block, SchoolDay.One),
                [SchoolDay.Two]: colorMeetsOnDay(major.block, SchoolDay.Two),
                [SchoolDay.Three]: colorMeetsOnDay(major.block, SchoolDay.Three),
                [SchoolDay.Four]: colorMeetsOnDay(major.block, SchoolDay.Four),
                [SchoolDay.Five]: colorMeetsOnDay(major.block, SchoolDay.Five),
                [SchoolDay.Six]: colorMeetsOnDay(major.block, SchoolDay.Six),
                [SchoolDay.Seven]: colorMeetsOnDay(major.block, SchoolDay.Seven)
            },
            name: major.name,
            room: major.room,
            semesters: {
                [Semester.First]: true,
                [Semester.Second]: true
            },
            teacher: major.teacher,
            uuid
        });
    }
    // Loop through minors
    for (const [uuid, minor] of v1.minors) {
        v2.classes.set(uuid, {
            block: minor.block,
            lab: false,
            lunches: {
                // If the class has a block D on that day and meets on that same day then get the lunch from the array in .lunches, else just leave undefined
                [SchoolDay.One]: getBlockForColorOnDay(minor.block, SchoolDay.One) === LunchBlock && minor.meets[SchoolDay.One] ? v1.lunches[SchoolDay.One] : undefined,
                [SchoolDay.Two]: getBlockForColorOnDay(minor.block, SchoolDay.Two) === LunchBlock && minor.meets[SchoolDay.Two] ? v1.lunches[SchoolDay.Two] : undefined,
                [SchoolDay.Three]: getBlockForColorOnDay(minor.block, SchoolDay.Three) === LunchBlock && minor.meets[SchoolDay.Three] ? v1.lunches[SchoolDay.Three] : undefined,
                [SchoolDay.Four]: getBlockForColorOnDay(minor.block, SchoolDay.Four) === LunchBlock && minor.meets[SchoolDay.Four] ? v1.lunches[SchoolDay.Four] : undefined,
                [SchoolDay.Five]: getBlockForColorOnDay(minor.block, SchoolDay.Five) === LunchBlock && minor.meets[SchoolDay.Five] ? v1.lunches[SchoolDay.Five] : undefined,
                [SchoolDay.Six]: getBlockForColorOnDay(minor.block, SchoolDay.Six) === LunchBlock && minor.meets[SchoolDay.Six] ? v1.lunches[SchoolDay.Six] : undefined,
                [SchoolDay.Seven]: getBlockForColorOnDay(minor.block, SchoolDay.Seven) === LunchBlock && minor.meets[SchoolDay.Seven] ? v1.lunches[SchoolDay.Seven] : undefined
            },
            meets: {
                // If the color meets on that day, mark it
                [SchoolDay.One]: minor.meets[SchoolDay.One],
                [SchoolDay.Two]: minor.meets[SchoolDay.Two],
                [SchoolDay.Three]: minor.meets[SchoolDay.Three],
                [SchoolDay.Four]: minor.meets[SchoolDay.Four],
                [SchoolDay.Five]: minor.meets[SchoolDay.Five],
                [SchoolDay.Six]: minor.meets[SchoolDay.Six],
                [SchoolDay.Seven]: minor.meets[SchoolDay.Seven]
            },
            name: minor.name,
            room: minor.room,
            semesters: {
                [Semester.First]: true,
                [Semester.Second]: true
            },
            teacher: minor.teacher,
            uuid
        });
    }
    // Loop through drs
    for (const [uuid, dr] of v1.DRs) {
        v2.classes.set(uuid, {
            block: dr.block,
            lab: false,
            lunches: {
                // If the class has a block D on that day and meets on that same day then get the lunch from the array in .lunches, else just leave undefined
                [SchoolDay.One]: getBlockForColorOnDay(dr.block, SchoolDay.One) === LunchBlock && dr.meets[SchoolDay.One] ? v1.lunches[SchoolDay.One] : undefined,
                [SchoolDay.Two]: getBlockForColorOnDay(dr.block, SchoolDay.Two) === LunchBlock && dr.meets[SchoolDay.Two] ? v1.lunches[SchoolDay.Two] : undefined,
                [SchoolDay.Three]: getBlockForColorOnDay(dr.block, SchoolDay.Three) === LunchBlock && dr.meets[SchoolDay.Three] ? v1.lunches[SchoolDay.Three] : undefined,
                [SchoolDay.Four]: getBlockForColorOnDay(dr.block, SchoolDay.Four) === LunchBlock && dr.meets[SchoolDay.Four] ? v1.lunches[SchoolDay.Four] : undefined,
                [SchoolDay.Five]: getBlockForColorOnDay(dr.block, SchoolDay.Five) === LunchBlock && dr.meets[SchoolDay.Five] ? v1.lunches[SchoolDay.Five] : undefined,
                [SchoolDay.Six]: getBlockForColorOnDay(dr.block, SchoolDay.Six) === LunchBlock && dr.meets[SchoolDay.Six] ? v1.lunches[SchoolDay.Six] : undefined,
                [SchoolDay.Seven]: getBlockForColorOnDay(dr.block, SchoolDay.Seven) === LunchBlock && dr.meets[SchoolDay.Seven] ? v1.lunches[SchoolDay.Seven] : undefined
            },
            meets: {
                // If the color meets on that day, mark it
                [SchoolDay.One]: dr.meets[SchoolDay.One],
                [SchoolDay.Two]: dr.meets[SchoolDay.Two],
                [SchoolDay.Three]: dr.meets[SchoolDay.Three],
                [SchoolDay.Four]: dr.meets[SchoolDay.Four],
                [SchoolDay.Five]: dr.meets[SchoolDay.Five],
                [SchoolDay.Six]: dr.meets[SchoolDay.Six],
                [SchoolDay.Seven]: dr.meets[SchoolDay.Seven]
            },
            name: "Directed Research",
            room: dr.room,
            semesters: {
                [Semester.First]: true,
                [Semester.Second]: true
            },
            teacher: dr.teacher,
            uuid
        });
    }

    return v2;
}