/*!
 * Copyright (C) 2018-2020  Zachary Kohnen (DusterTheFirst)
 */

import { action, observable, toJS } from "mobx";
import { persist } from "mobx-persist";
import { Block, LunchBlock } from "./block";
import { daysClassMeets, IAdvisory, IClass } from "./class";
import { getBlockForColorOnDay } from "./days";
import { Lunch } from "./lunch";
import { SchoolDay } from "./schoolDay";
import { ClassesStorev2 } from "./store";

/** A way of storing classes that is easy to use for a today view */
export type PreparedClassesv2 = {
    [K in SchoolDay]: {
        /** The classes that meet on the day */
        classes: {
            [B in Block]?: string;
        };
        /** The advisory for the day */
        advisory: string;
        /** The lunch for the day */
        lunch: Lunch;
    }
};

/** A constant of the empty prepared classes */
const EMPTY_PREPARED_CLASSES: PreparedClassesv2 = {
    [SchoolDay.One]: {
        advisory: "",
        classes: {},
        lunch: Lunch.None
    },
    [SchoolDay.Two]: {
        advisory: "",
        classes: {},
        lunch: Lunch.None
    },
    [SchoolDay.Three]: {
        advisory: "",
        classes: {},
        lunch: Lunch.None
    },
    [SchoolDay.Four]: {
        advisory: "",
        classes: {},
        lunch: Lunch.None
    },
    [SchoolDay.Five]: {
        advisory: "",
        classes: {},
        lunch: Lunch.None
    },
    [SchoolDay.Six]: {
        advisory: "",
        classes: {},
        lunch: Lunch.None
    },
    [SchoolDay.Seven]: {
        advisory: "",
        classes: {},
        lunch: Lunch.None
    }
};

/** Store containig the users classes prepared in a way for viewing */
export class PreparedClassesStorev2 extends ClassesStorev2 {
    /** The classes mapped into a format that can easily be searched through for a today view */
    @persist("object") @observable
    private prepared = EMPTY_PREPARED_CLASSES;

    /** Get the classes for the day */
    public getClassesForDay(day: SchoolDay) {
        return this.prepared[day].classes;
    }

    /** Get the adisory for the day */
    public getAdvisoryForDay(day: SchoolDay): IAdvisory {
        return this.advisories.get(this.prepared[day].advisory) as IAdvisory;
    }

    /** Get the lunch for the day */
    public getLunchForDay(day: SchoolDay): Lunch {
        return this.prepared[day].lunch;
    }

    /** Get the class that meets at the specified block on the specified day */
    public getClassAtBlockOnDay(block: Block, day: SchoolDay): IClass | undefined {
        return this.classes.get(this.getClassesForDay(day)[block] ?? "");
    }

    /** Prepare classes from a classes store */
    // tslint:disable-next-line: no-unbound-method
    @action.bound
    public prepare(classes: ClassesStorev2) {
        // Clone store as to not link to it
        const unlinkedClasses = toJS(classes, { recurseEverything: true, exportMapsAsObjects: false });

        this.advisories = unlinkedClasses.advisories;
        this.classes = unlinkedClasses.classes;

        const prepared = EMPTY_PREPARED_CLASSES;

        for (const clazz of unlinkedClasses.classes.values()) {
            for (const schoolDay of daysClassMeets(clazz.meets)) {
                const block = getBlockForColorOnDay(clazz.block, schoolDay);

                prepared[schoolDay].classes[block] = clazz.uuid;

                // Load lunch
                if (block === LunchBlock) {
                    // tslint:disable-next-line: no-non-null-assertion
                    prepared[schoolDay].lunch = clazz.lunches[schoolDay]!;
                }

                // Lab block
                if (block === Block.B && clazz.lab) {
                    prepared[schoolDay].classes[Block.A] = clazz.uuid;
                }
            }
        }

        for (const advisory of unlinkedClasses.advisories.values()) {
            for (const schoolDay of daysClassMeets(advisory.meets)) {
                prepared[schoolDay].advisory = advisory.uuid;
            }
        }

        this.prepared = prepared;
    }

    /** Clear the classes store */
    // tslint:disable-next-line: no-unbound-method
    @action.bound
    public clear() {
        super.clear();

        this.prepared = EMPTY_PREPARED_CLASSES;
    }
}