sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit test suite for the UI5 Application: inw.mockup.ewm",
		defaults: {
			page: "ui5://test-resources/inw/mockup/ewm/Test.qunit.html?testsuite={suite}&test={name}",
			qunit: {
				version: 2
			},
			sinon: {
				version: 1
			},
			ui5: {
				language: "EN",
				theme: "sap_horizon"
			},
			coverage: {
				only: "inw/mockup/ewm/",
				never: "test-resources/inw/mockup/ewm/"
			},
			loader: {
				paths: {
					"inw/mockup/ewm": "../"
				}
			}
		},
		tests: {
			"unit/unitTests": {
				title: "Unit tests for inw.mockup.ewm"
			},
			"integration/opaTests": {
				title: "Integration tests for inw.mockup.ewm"
			}
		}
	};
});
