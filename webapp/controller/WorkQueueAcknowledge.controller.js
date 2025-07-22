sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (BaseController, MessageBox, MessageToast) {
    "use strict";

    return BaseController.extend("inw.mockup.ewm.controller.WorkQueueAcknowledge", {

        onInit() {
            // Set up routing
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("workQueueAcknowledge").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            console.log("WorkQueueAcknowledge route matched");
        },

        onPositionSelectionChange(oEvent) {
            const sSelectedKey = oEvent.getParameter("selectedItem").getKey();
            MessageToast.show("Position gewechselt zu: " + sSelectedKey);
        },

        onShowAcknowledgmentDialog() {
            const oDialog = this.byId("acknowledgmentDialog");

            // Reset difference code section
            this.byId("differenceCodeSection").setVisible(false);
            this.byId("differenceCodeComboBox").setSelectedKey("");

            oDialog.open();
        },

        onQuantityChange() {
            const oInput = this.byId("quantityInputWorkQueue");
            const sEnteredQuantity = oInput.getValue();
            const sSollQuantity = "100"; // Soll-Menge (kann später dynamisch gemacht werden)
            const oDifferenceSection = this.byId("differenceCodeSection");
            const oDifferenceComboBox = this.byId("differenceCodeComboBox");

            // Prüfen ob sich die Menge unterscheidet
            if (sEnteredQuantity && sEnteredQuantity !== sSollQuantity) {
                // Abweichung erkannt - Differenzkennzeichen anzeigen
                oDifferenceSection.setVisible(true);
                oInput.setValueState("Warning");
                oInput.setValueStateText("Abweichende Menge - Kennzeichen erforderlich");
            } else {
                // Keine Abweichung - Differenzkennzeichen verstecken
                oDifferenceSection.setVisible(false);
                oDifferenceComboBox.setSelectedKey("");
                oInput.setValueState("Success");
                oInput.setValueStateText("Menge bestätigt");
            }
        },

        onCheckDialogDestinationPlace() {
            const oInput = this.byId("dialogDestinationPlaceInput");
            const sPlace = oInput.getValue();

            // Simple validation - set to success for demo
            oInput.setValueState("Success");
            oInput.setValueStateText("Lagerplatz verfügbar");

            MessageToast.show("Lagerplatz geprüft: " + sPlace);
        },

        onAcceptAcknowledgment() {
            const sEnteredQuantity = this.byId("quantityInputWorkQueue").getValue();
            const sSollQuantity = "100";
            const sDifferenceCode = this.byId("differenceCodeComboBox").getSelectedKey();

            // Validierung: Bei abweichender Menge muss Kennzeichen gewählt werden
            if (sEnteredQuantity !== sSollQuantity && !sDifferenceCode) {
                MessageBox.error("Bei abweichender Menge muss ein Differenzkennzeichen ausgewählt werden.");
                return;
            }

            this.byId("acknowledgmentDialog").close();

            // Show success message and navigate back
            MessageBox.success(
                "TA-Position erfolgreich quittiert!\n\nArbeitsvorrat wurde aktualisiert.",
                {
                    title: "Quittierung erfolgreich",
                    onClose: () => {
                        const oRouter = this.getOwnerComponent().getRouter();
                        oRouter.navTo("main");
                    }
                }
            );
        },

        onCancelAcknowledgment() {
            this.byId("acknowledgmentDialog").close();
        }
    });
});
