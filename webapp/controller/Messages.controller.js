sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox"
], function (BaseController, MessageBox) {
    "use strict";

    return BaseController.extend("inw.mockup.ewm.controller.Messages", {

        onPressTransportOrderNotFound() {
            MessageBox.error("TA/Position nicht gefunden", {
                title: "Fehler",
                actions: [MessageBox.Action.OK],
                emphasizedAction: MessageBox.Action.OK
            });
        },

        onPressAlreadyAcknowledged() {
            MessageBox.error("Position bereits im quittierten Zustand", {
                title: "Fehler",
                actions: [MessageBox.Action.OK],
                emphasizedAction: MessageBox.Action.OK
            });
        },

        onPressNotInAvailableStock() {
            MessageBox.error("Position nicht im verfügbaren Bestand", {
                title: "Fehler",
                actions: [MessageBox.Action.OK],
                emphasizedAction: MessageBox.Action.OK
            });
        }
    });
});
