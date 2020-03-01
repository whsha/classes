/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { action, observable, toJS } from "mobx";
import { persist } from "mobx-persist";
import { Block, LunchBlock } from "./block";
import { daysClassMeets, IAdvisory, IClass } from "./class";
import { getBlockForColorOnDay } from "./days";
import { DayLunchMap, Lunch } from "./lunch";
import { SchoolDay } from "./schoolDay";

/** Store containig the users classes */
export class ClassesStorev2 {
    /** The users advisory */
    @persist("object") @observable
    public advisory: IAdvisory = { room: "", advisor: "" };

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
        this.advisory = store.advisory;
    }

    /** Clear the classes store */
    // tslint:disable-next-line: no-unbound-method
    @action.bound
    public clear() {
        this.advisory = { room: "", advisor: "" };
        this.classes = new Map();
    }
}

/** A way of storing classes that is easy to use for a today view */
type PreparedClassesv2 = {
    [K in SchoolDay]: {
        [B in Block]?: string
    }
};

/** Store containig the users classes prepared in a way for viewing */
export class PreparedClassesStorev2 extends ClassesStorev2 {
    /** The classes mapped into a format that can easily be searched through for a today view */
    @persist("object") @observable
    public prepared: PreparedClassesv2 = {
        [SchoolDay.One]: {},
        [SchoolDay.Two]: {},
        [SchoolDay.Three]: {},
        [SchoolDay.Four]: {},
        [SchoolDay.Five]: {},
        [SchoolDay.Six]: {},
        [SchoolDay.Seven]: {}
    };

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
    public prepare(classes: ClassesStorev2) {
        // Clone store as to not link to it
        const unlinkedClasses = toJS(classes, { recurseEverything: true, exportMapsAsObjects: false });

        this.advisory = unlinkedClasses.advisory;
        this.classes = unlinkedClasses.classes;

        const prepared: PreparedClassesv2 = {
            [SchoolDay.One]: {},
            [SchoolDay.Two]: {},
            [SchoolDay.Three]: {},
            [SchoolDay.Four]: {},
            [SchoolDay.Five]: {},
            [SchoolDay.Six]: {},
            [SchoolDay.Seven]: {}
        };

        for (const clazz of unlinkedClasses.classes.values()) {
            for (const schoolDay of daysClassMeets(clazz)) {
                const block = getBlockForColorOnDay(clazz.block, schoolDay);

                prepared[schoolDay][block] = clazz.uuid;

                // Load lunch
                if (block === LunchBlock) {
                    // tslint:disable-next-line: no-non-null-assertion
                    this.lunches[schoolDay] = clazz.lunches[schoolDay]!;
                }

                // Lab blcok
                if (block === Block.B && clazz.lab) {
                    prepared[schoolDay][Block.A] = clazz.uuid;
                }
            }
        }

        this.prepared = prepared;
    }

    /** Clear the classes store */
    // tslint:disable-next-line: no-unbound-method
    @action.bound
    public clear() {
        super.clear();

        this.prepared = {
            [SchoolDay.One]: {},
            [SchoolDay.Two]: {},
            [SchoolDay.Three]: {},
            [SchoolDay.Four]: {},
            [SchoolDay.Five]: {},
            [SchoolDay.Six]: {},
            [SchoolDay.Seven]: {}
        };
        this.lunches = {
            [SchoolDay.One]: Lunch.None,
            [SchoolDay.Two]: Lunch.None,
            [SchoolDay.Three]: Lunch.None,
            [SchoolDay.Four]: Lunch.None,
            [SchoolDay.Five]: Lunch.None,
            [SchoolDay.Six]: Lunch.None,
            [SchoolDay.Seven]: Lunch.None
        };
    }
}