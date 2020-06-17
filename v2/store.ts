/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { Result } from "@badrap/result";
import { action, computed, observable, toJS } from "mobx";
import { persist } from "mobx-persist";
import { daysClassMeets, IAdvisory, IClass, MeetDays, Semesters, timesClassMeetsPerCycle } from "./class";
import { IConflict, IError, IWarning, Problem, ProblemMap, Severity } from "./problems";
import { SCHOOL_DAYS, SchoolDay } from "./schoolDay";
import { Semester } from "./semester";

/** Type to extract the properties of a type */
export type PropertiesOf<T> = { [P in keyof T]: T[P] extends Function ? never : P }[keyof T];

/** An error type for parsing the ClassesStorev2 from a string */
export class ClassesStorev2MissingProp extends Error {
    /** The parameter that is effected */
    public readonly prop: PropertiesOf<ClassesStorev2>;

    constructor(prop: PropertiesOf<ClassesStorev2>) {
        super(`Property ${prop} is missing from the json object`);
        this.prop = prop;
    }
}

/** Store containig the users classes */
export class ClassesStorev2 {
    /** The users advisory */
    @persist("map") @observable
    public advisories = new Map<string, IAdvisory>();

    /** A map of the users Classes by their uuid */
    @persist("map") @observable
    public classes = new Map<string, IClass>();

    /** Load the data from another classes store into this classes store without linking the two */
    // tslint:disable-next-line: no-unbound-method
    @action.bound
    public hydrateFrom(linkedstore: ClassesStorev2) {
        // Clone store as to not link to it
        const store = toJS(linkedstore, { exportMapsAsObjects: false, recurseEverything: true });

        this.classes = store.classes;
        this.advisories = store.advisories;
    }

    /** Clear the classes store */
    // tslint:disable-next-line: no-unbound-method
    @action.bound
    public clear() {
        this.advisories.clear();
        this.classes.clear();
    }

    /** Method to get the string representation of the store */
    public toString() {
        return JSON.stringify(toJS<Pick<ClassesStorev2, "advisories" | "classes">>({
            advisories: this.advisories, classes: this.classes
        }));
    }

    /** Method to parse a ClassesStorev2 from a json string */
    public static fromString(str: string): Result<ClassesStorev2, ClassesStorev2MissingProp> {
        const parsed = JSON.parse(str) as Partial<ClassesStorev2>;

        if (parsed.advisories === undefined) {
            return Result.err(new ClassesStorev2MissingProp("advisories"));
        } else if (parsed.classes === undefined) {
            return Result.err(new ClassesStorev2MissingProp("classes"));
        }

        const store = new ClassesStorev2();

        store.advisories = observable.map(parsed.advisories);
        store.classes = observable.map(parsed.classes);

        return Result.ok(store);
    }

    /** The problems with the classes in the store */
    @computed
    public get classProblems() {
        const map = new ProblemMap<ClassProblems>();

        const classesMeets: Semesters<MeetDays<string[]>> = {
            [Semester.First]: {
                [SchoolDay.One]: [],
                [SchoolDay.Two]: [],
                [SchoolDay.Three]: [],
                [SchoolDay.Four]: [],
                [SchoolDay.Five]: [],
                [SchoolDay.Six]: [],
                [SchoolDay.Seven]: [],
            },
            [Semester.Second]: {
                [SchoolDay.One]: [],
                [SchoolDay.Two]: [],
                [SchoolDay.Three]: [],
                [SchoolDay.Four]: [],
                [SchoolDay.Five]: [],
                [SchoolDay.Six]: [],
                [SchoolDay.Seven]: [],
            }
        };

        for (const [uuid, clazz] of this.classes) {
            // Empty Name
            if (clazz.name === "") {
                map.add(uuid, {
                    field: "name",
                    problem: Problem.Empty,
                    severity: Severity.Warn
                });
            }
            // Empty Teacher
            if (clazz.teacher === "") {
                map.add(uuid, {
                    field: "teacher",
                    problem: Problem.Empty,
                    severity: Severity.Warn
                });
            }
            // Empty Room
            if (clazz.room === "") {
                map.add(uuid, {
                    field: "room",
                    problem: Problem.Empty,
                    severity: Severity.Warn
                });
            }
        }

        return map;
    }

    /** The problems with the advisories in the store */
    @computed
    public get advisoryProblems() {
        const map = new ProblemMap<AdvisoryProblems>();

        const advisoriesMeets: MeetDays<string[]> = {
            [SchoolDay.One]: [],
            [SchoolDay.Two]: [],
            [SchoolDay.Three]: [],
            [SchoolDay.Four]: [],
            [SchoolDay.Five]: [],
            [SchoolDay.Six]: [],
            [SchoolDay.Seven]: [],
        };

        for (const [uuid, advisory] of this.advisories) {
            // Empty advisor
            if (advisory.advisor === "") {
                map.add(uuid, {
                    field: "advisor",
                    problem: Problem.Empty,
                    severity: Severity.Warn
                });
            }
            // Empty room
            if (advisory.room === "") {
                map.add(uuid, {
                    field: "room",
                    problem: Problem.Empty,
                    severity: Severity.Warn
                });
            }

            // If it never meets, add an error
            if (timesClassMeetsPerCycle(advisory.meets) === 0) {
                map.add(uuid, {
                    field: "meets",
                    problem: Problem.Empty,
                    severity: Severity.Error
                });
            } else {
                // Loop through each day it does meet
                for (const schoolDay of daysClassMeets(advisory.meets)) {
                    // If there are other advisories on that day, add them as conflicts
                    for (const other of advisoriesMeets[schoolDay]) {
                        map.add(uuid, {
                            conflict: other,
                            field: "meets",
                            problem: Problem.Conflict,
                            severity: Severity.Error
                        });
                    }

                    // Add itself to the list
                    advisoriesMeets[schoolDay].push(uuid);
                }
            }
        }

        // If there is not at least one advisory per day, add the error
        if (SCHOOL_DAYS.some(x => advisoriesMeets[x].length === 0)) {
            map.add(ProblemMap.ALL_KEY, {
                field: "meets",
                problem: Problem.Bare,
                severity: Severity.Error
            });
        }

        return map;
    }
}

/** Problems for an advisory */
export type AdvisoryProblems =
    IWarning<IAdvisory, "advisor" | "room", Problem.Empty>
    | IError<IAdvisory, "meets", Problem.Empty | Problem.Bare>
    | IConflict<IAdvisory, "meets">;

/** Problems for a class */
export type ClassProblems =
    IWarning<IClass, "name" | "teacher" | "room", Problem.Empty>
    | IWarning<IClass, "block", Problem.Empty>
    | IError<IClass, "meets", Problem.Empty | Problem.Invalid>
    | IError<IClass, "semesters", Problem.Empty>
    | IConflict<IClass, "meets">
    | IConflict<IClass, "lab">;