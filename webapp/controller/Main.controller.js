sap.ui.define([
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("inw.mockup.ewm.controller.Main", {

		onInit: function () {
			// Call parent onInit to initialize user model
			BaseController.prototype.onInit.apply(this, arguments);
		},

		onPressReceipt() {
			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("goodsReceipt");
		},

		onPressIssue() {
			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("goodsIssue");
		},

		onPressMessages() {
			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("messages");
		}
	});
});
