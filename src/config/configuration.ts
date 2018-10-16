import * as yaml from "js-yaml";
import { injectable } from "inversify";
import { LOGGER } from "../logger";

@injectable()
export class ConfigurationService {
	private readonly CONFIG_FILE = "./swingletree.conf.yaml";
	private config: Configuration;

	constructor() {
		LOGGER.info("loading configuration file %s", this.CONFIG_FILE);
		this.config = new Configuration(
			yaml.safeLoad(
				require("fs").readFileSync(this.CONFIG_FILE)
			) as Configuration
		);
	}

	public get(): Configuration {
		return this.config;
	}
}

export class Configuration {
	public readonly github: GithubConfig;
	public readonly sonar: SonarConfig;
	public readonly storage: StorageConfig;
	public readonly context: string;

	constructor(model: Configuration) {
		this. context = model.context;

		this.github = new GithubConfig(model.github);
		this.sonar = new SonarConfig(model.sonar);
		this.storage = new StorageConfig(model.storage);
	}
}

export class GithubConfig {
	public readonly appId: number;
	public readonly keyFile: string;
	public readonly base: string;
	public readonly webhookSecret: string;
	public readonly appPublicPage: string;

	constructor(model: GithubConfig) {
		this.appId = Number(process.env["GITHUB_APPID"] || model.appId);
		this.keyFile = process.env["GITHUB_KEY_FILE"] || model.keyFile;
		this.base = process.env["GITHUB_BASE"] || model.base;
		this.webhookSecret = process.env["GITHUB_SECRET"] || model.webhookSecret;
		this.appPublicPage = process.env["GITHUB_APP_PAGE"] || model.appPublicPage;
	}
}

export class StorageConfig {
	public readonly database: string;
	public readonly password: string;

	constructor(model: StorageConfig) {
		this.database = process.env["DATABASE_HOST"] || model.database;
		this.password = process.env["DATABASE_PASSWORD"] || model.password;
	}
}

export class SonarConfig {
	public readonly token: string;
	public readonly base: string;
	public readonly secret: string;
	public readonly logWebhookEvents: boolean;
	public readonly context: string;

	constructor(model: SonarConfig) {
		this.token = process.env["SONAR_TOKEN"] || model.token;
		this.base = process.env["SONAR_BASE"] || model.base;
		this.secret = process.env["SONAR_SECRET"] || model.secret;
		this.context = model.context;
		this.logWebhookEvents = ("true" == process.env["LOG_SONAR_WEBHOOKS"]) || model.logWebhookEvents;
	}
}
