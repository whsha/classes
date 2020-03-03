/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { joinMeetData, timesClassMeetsPerCycle } from "./class";
import { SchoolDay } from "./schoolDay";

describe("Tests utility functions for classes", () => {
    it("Correctly calculates timesClassMeetsPerCycle", () => {
        expect(timesClassMeetsPerCycle({
            [SchoolDay.One]: false,
            [SchoolDay.Two]: true,
            [SchoolDay.Three]: false,
            [SchoolDay.Four]: true,
            [SchoolDay.Five]: false,
            [SchoolDay.Six]: true,
            [SchoolDay.Seven]: false
        })).toStrictEqual(3);
        expect(timesClassMeetsPerCycle({
            [SchoolDay.One]: false,
            [SchoolDay.Two]: true,
            [SchoolDay.Three]: true,
            [SchoolDay.Four]: true,
            [SchoolDay.Five]: true,
            [SchoolDay.Six]: true,
            [SchoolDay.Seven]: false
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