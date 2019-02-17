import { ConfigurationService, Configuration } from "../src/configuration";
import EventBus from "../src/core/event/event-bus";
import * as sinon from "sinon";
import SonarClient from "../src/sonar/client/sonar-client";
import InstallationStorage from "../src/core/github/client/installation-storage";
import RedisClientFactory from "../src/core/db/redis-client";
import { TemplateEngine } from "../src/core/template/template-engine";
import TokenStorage from "../src/core/github/client/token-storage";

export class EventBusMock extends EventBus {
	constructor() {
		super();
		this.emit = sinon.stub();
		this.register = sinon.stub();
	}
}

export class ConfigurationServiceMock extends ConfigurationService {
	constructor() {
		super("./test/config.yml");
	}
}

export class SonarClientMock extends SonarClient {
	constructor(configService = new ConfigurationServiceMock(), eventBus = new EventBusMock()) {
		super(configService, eventBus);
	}
}

export class RedisClientFactoryMock extends RedisClientFactory {
	constructor() {
		super(new ConfigurationServiceMock(), new EventBusMock());
		this.createClient = sinon.stub();
		this.connectionCount = sinon.stub().returns(2);
		this.unhealthyConnectionCount = sinon.stub().returns(0);
	}
}

export class InstallationStorageMock extends InstallationStorage {
	constructor() {
		super(new RedisClientFactoryMock());
		this.getInstallationId = sinon.stub().resolves(10);
		this.isSyncRequired = sinon.stub().resolves(false);
		this.removeSyncFlag = sinon.stub();
		this.store = sinon.stub();
	}
}

export class TokenStorageMock extends TokenStorage {
	constructor() {
		super(new RedisClientFactoryMock());

		this.getToken = sinon.stub().resolves(null);
		this.store = sinon.stub();
	}
}

export class TemplateEngineMock extends TemplateEngine {
	constructor() {
		super();

		this.addFilter = sinon.stub();
		this.template = sinon.stub().returns("stubbed template text");
	}
}

