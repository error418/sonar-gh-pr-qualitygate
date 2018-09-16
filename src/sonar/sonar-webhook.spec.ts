"use strict";

import { expect, assert } from "chai";
import * as chai from "chai";
import * as sinon from "sinon";
chai.use(require("sinon-chai"));

import { Response, Request, NextFunction } from "express";
import { AppEvent } from "../app-events";
import { SonarWebhookEvent } from "./model/sonar-wehook-event";

import SonarWebhook from "./sonar-webhook";
import { EventEmitter } from "events";

import EventBus from "../event-bus";
import { ConfigurationService } from "../configuration";

describe("Sonar Webhook", () => {

	let uut: SonarWebhook;
	let testData: any;
	let eventBusMock: any;
	let responseMock: any;

	beforeEach(function () {

		const configurationMock: any = {
			get: sinon.stub().returns({
				context: "test",
				sonar: {
					logWebhookEvents: false
				}
			})
		};

		responseMock = {sendStatus: sinon.stub()};

		eventBusMock = {
			emit: sinon.stub(),
			register: sinon.stub()
		};

		testData = Object.assign({}, require("../../test/base-sonar-webhook.json"));
		// reset test data properties for test cases
		testData.properties = {};

		uut = new SonarWebhook(
			eventBusMock as EventBus,
			configurationMock as ConfigurationService
		);
	});


	it("should send commit status event on relevant hook", () => {

		testData.properties = {
			"sonar.analysis.commitId": "12345",
			"sonar.analysis.repository": "testOrg/testRepo"
		};

		uut.webhook({ body: testData } as Request, responseMock);

		sinon.assert.calledWith(eventBusMock.emit, AppEvent.sonarAnalysisComplete, sinon.match((val) => {
			return val.properties.commitId == "12345" && val.properties.repository == "testOrg/testRepo";
		}));
	});

	it("should send ignored event on missing properties", () => {
		uut.webhook({ body: testData } as Request, responseMock);
		sinon.assert.calledWith(eventBusMock.emit, AppEvent.webhookEventIgnored, SonarWebhook.IGNORE_ID);
	});

	it("should not send ignored event on partially set properties", () => {
		testData.properties = {
			"sonar.analysis.commitId": "12345"
		};

		uut.webhook({ body: testData } as Request, responseMock);
		sinon.assert.calledWith(eventBusMock.emit, AppEvent.webhookEventIgnored, SonarWebhook.IGNORE_ID);
	});
});
