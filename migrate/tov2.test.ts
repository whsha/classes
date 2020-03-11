/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { toJS } from "mobx";
import { comparev1v2 } from "../__mocks__/compare";
import mocks from "../__mocks__/v1.json";
import parsev1 from "../v1/parse";
import { PreparedClassesStorev1 } from "../v1/store";
import { PreparedClassesStorev2 } from "../v2/prepared";
import migratetov2 from "./tov2";
jest.mock("uuid");

/** Mock v1 classes */
const mockClasses = mocks.map(parsev1);

describe("Test that no regressions occur in the migration using snapshots", () => {
    test.each(mockClasses)("Migrate class %#", (c) => {
        expect(toJS(migratetov2(c))).toMatchSnapshot();
    });
});

describe("Compare the results of the 'prepared classes' to make sure they are identical", () => {
    test.each(mockClasses)("Migrates %# and represents the same prepared value", (c) => {
        // Parse the v1 classes
        const v1 = parsev1(c);
        // Create and prepare the classes into the store
        const preparedv1 = new PreparedClassesStorev1();
        preparedv1.prepare(v1);

        // Migrate the v1 classes to v2
        const v2 = migratetov2(v1);
        // Create and prepare the classes into the store
        const preparedv2 = new PreparedClassesStorev2();
        preparedv2.prepare(v2);

        // Compare the classes
        comparev1v2(preparedv1, preparedv2);
    });
});