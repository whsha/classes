/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { v4 as uuid } from "uuid";
import { IAdvisory } from "./class";
import { IConflict, IProblem, isConflict, ProblemMap, Severity } from "./problems";
import { SchoolDay } from "./schoolDay";
import { ClassesStorev2, PossibleProblem } from "./store";

it("Can differentiate between a problem and a conflict", () => {
    const conflict: IConflict<IAdvisory, "meets", PossibleProblem.ConflictingMeet> = {
        conflict: uuid(),
        field: "meets",
        problem: PossibleProblem.ConflictingMeet,
        severity: Severity.Error
    };

    const problem: IProblem<IAdvisory, "meets", PossibleProblem.NotEnoughMeet, Severity.Error> = {
        field: "meets",
        problem: PossibleProblem.NotEnoughMeet,
        severity: Severity.Error
    };

    expect(isConflict<IAdvisory, "meets", PossibleProblem.ConflictingMeet>(conflict)).toBeTruthy();
    expect(isConflict(problem)).toBeFalsy();
});

/** A sample advisory for use in tests */
const sampleAdvisory: () => IAdvisory = () => ({
    advisor: "Cool Teacher Man",
    meets: {
        [SchoolDay.One]: false,
        [SchoolDay.Two]: false,
        [SchoolDay.Three]: false,
        [SchoolDay.Four]: false,
        [SchoolDay.Five]: false,
        [SchoolDay.Six]: false,
        [SchoolDay.Seven]: false
    },
    room: "Cool Room",
    uuid: uuid()
});

describe("Store detects problems for advisories", () => {
    it("Detects too few advisories 1", () => {
        const store = new ClassesStorev2();

        const advisory = sampleAdvisory();

        store.advisories.set(advisory.uuid, {
            ...advisory,
            meets: {
                ...advisory.meets,
                [SchoolDay.One]: true
            },
        });

        expect(store.advisoryProblems.get(ProblemMap.ALL_KEY)?.length).toStrictEqual(1);
        expect(store.advisoryProblems.get(ProblemMap.ALL_KEY)).toContainEqual({
            field: "meets",
            problem: PossibleProblem.NotEnoughMeet,
            severity: Severity.Error
        });
    });

    it("Detects too few advisories 2", () => {
        const store = new ClassesStorev2();

        const advisory1 = sampleAdvisory();

        store.advisories.set(advisory1.uuid, {
            ...advisory1,
            meets: {
                ...advisory1.meets,
                [SchoolDay.One]: true,
            },
        });

        const advisory2 = sampleAdvisory();

        store.advisories.set(advisory2.uuid, {
            ...advisory1,
            meets: {
                ...advisory1.meets,
                [SchoolDay.Three]: true,
                [SchoolDay.Four]: true,
                [SchoolDay.Six]: true,
            },
        });

        expect(store.advisoryProblems.get(ProblemMap.ALL_KEY)?.length).toStrictEqual(1);
        expect(store.advisoryProblems.get(ProblemMap.ALL_KEY)).toContainEqual({
            field: "meets",
            problem: PossibleProblem.NotEnoughMeet,
            severity: Severity.Error
        });
    });

    it("Detects overlapping and too few advisories", () => {
        const store = new ClassesStorev2();

        const advisory1 = sampleAdvisory();

        store.advisories.set(advisory1.uuid, {
            ...advisory1,
            meets: {
                ...advisory1.meets,
                [SchoolDay.One]: true,
                [SchoolDay.Three]: true,
            },
        });

        const advisory2 = sampleAdvisory();

        store.advisories.set(advisory2.uuid, {
            ...advisory2,
            meets: {
                ...advisory2.meets,
                [SchoolDay.Three]: true,
                [SchoolDay.Four]: true,
                [SchoolDay.Six]: true,
            },
        });

        expect(store.advisoryProblems.get(ProblemMap.ALL_KEY)?.length).toStrictEqual(1);
        expect(store.advisoryProblems.get(ProblemMap.ALL_KEY)).toContainEqual({
            field: "meets",
            problem: PossibleProblem.NotEnoughMeet,
            severity: Severity.Error
        });

        // No error caught, only later ones will throw
        expect(store.advisoryProblems.get(advisory1.uuid)).toBeUndefined();

        expect(store.advisoryProblems.get(advisory2.uuid)?.length).toStrictEqual(1);
        expect(store.advisoryProblems.get(advisory2.uuid)).toContainEqual({
            conflict: advisory1.uuid,
            field: "meets",
            problem: PossibleProblem.ConflictingMeet,
            severity: Severity.Error
        });

        const advisory3 = sampleAdvisory();

        store.advisories.set(advisory3.uuid, {
            ...advisory3,
            meets: {
                ...advisory3.meets,
                [SchoolDay.Four]: true,
            },
        });

        expect(store.advisoryProblems.get(advisory3.uuid)?.length).toStrictEqual(1);
        expect(store.advisoryProblems.get(advisory3.uuid)).toContainEqual({
            conflict: advisory2.uuid,
            field: "meets",
            problem: PossibleProblem.ConflictingMeet,
            severity: Severity.Error
        });

        const advisory4 = sampleAdvisory();

        store.advisories.set(advisory4.uuid, {
            ...advisory4,
            meets: {
                ...advisory4.meets,
                [SchoolDay.Three]: true,
            },
        });

        expect(store.advisoryProblems.get(advisory4.uuid)?.length).toStrictEqual(2);
        expect(store.advisoryProblems.get(advisory4.uuid)).toContainEqual({
            conflict: advisory1.uuid,
            field: "meets",
            problem: PossibleProblem.ConflictingMeet,
            severity: Severity.Error
        });
        expect(store.advisoryProblems.get(advisory4.uuid)).toContainEqual({
            conflict: advisory2.uuid,
            field: "meets",
            problem: PossibleProblem.ConflictingMeet,
            severity: Severity.Error
        });
    });
});