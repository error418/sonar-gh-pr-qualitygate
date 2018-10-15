import { injectable } from "inversify";
import * as Nunjucks from "nunjucks";
import { LOGGER } from "../logger";

@injectable()
export class TemplateEngine {

	private readonly environment: Nunjucks.Environment;

	constructor() {
		this.environment = Nunjucks.configure("templates");

		this.environment.addFilter("gateStatusIcon", this.qualityGateStatusIconFilter);
		this.environment.addFilter("gateConditionIcon", this.qualityGateConditionIconFilter);
	}

	/** Gets and fills a template
	 *
	 * @param template Template to use
	 * @param context context supplied to the template
	 */
	public template<T extends TemplateData>(template: Templates, context: T): string {
		LOGGER.debug("processing template %s", template);
		return this.environment.render(template, context);
	}

	public qualityGateStatusIconFilter(str: string) {
		if (str == "OK") return ":large_blue_circle:";
		if (str == "ERROR") return ":red_circle:";
		if (str == "NO_VALUE") return ":white_circle:";

		return "";
	}

	public qualityGateConditionIconFilter(str: string) {
		if (str == "NOT_EQUALS") return "&ne;";
		if (str == "EQUALS") return "=";
		if (str == "GREATER_THAN") return "&gt;";
		if (str == "LESS_THAN") return "&lt;";

		return str;
	}
}

export enum Templates {
	/** Template for GitHub Check Run summaries */
	CHECK_RUN_SUMMARY = "check-run/summary.md.tpl"
}

export interface TemplateData {
}
