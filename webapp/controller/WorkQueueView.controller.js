sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox"
], function (BaseController, MessageBox) {
    "use strict";

    return BaseController.extend("inw.mockup.ewm.controller.WorkQueueView", {

        onInit: function () {
            // Mock data for work queue positions
            const oModel = new sap.ui.model.json.JSONModel({
                workQueuePositions: [
                    {
                        taPosition: "1001234567-001",
                        materialNr: "MAT-001234",
                        materialDesc: "Schrauben M8x20",
                        quantity: "100 ST",
                        storageLocation: "A-01-02-03",
                        followUpType: "Einlagerung",
                        stockQualification: "Verfügbar",
                        ChargeEvaluation: "Keine",

                    },
                    {
                        taPosition: "1001234567-002",
                        materialNr: "MAT-001235",
                        materialDesc: "Muttern M8",
                        quantity: "200 ST",
                        storageLocation: "B-02-03-04",
                        followUpType: "Einlagerung",
                        stockQualification: "Verfügbar",
                        ChargeEvaluation: "Keine",

                    },
                    {
                        taPosition: "1001234567-003",
                        materialNr: "MAT-001236",
                        materialDesc: "Unterlegscheiben M8",
                        quantity: "300 ST",
                        storageLocation: "C-03-04-05",
                        followUpType: "Einlagerung",
                        stockQualification: "Verfügbar",
                        ChargeEvaluation: "Keine",
                    }
                ]
            });
            this.getView().setModel(oModel);
        },

        onPositionSelectionChange: function (oEvent) {
            const oSelectedItem = oEvent.getParameter("selectedItem");
            if (!oSelectedItem) {
                return;
            }

            const oContext = oSelectedItem.getBindingContext();
            const oData = oContext.getObject();

            // Update details fields - always visible now
            this.byId("selectedTaPositionText").setText(oData.taPosition);
            this.byId("selectedMaterialNrText").setText(oData.materialNr);
            this.byId("selectedMaterialDescText").setText(oData.materialDesc);
            this.byId("selectedQuantityText").setText(oData.quantity);
            this.byId("selectedStorageLocationText").setText(oData.storageLocation);
            this.byId("selectedFollowUpTypeText").setText(oData.followUpType);
            this.byId("selectedStockQualificationText").setText(oData.stockQualification);
            this.byId("selectedChargeEvaluationText").setText(oData.ChargeEvaluation);

            // Store selected position for later use
            this._selectedPosition = oData;
        },

        onShowActionDialog: function () {
            if (!this._selectedPosition) {
                MessageBox.warning("Bitte wählen Sie zuerst eine Position aus.");
                return;
            }

            const oDialog = this.byId("actionDialog");
            if (oDialog) {
                oDialog.open();
            }
        },

        onRemovePositionFromDialog: function () {
            // Close dialog first
            const oDialog = this.byId("actionDialog");
            if (oDialog) {
                oDialog.close();
            }

            if (!this._selectedPosition) {
                return;
            }

            this._removePositionFromQueue();
        },

        onNavigateToAcknowledgeFromDialog: function () {
            // Close dialog first
            const oDialog = this.byId("actionDialog");
            if (oDialog) {
                oDialog.close();
            }

            if (!this._selectedPosition) {
                return;
            }

            // Navigate to acknowledgment view with selected position
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("workQueueAcknowledge", {
                positionId: this._selectedPosition.taPosition
            });
        },

        onRemovePosition: function () {
            if (!this._selectedPosition) {
                return;
            }

            const that = this;
            MessageBox.confirm(
                "Möchten Sie die Position " + this._selectedPosition.taPosition + " aus dem Arbeitsvorrat entfernen?",
                {
                    title: "Position entfernen",
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            that._removePositionFromQueue();
                        }
                    }
                }
            );
        },

        _removePositionFromQueue: function () {
            const oModel = this.getView().getModel();
            const aPositions = oModel.getProperty("/workQueuePositions");

            // Find and remove the selected position
            const iIndex = aPositions.findIndex(function (pos) {
                return pos.taPosition === this._selectedPosition.taPosition;
            }.bind(this));

            if (iIndex !== -1) {
                aPositions.splice(iIndex, 1);
                oModel.setProperty("/workQueuePositions", aPositions);

                // Clear all text fields
                this.byId("selectedTaPositionText").setText("");
                this.byId("selectedMaterialNrText").setText("");
                this.byId("selectedMaterialDescText").setText("");
                this.byId("selectedQuantityText").setText("");
                this.byId("selectedStorageLocationText").setText("");
                this.byId("selectedFollowUpTypeText").setText("");
                this.byId("selectedStockQualificationText").setText("");
                this.byId("selectedChargeEvaluationText").setText("");

                // Clear selection
                this.byId("workQueueComboBox").setSelectedKey("");
                this._selectedPosition = null;

                MessageBox.success("Position wurde aus dem Arbeitsvorrat entfernt.");
            }
        },

        onNavigateToAcknowledge: function () {
            if (!this._selectedPosition) {
                return;
            }

            // Navigate to acknowledgment view with selected position
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("workQueueAcknowledge", {
                positionId: this._selectedPosition.taPosition
            });
        },

        onRefreshWorkQueue: function () {
            // Refresh work queue data
            MessageBox.information("Arbeitsvorrat wird aktualisiert...");

            // In a real application, this would reload data from the server
            // For now, we just show a message
        }
    });
});
