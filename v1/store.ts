/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { action, observable, toJS } from "mobx";
import { persist } from "mobx-persist";
import { Block } from "./blocks/block";
import { SchoolDay } from "./calendar/types";
import { IAdvisory, IDR, IMajor, IMinor } from "./class/classes";
import { DayLunchMap, Lunch } from "./class/lunch";
import { irregularMeetDays } from "./class/primitives";
import { getBlockForColorOnDay, getSchoolDaysThatHaveColor } from "./schoolDays";

/** Store containig the users classes */
export class ClassesStorev1 {
    /** The users advisory */
    @persist("object") @observable
    public advisory: IAdvisory = { room: "", teacher: "" };

    /** The lunches for a user */
    @persist("object") @observable
    public lunches: DayLunchMap = {
        [SchoolDay.One]: Lunch.None,
        [SchoolDay.Two]: Lunch.None,
        [SchoolDay.Three]: Lunch.None,
        [SchoolDay.Four]: Lunch.None,
        [SchoolDay.Five]: Lunch.None,
        [SchoolDay.Six]: Lunch.None,
        [SchoolDay.Seven]: Lunch.None
    };

    /** A map of the users Majors by their uuid */
    @persist("map") @observable
    public majors: Map<string, IMajor> = observable.map();
    /** A map of the users Minors by their uuid */
    @persist("map") @observable
    public minors: Map<string, IMinor> = observable.map();
    /** A map of the users DRs by their uuid */
    @persist("map") @observable
    public DRs: Map<string, IDR> = observable.map();

    /** Load the data from another classes store into this classes store without linking the two */
    // tslint:disable-next-line: no-unbound-method
    @action.bound
    public hydrateFrom(linkedstore: ClassesStorev1) {
        // Clone store as to not link to it
        const store = toJS(linkedstore, { exportMapsAsObjects: false, recurseEverything: true });

        this.majors = store.majors;
        this.minors = store.minors;
        this.DRs = store.DRs;
        this.advisory = store.advisory;
        this.lunches = store.lunches;
    }

    /** Clear the classes store */
    // tslint:disable-next-line: no-unbound-method
    @action.bound
    public clear() {
        this.advisory = { room: "", teacher: "" };
        this.lunches = {
            [SchoolDay.One]: Lunch.None,
            [SchoolDay.Two]: Lunch.None,
            [SchoolDay.Three]: Lunch.None,
            [SchoolDay.Four]: Lunch.None,
            [SchoolDay.Five]: Lunch.None,
            [SchoolDay.Six]: Lunch.None,
            [SchoolDay.Seven]: Lunch.None
        };
        this.majors = observable.map();
        this.minors = observable.map();
        this.DRs = observable.map();
    }

}

/** A way of storing classes that is easy to use for a today view */
export type PreparedClassesv1 = {
    [K in SchoolDay]: {
        [B in Block]?: IMajor | IMinor | IDR
    }
};

/** Store containig the users classes prepared in a way for viewing */
export class PreparedClassesStorev1 {
    /** The classes prepared into a format that can easily be searched through for a today view */
    @persist("object") @observable
    public prepared: PreparedClassesv1 = {
        [SchoolDay.One]: {},
        [SchoolDay.Two]: {},
        [SchoolDay.Three]: {},
        [SchoolDay.Four]: {},
        [SchoolDay.Five]: {},
        [SchoolDay.Six]: {},
        [SchoolDay.Seven]: {}
    };

    /** The advisory */
    @persist("object") @observable
    public advisory: IAdvisory = { room: "", teacher: "" };

    /** The lunches for a user */
    @persist("object") @observable
    public lunches: DayLunchMap = {
        [SchoolDay.One]: Lunch.None,
        [SchoolDay.Two]: Lunch.None,
        [SchoolDay.Three]: Lunch.None,
        [SchoolDay.Four]: Lunch.None,
        [SchoolDay.Five]: Lunch.None,
        [SchoolDay.Six]: Lunch.None,
        [SchoolDay.Seven]: Lunch.None
    };

    /** Prepare classes from a classes store */
    // tslint:disable-next-line: no-unbound-method
    @action.bound
    public prepare(classes: ClassesStorev1) {
        // Clone store as to not link to it
        const unlinkedClasses = toJS(classes, { recurseEverything: true, exportMapsAsObjects: false });

        const prepared: PreparedClassesv1 = {
            [SchoolDay.One]: {},
            [SchoolDay.Two]: {},
            [SchoolDay.Three]: {},
            [SchoolDay.Four]: {},
            [SchoolDay.Five]: {},
            [SchoolDay.Six]: {},
            [SchoolDay.Seven]: {}
        };

        for (const major of unlinkedClasses.majors.values()) {
            const schoolDays = getSchoolDaysThatHaveColor(major.block);

            for (const schoolDay of schoolDays) {
                const block = getBlockForColorOnDay(major.block, schoolDay);

                prepared[schoolDay][block] = major;

                // If this is a lab, add it to block A
                if (block === Block.B && major.lab) {
                    prepared[schoolDay][Block.A] = major;
                }
            }
        }

        for (const minor of unlinkedClasses.minors.values()) {
            for (const schoolDay of irregularMeetDays(minor)) {
                const block = getBlockForColorOnDay(minor.block, schoolDay);

                prepared[schoolDay][block] = minor;
            }
        }

        for (const dr of unlinkedClasses.DRs.values()) {
            for (const schoolDay of irregularMeetDays(dr)) {
                const block = getBlockForColorOnDay(dr.block, schoolDay);

                prepared[schoolDay][block] = dr;
            }
        }

        this.advisory = unlinkedClasses.advisory;
        this.lunches = unlinkedClasses.lunches;
        this.prepared = prepared;
    }

    /** Clear the classes store */
    // tslint:disable-next-line: no-unbound-method
    @action.bound
    public clear() {
        this.prepared = {
            [SchoolDay.One]: {},
            [SchoolDay.Two]: {},
            [SchoolDay.Three]: {},
            [SchoolDay.Four]: {},
            [SchoolDay.Five]: {},
            [SchoolDay.Six]: {},
            [SchoolDay.Seven]: {}
        };
    }
}