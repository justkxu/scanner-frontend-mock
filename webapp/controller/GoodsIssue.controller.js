sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("inw.mockup.ewm.controller.GoodsIssue", {

        onNavBack: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("main");
        },

        onPressCommissioning: function () {
            // Navigate to commissioning start view
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("commissioningStart");
        },

        onPressTAConfirmation: function () {
            // Navigate to final TA acknowledgment view
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("finalTAQuittierung");
        }
    });
});
