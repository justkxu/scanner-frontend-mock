sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("inw.mockup.ewm.controller.CommissioningOverview", {

        onInit: function () {
            // Set up routing
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("commissioningOverview").attachPatternMatched(this._onRouteMatched, this);

            // Initialize positions data
            const oPositionsData = {
                positions: [
                    {
                        positionNumber: "001",
                        material: "MAT-001234",
                        materialText: "Schrauben M8x20",
                        quantity: 100,
                        unit: "ST",
                        locationFrom: "A-01-02-03",
                        locationTo: "VERS-01",
                        statusIcon: "sap-icon://accept",
                        statusColor: "Default"
                    },
                    {
                        positionNumber: "002",
                        material: "MAT-001235",
                        materialText: "Muttern M8",
                        quantity: 50,
                        unit: "ST",
                        locationFrom: "B-02-03-04",
                        locationTo: "VERS-02",
                        statusIcon: "sap-icon://accept",
                        statusColor: "Default"
                    },
                    {
                        positionNumber: "003",
                        material: "MAT-001236",
                        materialText: "Unterlegscheiben M8",
                        quantity: 200,
                        unit: "ST",
                        locationFrom: "C-03-04-05",
                        locationTo: "VERS-03",
                        statusIcon: "sap-icon://accept",
                        statusColor: "Default"
                    },
                    {
                        positionNumber: "004",
                        material: "MAT-001237",
                        materialText: "Gewindestangen M10",
                        quantity: 25,
                        unit: "ST",
                        locationFrom: "A-04-05-06",
                        locationTo: "VERS-04",
                        statusIcon: "sap-icon://nutrition-activity",
                        statusColor: "Default"
                    },
                    {
                        positionNumber: "005",
                        material: "MAT-001238",
                        materialText: "Dichtungen 12mm",
                        quantity: 75,
                        unit: "ST",
                        locationFrom: "D-05-06-07",
                        locationTo: "VERS-05",
                        statusIcon: "sap-icon://accept",
                        statusColor: "Default"
                    }
                ]
            };

            // Set model
            const oModel = new JSONModel(oPositionsData);
            this.getView().setModel(oModel);
        },

        _onRouteMatched: function () {
            console.log("CommissioningOverview route matched - waiting for user action");
            // Just log that we've arrived at the overview page
            // No automatic navigation - wait for user to press "Kommissionierung starten"
        },

        onNavBack: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("commissioningStart");
        },

        onStartCommissioning: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("commissioningProcess", {
                taNumber: "TA-2024-001234"
            });
        },

        onPositionPress: function (oEvent) {
            // Remove automatic navigation - let user decide when to start commissioning
            // Just show which position was selected
            const oBindingContext = oEvent.getSource().getBindingContext();
            const sPosition = oBindingContext.getProperty("positionNumber");
            console.log("Position " + sPosition + " selected - but not navigating automatically");
        }
    });
});
