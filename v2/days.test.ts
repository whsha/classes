/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { BlockColor } from "./block";
import { getBlockColorsForDay, getLabBlockColorForDay, getLunchBlockColorForDay } from "./days";
import { SchoolDay } from "./schoolDay";

describe("Tests utility functions for days", () => {
    it("Correctly calculates getBlockColorsForDay", () => {
        expect(getBlockColorsForDay(SchoolDay.One)).toMatchSnapshot();
        expect(getBlockColorsForDay(SchoolDay.Two)).toMatchSnapshot();
        expect(getBlockColorsForDay(SchoolDay.Three)).toMatchSnapshot();
        expect(getBlockColorsForDay(SchoolDay.Four)).toMatchSnapshot();
        expect(getBlockColorsForDay(SchoolDay.Five)).toMatchSnapshot();
        expect(getBlockColorsForDay(SchoolDay.Six)).toMatchSnapshot();
        expect(getBlockColorsForDay(SchoolDay.Seven)).toMatchSnapshot();
    });

    it("Correctly calculates getLabBlockColorForDay", () => {
        expect(getLabBlockColorForDay(SchoolDay.One)).toStrictEqual(BlockColor.Orange);
        expect(getLabBlockColorForDay(SchoolDay.Five)).toStrictEqual(BlockColor.Red);
        expect(getLabBlockColorForDay(SchoolDay.Seven)).toStrictEqual(BlockColor.Blue);
    });

    it("Correctly calculates getLunchBlockColorForDay", () => {
        expect(getLunchBlockColorForDay(SchoolDay.One)).toStrictEqual(BlockColor.Green);
        expect(getLunchBlockColorForDay(SchoolDay.Five)).toStrictEqual(BlockColor.Yellow);
        expect(getLunchBlockColorForDay(SchoolDay.Seven)).toStrictEqual(BlockColor.Green);
    });
});