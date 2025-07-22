sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (BaseController, MessageBox, MessageToast, JSONModel) {
    "use strict";

    return BaseController.extend("inw.mockup.ewm.controller.FinalTAQuittierung", {

        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("finalTAQuittierung").attachPatternMatched(this._onRouteMatched, this);
        },

        onExit: function () {
            if (this._pWorkplaceControlDialog) {
                this._pWorkplaceControlDialog.then(function (oDialog) {
                    oDialog.destroy();
                });
                this._pWorkplaceControlDialog = null;
            }
        },

        _onRouteMatched: function () {
            console.log("FinalTAQuittierung route matched");
        },

        onNavBack: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("goodsIssue");
        },

        onFinalAcknowledge: function () {
            this.onOpenWorkplaceControl();
        },

        onOpenWorkplaceControl: function () {
            if (!this._pWorkplaceControlDialog) {
                this._pWorkplaceControlDialog = this.loadFragment({
                    name: "inw.mockup.ewm.fragment.WorkplaceControlDialog"
                });
            }

            this._pWorkplaceControlDialog.then(function (oDialog) {
                // Initialize workplace dialog model with pre-validated workplace
                const expectedWorkplace = "AP-FINAL-001";
                const oWorkplaceDialogModel = new JSONModel({
                    taNumber: "TA-2024-001234",
                    expectedWorkplace: expectedWorkplace,
                    validated: true // Pre-validate for best-case scenario
                });

                this.getView().setModel(oWorkplaceDialogModel, "workplaceDialog");

                oDialog.open();

                // Set up pre-filled and validated workplace input after dialog is opened
                setTimeout(() => {
                    const oInput = this.byId("workplaceDialogInput");
                    if (oInput) {
                        oInput.setValue(expectedWorkplace);
                        oInput.setValueState("Success");
                        oInput.setValueStateText("Arbeitsplatz korrekt");
                        oInput.focus();
                    }
                }, 100);
            }.bind(this));
        },

        onWorkplaceDialogLiveChange: function () {
            this._validateWorkplaceInDialog();
        },

        onWorkplaceDialogSubmit: function () {
            this.onValidateWorkplaceDialog();
        },

        onValidateWorkplaceDialog: function () {
            this._validateWorkplaceInDialog();
        },

        _validateWorkplaceInDialog: function () {
            const oInput = this.byId("workplaceDialogInput");
            const sWorkplace = oInput.getValue();
            const oModel = this.getView().getModel("workplaceDialog");
            const sExpectedWorkplace = oModel.getProperty("/expectedWorkplace");

            if (!sWorkplace) {
                oInput.setValueState("None");
                oModel.setProperty("/validated", false);
            } else if (sWorkplace === sExpectedWorkplace) {
                oInput.setValueState("Success");
                oInput.setValueStateText("Arbeitsplatz korrekt");
                oModel.setProperty("/validated", true);

                MessageToast.show("Arbeitsplatz erfolgreich validiert!", {
                    duration: 2000,
                    width: "300px"
                });
            } else {
                oInput.setValueState("Error");
                oInput.setValueStateText("Falscher Arbeitsplatz. Erwartet: " + sExpectedWorkplace);
                oModel.setProperty("/validated", false);
            }
        },

        onConfirmWorkplaceControl: function () {
            const oModel = this.getView().getModel("workplaceDialog");

            if (oModel.getProperty("/validated")) {
                // Close dialog
                this.byId("workplaceControlDialog").close();

                // Proceed directly to success message
                this._completeFinalAcknowledgment();
            }
        },

        onCancelWorkplaceControl: function () {
            this.byId("workplaceControlDialog").close();
        },

        _completeFinalAcknowledgment: function () {
            // Show success message
            MessageBox.success(
                "TA 'TA-2024-001234' wurde erfolgreich final quittiert!\n\nDie Auslagerung ist abgeschlossen.",
                {
                    title: "Erfolgreich abgeschlossen",
                    onClose: function () {
                        // Navigate to main page (application start page)
                        const oRouter = this.getOwnerComponent().getRouter();
                        oRouter.navTo("main");
                    }.bind(this)
                }
            );
        }
    });
});
