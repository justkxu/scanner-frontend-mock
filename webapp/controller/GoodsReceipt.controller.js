sap.ui.define(["./BaseController"], function (BaseController) {
    "use strict";

    return BaseController.extend("inw.mockup.ewm.controller.GoodsReceipt", {
        onInit() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("goodsReceipt").attachPatternMatched(this.onObjectMatched, this);
        },

        onObjectMatched() {
            // Handler für Route-Matching
        },

        onPressWorkPositionBuilder() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("workPosition");
        },

        onPressWorkQueueAcknowledge() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("workQueueAcknowledge");
        },

        onPressWorkQueueView() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("workQueueView");
        }
    });
});
