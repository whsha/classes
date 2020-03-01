/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { BlockColor } from "./block";
import { IClass, joinMeetData, timesClassMeetsPerCycle } from "./class";
import { SchoolDay } from "./schoolDay";
import { Semester } from "./semester";

/** A dummy class to use for tests */
const dummyClass: IClass = {
    block: BlockColor.Red,
    lab: false,
    lunches: {},
    meets: {
        [SchoolDay.One]: false,
        [SchoolDay.Two]: false,
        [SchoolDay.Three]: false,
        [SchoolDay.Four]: false,
        [SchoolDay.Five]: false,
        [SchoolDay.Six]: false,
        [SchoolDay.Seven]: false
    },
    name: "",
    room: "",
    semesters: {
        [Semester.First]: true,
        [Semester.Second]: true
    },
    teacher: "",
    uuid: ""
};

describe("Tests utility functions for classes", () => {
    it("Correctly calculates timesClassMeetsPerCycle", () => {
        expect(timesClassMeetsPerCycle({
            ...dummyClass,
            meets: {
                [SchoolDay.One]: false,
                [SchoolDay.Two]: true,
                [SchoolDay.Three]: false,
                [SchoolDay.Four]: true,
                [SchoolDay.Five]: false,
                [SchoolDay.Six]: true,
                [SchoolDay.Seven]: false
            }
        })).toStrictEqual(3);
        expect(timesClassMeetsPerCycle({
            ...dummyClass,
            meets: {
                [SchoolDay.One]: false,
                [SchoolDay.Two]: true,
                [SchoolDay.Three]: true,
                [SchoolDay.Four]: true,
                [SchoolDay.Five]: true,
                [SchoolDay.Six]: true,
                [SchoolDay.Seven]: false
            }
        })).toStrictEqual(5);
    });

    it("Corrctly calculates joinMeetData", () => {
        expect(joinMeetData(
            {
                [SchoolDay.One]: false,
                [SchoolDay.Two]: true,
                [SchoolDay.Three]: false,
                [SchoolDay.Four]: true,
                [SchoolDay.Five]: false,
                [SchoolDay.Six]: true,
                [SchoolDay.Seven]: false
            },
            {
                [SchoolDay.One]: true,
                [SchoolDay.Two]: false,
                [SchoolDay.Three]: false,
                [SchoolDay.Four]: false,
                [SchoolDay.Five]: false,
                [SchoolDay.Six]: false,
                [SchoolDay.Seven]: true
            }
        )).toStrictEqual({
            [SchoolDay.One]: true,
            [SchoolDay.Two]: true,
            [SchoolDay.Three]: false,
            [SchoolDay.Four]: true,
            [SchoolDay.Five]: false,
            [SchoolDay.Six]: true,
            [SchoolDay.Seven]: true
        });
    });
});