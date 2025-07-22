sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox"
], function (BaseController, MessageBox) {
    "use strict";

    return BaseController.extend("inw.mockup.ewm.controller.CommissioningStart", {

        onInit: function () {
            // Mock data for demonstration
            this._mockTA = {
                number: "TA-2024-001234",
                status: "Offen",
                positionCount: 5,
                priority: "Hoch",
                targetArea: "Versand A"
            };
        },

        onNavBack: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("goodsIssue");
        },

        onScanTA: function () {
            this.onValidateTA();
        },

        onValidateTA: function () {
            const sTA = this.byId("taNumberInput").getValue();

            if (!sTA) {
                MessageBox.warning("Bitte TA-Nummer eingeben oder scannen.");
                return;
            }

            // Mock validation - always successful for demo
            const oMessageStrip = this.byId("taValidationMessage");
            const oDetailsPanel = this.byId("taDetailsPanel");

            oMessageStrip.setText("TA ist gültig und offen. " + this._mockTA.positionCount + " Positionen gefunden.");
            oMessageStrip.setType("Success");
            oMessageStrip.setVisible(true);
            oDetailsPanel.setVisible(true);

            // Update TA details
            this._updateTADetails();
        },

        _updateTADetails: function () {
            // In a real application, this would fetch data from the server
            // For demo purposes, we just show the mock data
        },

        onStartCommissioning: function () {
            const sTA = this.byId("taNumberInput").getValue();

            if (!sTA) {
                MessageBox.warning("Bitte zuerst einen gültigen TA scannen.");
                return;
            }

            // Navigate to commissioning overview first
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("commissioningOverview");
        }
    });
});
