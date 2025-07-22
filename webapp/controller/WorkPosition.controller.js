sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (BaseController, MessageBox, MessageToast) {
    "use strict";

    return BaseController.extend("inw.mockup.ewm.controller.WorkPosition", {

        onCheckPosition() {
            const oInput = this.byId("taPositionInput");
            const sValue = oInput.getValue();

            if (!sValue) {
                MessageToast.show("Bitte geben Sie eine TA-Position ein");
                return;
            }

            // Simulation: Position gefunden und Details anzeigen
            const oPanel = this.byId("positionDetailsPanel");
            oPanel.setVisible(true);

            MessageToast.show("TA-Position gefunden und Details geladen");
        },

        onSubmitTAPosition() {
            this.onCheckPosition();
        },

        onRefreshPosition() {
            const oInput = this.byId("taPositionInput");
            oInput.setValue("");
            const oPanel = this.byId("positionDetailsPanel");
            oPanel.setVisible(false);
            MessageToast.show("Position zurückgesetzt");
        },

        onShowQuittierungDialog() {
            MessageBox.success("Position wurde erfolgreich in den Arbeitsvorrat aufgenommen.\n\nMöchten Sie direkt zur Quittierung der Aufgabe springen?", {
                title: "Arbeitsvorrat",
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.YES,
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.YES) {
                        this._navigateToQuittierung();
                    } else {
                        this.onNavBack();
                    }
                }
            });
        },

        _navigateToQuittierung() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("workQueueAcknowledge");
            MessageToast.show("Navigation zur Quittierung...");
        },

        onCancel() {
            this.onNavBack();
        }
    });
});
