/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { Block } from "../v1/blocks/block";
import { SchoolDay } from "../v1/calendar/types";
import { hasClassType, isDR, isMajor } from "../v1/class/type";
import { PreparedClassesStorev1 } from "../v1/store";
import { colorMeetsOnDay } from "../v2/days";
import { PreparedClassesStorev2 } from "../v2/store";

/** Custom deep comparison between the v1 and v2 classes */
export function comparev1v2(v1: PreparedClassesStorev1, v2: PreparedClassesStorev2) {
    // Compare the classes
    for (const day of Object.values(SchoolDay).filter(key => isNaN(Number(SchoolDay[key as unknown as keyof typeof SchoolDay]))) as unknown as SchoolDay[]) {
        for (const block of Object.values(Block)) {
            const v1class = v1.prepared[day][block];
            const v2class = v2.getClassAtBlockOnDay(block, day);

            // Compare various parts
            expect(v1class?.block).toStrictEqual(v2class?.block);
            expect(v1class?.room).toStrictEqual(v2class?.room);
            expect(v1class?.teacher).toStrictEqual(v2class?.teacher);

            // Comparisons based on the type of class
            if (hasClassType(v1class)) {
                // Comparison between majors and nonmajors' lab and meets
                if (isMajor(v1class)) {
                    expect(v1class.lab).toStrictEqual(v2class?.lab);
                    expect({
                        // If the color meets on that day, mark it
                        [SchoolDay.One]: colorMeetsOnDay(v1class.block, SchoolDay.One),
                        [SchoolDay.Two]: colorMeetsOnDay(v1class.block, SchoolDay.Two),
                        [SchoolDay.Three]: colorMeetsOnDay(v1class.block, SchoolDay.Three),
                        [SchoolDay.Four]: colorMeetsOnDay(v1class.block, SchoolDay.Four),
                        [SchoolDay.Five]: colorMeetsOnDay(v1class.block, SchoolDay.Five),
                        [SchoolDay.Six]: colorMeetsOnDay(v1class.block, SchoolDay.Six),
                        [SchoolDay.Seven]: colorMeetsOnDay(v1class.block, SchoolDay.Seven)
                    }).toStrictEqual(v2class?.meets);
                } else {
                    expect(false).toStrictEqual(v2class?.lab);
                    expect(v1class.meets).toStrictEqual(v2class?.meets);
                }

                // Name comparison
                if (isDR(v1class)) {
                    expect("Directed Research").toStrictEqual(v2class?.name);
                } else {
                    expect(v1class.name).toStrictEqual(v2class?.name);
                }
            }
        }
    }

    // Compare the advisories
    for (const day of Object.values(SchoolDay).filter(key => isNaN(Number(SchoolDay[key as unknown as keyof typeof SchoolDay]))) as unknown as SchoolDay[]) {
        expect(v1.advisory.teacher).toStrictEqual(v2.getAdvisoryForDay(day)?.advisor);
        expect(v1.advisory.room).toStrictEqual(v2.getAdvisoryForDay(day)?.room);
    }

    // Compare the lunches
    for (const day of Object.values(SchoolDay).filter(key => isNaN(Number(SchoolDay[key as unknown as keyof typeof SchoolDay]))) as unknown as SchoolDay[]) {
        expect(v1.lunches[day]).toStrictEqual(v2.getLunchForDay(day));
    }
}