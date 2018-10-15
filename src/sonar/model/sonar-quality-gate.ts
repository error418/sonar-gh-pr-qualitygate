"use strict";

export enum QualityGateStatus {
	OK = "OK",
	NO_VALUE = "NO_VALUE"
}

export class SonarQualityGate {
	conditions: Condition[];
	name: string;
	status: string;

	constructor(data = {}) {
		Object.assign(this, data);
	}

	public getFailureCount() {
		let failures = 0;

		if (this.conditions && this.conditions.length > 0) {
			this.conditions.forEach((value: Condition) => {
				if (value.status != QualityGateStatus.OK) {
					failures++;
				}
			});
		}

		return failures;
	}
}

export interface Condition {
	errorThreshold: string;
	metric: string;
	onLeakPeriod: boolean;
	operator: "GREATER_THAN" | "LESS_THAN" | "EQUALS" | "NOT_EQUALS" | string;
	status: "OK" | "ERROR" | "NO_VALUE" | string;
	value: string;
}