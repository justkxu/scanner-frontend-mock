sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (BaseController, MessageBox, Fragment, JSONModel) {
    "use strict";

    return BaseController.extend("inw.mockup.ewm.controller.CommissioningProcess", {

        onInit: function () {
            // Initialize position tracking
            this._positionIndex = 1;
            this._totalPositions = 5;

            // Initialize dialog state model
            const oDialogModel = new JSONModel({
                serialNumbers: [],
                locationConfirmed: false,
                materialConfirmed: false,
                quantityConfirmed: false,
                serialNumbersConfirmed: false,
                serialRequired: false,
                quantityDiffers: false,
                differenceCode: "",
                differenceCodeConfirmed: false
            });
            this.getView().setModel(oDialogModel, "dialog");

            // Initialize serial scan dialog model
            const oScanDialogModel = new JSONModel({
                serialNumbers: [],
                materialText: "",
                requiredQuantity: 0,
                scannedCount: 0
            });
            this.getView().setModel(oScanDialogModel, "scanDialog");

            // Initialize first position with rich mock data
            this._currentPosition = {
                number: "TA-2024-001234-001",
                location: "A-01-02-03",
                material: "MAT-001234",
                materialText: "Schrauben M8x20",
                targetQuantity: 100,
                unit: "ST",
                serialRequired: false
            };

            // Set up routing
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("commissioningProcess").attachPatternMatched(this._onRouteMatched, this);

            // Update header title
            this._updateHeaderTitle();
        },

        onExit: function () {
            // Cleanup dialogs to prevent memory leaks and ID conflicts
            if (this._pCommissioningDialog) {
                this._pCommissioningDialog.then(function (oDialog) {
                    oDialog.destroy();
                });
                this._pCommissioningDialog = null;
            }

            if (this._pSerialScanDialog) {
                this._pSerialScanDialog.then(function (oDialog) {
                    oDialog.destroy();
                });
                this._pSerialScanDialog = null;
            }
        },

        _resetProgress: function () {
            // Reset position tracking to start from beginning
            this._positionIndex = 1;

            // Reset dialog state model
            const oDialogModel = this.getView().getModel("dialog");
            if (oDialogModel) {
                oDialogModel.setData({
                    serialNumbers: [],
                    locationConfirmed: false,
                    materialConfirmed: false,
                    quantityConfirmed: false,
                    serialNumbersConfirmed: false,
                    serialRequired: false,
                    quantityDiffers: false,
                    differenceCode: "",
                    differenceCodeConfirmed: false
                });
            }

            // Reset serial scan dialog model
            const oScanDialogModel = this.getView().getModel("scanDialog");
            if (oScanDialogModel) {
                oScanDialogModel.setData({
                    serialNumbers: [],
                    materialText: "",
                    requiredQuantity: 0,
                    scannedCount: 0
                });
            }

            // Reset to first position
            this._currentPosition = {
                number: "TA-2024-001234-001",
                location: "A-01-02-03",
                material: "MAT-001234",
                materialText: "Schrauben M8x20",
                targetQuantity: 100,
                unit: "ST",
                serialRequired: false
            };

            console.log("Progress reset - back to position 1");
        },

        _onRouteMatched: function (oEvent) {
            const oArgs = oEvent.getParameter("arguments");
            console.log("Route matched with arguments:", oArgs);

            // If position parameter is provided, set it
            if (oArgs.position) {
                this._positionIndex = parseInt(oArgs.position, 10);
                console.log("Setting position from route:", this._positionIndex);

                // Load the correct position if it's not the first one
                if (this._positionIndex > 1) {
                    this._loadPositionByIndex(this._positionIndex);
                }
            } else {
                // No position parameter - reset to start from beginning
                this._resetProgress();
            }

            // Update header title after setting position
            this._updateHeaderTitle();
        },

        _loadPositionByIndex: function (iPosition) {
            console.log("Loading position by index:", iPosition);

            // Mock data for all positions
            const aAllPositions = [
                {
                    number: "TA-2024-001234-001",
                    location: "A-01-02-03",
                    material: "MAT-001234",
                    materialText: "Schrauben M8x20",
                    targetQuantity: 100,
                    unit: "ST",
                    serialRequired: false
                },
                {
                    number: "TA-2024-001234-002",
                    location: "B-02-03-04",
                    material: "MAT-001235",
                    materialText: "Muttern M8",
                    targetQuantity: 50,
                    unit: "ST",
                    serialRequired: false
                },
                {
                    number: "TA-2024-001234-003",
                    location: "C-03-04-05",
                    material: "MAT-001236",
                    materialText: "Unterlegscheiben M8",
                    targetQuantity: 200,
                    unit: "ST",
                    serialRequired: false
                },
                {
                    number: "TA-2024-001234-004",
                    location: "A-04-05-06",
                    material: "MAT-001237",
                    materialText: "Gewindestangen M10",
                    targetQuantity: 25,
                    unit: "ST",
                    serialRequired: true
                },
                {
                    number: "TA-2024-001234-005",
                    location: "D-05-06-07",
                    material: "MAT-001238",
                    materialText: "Dichtungen 12mm",
                    targetQuantity: 75,
                    unit: "ST",
                    serialRequired: false
                }
            ];

            if (iPosition >= 1 && iPosition <= aAllPositions.length) {
                this._currentPosition = aAllPositions[iPosition - 1];

                // Update position display with error handling
                this._updateViewElements();
            }
        },

        _updateViewElements: function () {
            try {
                // Update position text
                const oPositionText = this.byId("positionText");
                if (oPositionText) {
                    oPositionText.setText(`Position ${this._positionIndex} von ${this._totalPositions}: ${this._currentPosition.materialText}`);
                }

                // Update material text
                const oMaterialText = this.byId("materialText");
                if (oMaterialText) {
                    oMaterialText.setText(this._currentPosition.materialText);
                }

                // Update material number
                const oMaterialNumber = this.byId("materialNumber");
                if (oMaterialNumber) {
                    oMaterialNumber.setText(this._currentPosition.material);
                }

                // Update target quantity
                const oTargetQuantity = this.byId("targetQuantity");
                if (oTargetQuantity) {
                    oTargetQuantity.setText(`${this._currentPosition.targetQuantity} ${this._currentPosition.unit}`);
                }

                // Update target location
                const oTargetLocation = this.byId("targetLocation");
                if (oTargetLocation) {
                    oTargetLocation.setText(this._currentPosition.location);
                }
            } catch (error) {
                console.error("Error updating view elements:", error);
            }
        },

        onNavBack: function () {
            // Reset progress when navigating back manually
            this._resetProgress();

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("commissioningOverview");
        },

        onAddSerialNumber: function () {
            const sSerialNumber = this.byId("serialNumberInput").getValue();

            if (!sSerialNumber) {
                MessageBox.warning("Bitte Serialnummer eingeben.");
                return;
            }

            // Add to list (simplified for demo)
            this.byId("serialNumberInput").setValue("");
            MessageBox.success("Serialnummer " + sSerialNumber + " hinzugefügt.");
        },

        onRemoveSerialNumber: function () {
            MessageBox.success("Serialnummer entfernt.");
        },

        onConfirmPosition: function () {
            // Open the comprehensive commissioning dialog
            this._openCommissioningDialog();
        },

        _openCommissioningDialog: function () {
            if (!this._pCommissioningDialog) {
                this._pCommissioningDialog = Fragment.load({
                    id: this.getView().getId(),
                    name: "inw.mockup.ewm.fragment.CommissioningDialog",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }

            this._pCommissioningDialog.then(function (oDialog) {
                // Reset dialog state
                this._resetDialogState();
                oDialog.open();

                // Focus on location input
                setTimeout(() => {
                    const oLocationInput = this.byId("commissioningDialogLocationInput");
                    if (oLocationInput) {
                        oLocationInput.focus();
                    }
                }, 100);
            }.bind(this));
        },

        _resetDialogState: function () {
            const oDialogModel = this.getView().getModel("dialog");
            oDialogModel.setData({
                serialNumbers: [],
                locationConfirmed: false,
                materialConfirmed: false,
                quantityConfirmed: false,
                serialNumbersConfirmed: !this._currentPosition.serialRequired, // Auto-confirm if not required
                serialRequired: this._currentPosition.serialRequired,
                quantityDiffers: false,
                differenceCode: "",
                differenceCodeConfirmed: false
            });

            // Prefill with best case scenario (correct values)
            const oLocationInput = this.byId("commissioningDialogLocationInput");
            const oMaterialInput = this.byId("commissioningDialogMaterialInput");
            const oQuantityInput = this.byId("commissioningDialogQuantityInput");

            if (oLocationInput) oLocationInput.setValue(this._currentPosition.location);
            if (oMaterialInput) oMaterialInput.setValue(this._currentPosition.material);
            if (oQuantityInput) oQuantityInput.setValue(this._currentPosition.targetQuantity.toString());            // Prefill serial numbers if required
            if (this._currentPosition.serialRequired) {
                // Generate mock serial numbers for best case scenario
                const aMockSerialNumbers = [];
                for (let i = 1; i <= this._currentPosition.targetQuantity; i++) {
                    aMockSerialNumbers.push({
                        serialNumber: `${this._currentPosition.material}-${String(i).padStart(4, '0')}`
                    });
                }
                oDialogModel.setProperty("/serialNumbers", aMockSerialNumbers);
                oDialogModel.setProperty("/serialNumbersConfirmed", true);
            }

            // Reset input states and trigger validation
            this._resetInputStates();

            // Trigger automatic validation for prefilled values
            setTimeout(() => {
                this._validateLocation();
                this._validateMaterial();
                this._validateQuantity();
            }, 100);

            // Disable complete button initially
            const oCompleteButton = this.byId("completeButton");
            if (oCompleteButton) {
                oCompleteButton.setEnabled(false);
            }
        },

        _resetInputStates: function () {
            const oLocationInput = this.byId("commissioningDialogLocationInput");
            const oMaterialInput = this.byId("commissioningDialogMaterialInput");
            const oQuantityInput = this.byId("commissioningDialogQuantityInput");
            const oDifferenceCodeSelect = this.byId("commissioningDialogDifferenceCodeSelect");

            if (oLocationInput) oLocationInput.setValueState("None");
            if (oMaterialInput) oMaterialInput.setValueState("None");
            if (oQuantityInput) oQuantityInput.setValueState("None");
            if (oDifferenceCodeSelect) oDifferenceCodeSelect.setValueState("None");
        },

        onLocationLiveChange: function () {
            this._validateLocation();
        },

        onMaterialLiveChange: function () {
            this._validateMaterial();
        },

        onQuantityLiveChange: function () {
            this._validateQuantity();
        },

        onDifferenceCodeSelectionChange: function () {
            this._validateDifferenceCode();
        },

        onConfirmDifferenceCode: function () {
            // Legacy method - validation now happens automatically
            this._validateDifferenceCode();
        },

        _validateDifferenceCode: function () {
            const oDifferenceCodeSelect = this.byId("commissioningDialogDifferenceCodeSelect");
            const oDialogModel = this.getView().getModel("dialog");

            if (!oDifferenceCodeSelect) {
                return;
            }

            const sSelectedKey = oDifferenceCodeSelect.getSelectedKey();

            if (!sSelectedKey) {
                oDifferenceCodeSelect.setValueState("Error");
                oDifferenceCodeSelect.setValueStateText("Bitte Differenzkennzeichen auswählen");
                oDialogModel.setProperty("/differenceCodeConfirmed", false);
            } else {
                oDifferenceCodeSelect.setValueState("Success");
                this.byId("commissioningDialogQuantityInput").setValueState("Success");

                oDifferenceCodeSelect.setValueStateText("Differenzkennzeichen ausgewählt");
                oDialogModel.setProperty("/differenceCode", sSelectedKey);
                oDialogModel.setProperty("/differenceCodeConfirmed", true);
            }
            this._checkAllConfirmed();
        },

        _validateLocation: function () {
            const sLocation = this.byId("commissioningDialogLocationInput").getValue();
            const sExpectedLocation = this._currentPosition.location;
            const oLocationInput = this.byId("commissioningDialogLocationInput");
            const oDialogModel = this.getView().getModel("dialog");

            if (!sLocation) {
                oLocationInput.setValueState("None");
                oDialogModel.setProperty("/locationConfirmed", false);
            } else if (sLocation === sExpectedLocation) {
                oLocationInput.setValueState("Success");
                oLocationInput.setValueStateText("Lagerplatz korrekt");
                oDialogModel.setProperty("/locationConfirmed", true);
            } else {
                oLocationInput.setValueState("Error");
                oLocationInput.setValueStateText(`Falscher Lagerplatz. Erwartet: ${sExpectedLocation}`);
                oDialogModel.setProperty("/locationConfirmed", false);
            }
            this._checkAllConfirmed();
        },

        _validateMaterial: function () {
            const sMaterial = this.byId("commissioningDialogMaterialInput").getValue();
            const sExpectedMaterial = this._currentPosition.material;
            const oMaterialInput = this.byId("commissioningDialogMaterialInput");
            const oDialogModel = this.getView().getModel("dialog");

            if (!sMaterial) {
                oMaterialInput.setValueState("None");
                oDialogModel.setProperty("/materialConfirmed", false);
            } else if (sMaterial === sExpectedMaterial) {
                oMaterialInput.setValueState("Success");
                oMaterialInput.setValueStateText("Material korrekt");
                oDialogModel.setProperty("/materialConfirmed", true);
            } else {
                oMaterialInput.setValueState("Error");
                oMaterialInput.setValueStateText(`Falsches Material. Erwartet: ${sExpectedMaterial}`);
                oDialogModel.setProperty("/materialConfirmed", false);
            }
            this._checkAllConfirmed();
        },

        _validateQuantity: function () {
            const sQuantity = this.byId("commissioningDialogQuantityInput").getValue();
            const iExpectedQuantity = this._currentPosition.targetQuantity;
            const oQuantityInput = this.byId("commissioningDialogQuantityInput");
            const oDialogModel = this.getView().getModel("dialog");

            if (!sQuantity) {
                oQuantityInput.setValueState("None");
                oDialogModel.setProperty("/quantityConfirmed", false);
                oDialogModel.setProperty("/quantityDiffers", false);
                oDialogModel.setProperty("/differenceCodeConfirmed", false);
            } else {
                const iQuantity = parseInt(sQuantity, 10);
                if (iQuantity === iExpectedQuantity) {
                    // Quantity matches - hide difference code field
                    oQuantityInput.setValueState("Success");
                    oQuantityInput.setValueStateText("Menge korrekt");
                    oDialogModel.setProperty("/quantityConfirmed", true);
                    oDialogModel.setProperty("/quantityDiffers", false);
                    oDialogModel.setProperty("/differenceCodeConfirmed", true); // Auto-confirm when no difference

                    if (!this._currentPosition.serialRequired) {
                        // Mark serial numbers as confirmed if not required
                        oDialogModel.setProperty("/serialNumbersConfirmed", true);
                    }
                } else {
                    // Quantity differs - show difference code field with orange state
                    oQuantityInput.setValueState("Warning");
                    oQuantityInput.setValueStateText(`Abweichende Menge. Bitte Differenzkennzeichen auswählen`);
                    oDialogModel.setProperty("/quantityConfirmed", true); // Quantity input is valid
                    oDialogModel.setProperty("/quantityDiffers", true);

                    // Check if difference code is already selected, if not reset
                    const sCurrentDifferenceCode = oDialogModel.getProperty("/differenceCode");
                    if (!sCurrentDifferenceCode) {
                        oDialogModel.setProperty("/differenceCodeConfirmed", false);
                        oDialogModel.setProperty("/differenceCode", "");

                        // Reset difference code select if it exists
                        const oDifferenceCodeSelect = this.byId("commissioningDialogDifferenceCodeSelect");
                        if (oDifferenceCodeSelect) {
                            oDifferenceCodeSelect.setSelectedKey("");
                            oDifferenceCodeSelect.setValueState("Warning");
                            oDifferenceCodeSelect.setValueStateText("Bitte Differenzkennzeichen auswählen");
                        }
                    } else {
                        // Difference code already selected, validate it
                        this._validateDifferenceCode();
                    }
                }
            }
            this._checkAllConfirmed();
        },

        onConfirmLocation: function () {
            // Legacy method - validation now happens automatically
            this._validateLocation();
        },

        onConfirmMaterial: function () {
            // Legacy method - validation now happens automatically
            this._validateMaterial();
        },

        onConfirmQuantity: function () {
            // Legacy method - validation now happens automatically  
            this._validateQuantity();
        },

        onRemoveSerialNumberFromDialog: function (oEvent) {
            const oBindingContext = oEvent.getSource().getBindingContext("dialog");
            const iIndex = oBindingContext.getPath().split("/").pop();

            const oDialogModel = this.getView().getModel("dialog");
            const aSerialNumbers = oDialogModel.getProperty("/serialNumbers");
            aSerialNumbers.splice(iIndex, 1);
            oDialogModel.setProperty("/serialNumbers", aSerialNumbers);

            // Update status
            if (aSerialNumbers.length < this._currentPosition.targetQuantity) {
                oDialogModel.setProperty("/serialNumbersConfirmed", false);
                this.byId("completeButton").setEnabled(false);
            }
        },

        onOpenSerialNumberScan: function () {
            this._openSerialNumberScanDialog();
        },

        _openSerialNumberScanDialog: function () {
            if (!this._pSerialScanDialog) {
                this._pSerialScanDialog = Fragment.load({
                    id: this.getView().getId(),
                    name: "inw.mockup.ewm.fragment.SerialNumberScanDialog",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }

            this._pSerialScanDialog.then(function (oDialog) {
                // Initialize scan dialog with current data
                this._initializeSerialScanDialog();
                oDialog.open();

                // Focus on scan input
                setTimeout(() => {
                    const oScanInput = this.byId("serialNumberScanInput");
                    if (oScanInput) {
                        oScanInput.focus();
                    }
                }, 100);
            }.bind(this));
        },

        _initializeSerialScanDialog: function () {
            const oScanDialogModel = this.getView().getModel("scanDialog");
            const oDialogModel = this.getView().getModel("dialog");

            // Copy existing serial numbers from main dialog
            const aExistingSerialNumbers = oDialogModel.getProperty("/serialNumbers") || [];

            oScanDialogModel.setData({
                serialNumbers: [...aExistingSerialNumbers], // Create a copy
                materialText: this._currentPosition.materialText,
                requiredQuantity: this._currentPosition.targetQuantity,
                scannedCount: aExistingSerialNumbers.length
            });

            // Update dialog display elements
            this.byId("scanDialogMaterial").setText(this._currentPosition.materialText);
            this.byId("scanDialogRequired").setText(this._currentPosition.targetQuantity.toString());
            this.byId("scanDialogScanned").setText(aExistingSerialNumbers.length.toString());

            // Update progress indicator
            this._updateSerialProgress();

            // Update confirm button state
            this._updateSerialScanConfirmButton();
        },

        onAddSerialNumberScan: function () {
            const sSerialNumber = this.byId("serialNumberScanInput").getValue();

            if (!sSerialNumber) {
                MessageBox.warning("Bitte Seriennummer eingeben.");
                return;
            }

            const oScanDialogModel = this.getView().getModel("scanDialog");
            const aSerialNumbers = oScanDialogModel.getProperty("/serialNumbers");

            // Check for duplicates
            if (aSerialNumbers.find(item => item.serialNumber === sSerialNumber)) {
                MessageBox.warning("Seriennummer bereits vorhanden.");
                this.byId("serialNumberScanInput").setValue("");
                return;
            }

            // Add serial number
            aSerialNumbers.push({ serialNumber: sSerialNumber });
            oScanDialogModel.setProperty("/serialNumbers", aSerialNumbers);
            oScanDialogModel.setProperty("/scannedCount", aSerialNumbers.length);

            // Clear input and focus back
            this.byId("serialNumberScanInput").setValue("");
            this.byId("scanDialogScanned").setText(aSerialNumbers.length.toString());

            // Update progress and button state
            this._updateSerialProgress();
            this._updateSerialScanConfirmButton();

            // Auto-focus back to input
            setTimeout(() => {
                this.byId("serialNumberScanInput").focus();
            }, 100);
        },

        onRemoveSerialNumberScan: function (oEvent) {
            const oBindingContext = oEvent.getSource().getBindingContext("scanDialog");
            const iIndex = oBindingContext.getPath().split("/").pop();

            const oScanDialogModel = this.getView().getModel("scanDialog");
            const aSerialNumbers = oScanDialogModel.getProperty("/serialNumbers");
            aSerialNumbers.splice(iIndex, 1);
            oScanDialogModel.setProperty("/serialNumbers", aSerialNumbers);
            oScanDialogModel.setProperty("/scannedCount", aSerialNumbers.length);

            this.byId("scanDialogScanned").setText(aSerialNumbers.length.toString());

            // Update progress and button state
            this._updateSerialProgress();
            this._updateSerialScanConfirmButton();
        },

        _updateSerialProgress: function () {
            const oScanDialogModel = this.getView().getModel("scanDialog");
            const iRequired = oScanDialogModel.getProperty("/requiredQuantity");
            const iScanned = oScanDialogModel.getProperty("/scannedCount");

            const oProgressIndicator = this.byId("serialProgressIndicator");
            const iPercentValue = iRequired > 0 ? Math.round((iScanned / iRequired) * 100) : 0;

            oProgressIndicator.setPercentValue(iPercentValue);
            oProgressIndicator.setDisplayValue(`${iScanned}/${iRequired}`);

            if (iScanned >= iRequired) {
                oProgressIndicator.setState("Success");
            } else if (iScanned > 0) {
                oProgressIndicator.setState("Warning");
            } else {
                oProgressIndicator.setState("None");
            }
        },

        _updateSerialScanConfirmButton: function () {
            const oScanDialogModel = this.getView().getModel("scanDialog");
            const iRequired = oScanDialogModel.getProperty("/requiredQuantity");
            const iScanned = oScanDialogModel.getProperty("/scannedCount");

            const bEnabled = iScanned >= iRequired;
            this.byId("confirmSerialScanButton").setEnabled(bEnabled);
        },

        onConfirmSerialNumberScan: function () {
            const oScanDialogModel = this.getView().getModel("scanDialog");
            const oDialogModel = this.getView().getModel("dialog");

            // Copy scanned serial numbers back to main dialog
            const aScannedSerialNumbers = oScanDialogModel.getProperty("/serialNumbers");
            oDialogModel.setProperty("/serialNumbers", aScannedSerialNumbers);
            oDialogModel.setProperty("/serialNumbersConfirmed", aScannedSerialNumbers.length >= this._currentPosition.targetQuantity);

            // Close scan dialog
            this.byId("serialNumberScanDialog").close();

            // Update main dialog state
            this._checkAllConfirmed();

            MessageBox.success(`${aScannedSerialNumbers.length} Seriennummern erfolgreich übernommen.`);
        },

        onCancelSerialNumberScan: function () {
            this.byId("serialNumberScanDialog").close();
        },

        _checkAllConfirmed: function () {
            const oDialogModel = this.getView().getModel("dialog");
            const bLocationConfirmed = oDialogModel.getProperty("/locationConfirmed");
            const bMaterialConfirmed = oDialogModel.getProperty("/materialConfirmed");
            const bQuantityConfirmed = oDialogModel.getProperty("/quantityConfirmed");
            const bSerialNumbersConfirmed = oDialogModel.getProperty("/serialNumbersConfirmed");
            const bDifferenceCodeConfirmed = oDialogModel.getProperty("/differenceCodeConfirmed");

            const bAllConfirmed = bLocationConfirmed && bMaterialConfirmed && bQuantityConfirmed && bSerialNumbersConfirmed && bDifferenceCodeConfirmed;

            const oCompleteButton = this.byId("completeButton");
            if (oCompleteButton) {
                oCompleteButton.setEnabled(bAllConfirmed);
            }
        },

        onCompleteCommissioning: function () {
            // Close dialog immediately
            this.byId("commissioningDialog").close();

            // Update position immediately
            this._moveToNextPosition();

            // Show success toast after position update
            sap.m.MessageToast.show("Position erfolgreich kommissioniert!", {
                duration: 2000,
                width: "300px"
            });
        },

        onCancelCommissioning: function () {
            this.byId("commissioningDialog").close();
        },

        _moveToNextPosition: function () {
            this._positionIndex++;
            console.log("Moving to position:", this._positionIndex);

            if (this._positionIndex > this._totalPositions) {
                this._showCompletionDialog();
            } else {
                this._loadNextPosition();
            }
        },

        _showCompletionDialog: function () {
            MessageBox.success("Alle Positionen wurden erfolgreich kommissioniert!", {
                title: "Kommissionierung abgeschlossen",
                actions: [MessageBox.Action.OK],
                emphasizedAction: MessageBox.Action.OK,
                onClose: () => {
                    // Reset progress before navigating back
                    this._resetProgress();

                    const oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("main");
                }
            });
        },

        _loadNextPosition: function () {
            console.log("Loading position:", this._positionIndex);

            // Mock data for next positions
            const aPositions = [
                {
                    number: "TA-2024-001234-002",
                    location: "B-02-03-04",
                    material: "MAT-001235",
                    materialText: "Muttern M8",
                    targetQuantity: 50,
                    unit: "ST",
                    serialRequired: false
                },
                {
                    number: "TA-2024-001234-003",
                    location: "C-03-04-05",
                    material: "MAT-001236",
                    materialText: "Unterlegscheiben M8",
                    targetQuantity: 200,
                    unit: "ST",
                    serialRequired: false
                },
                {
                    number: "TA-2024-001234-004",
                    location: "A-04-05-06",
                    material: "MAT-001237",
                    materialText: "Gewindestangen M10",
                    targetQuantity: 25,
                    unit: "ST",
                    serialRequired: true
                },
                {
                    number: "TA-2024-001234-005",
                    location: "D-05-06-07",
                    material: "MAT-001238",
                    materialText: "Dichtungen 12mm",
                    targetQuantity: 75,
                    unit: "ST",
                    serialRequired: false
                }
            ];

            this._currentPosition = aPositions[this._positionIndex - 2];

            // Update position display
            this._updateViewElements();

            // Update header title
            console.log("About to update header title for position:", this._positionIndex);
            this._updateHeaderTitle();
        },

        _updateHeaderTitle: function () {
            try {
                const oHeaderTitle = this.byId("headerTitle");
                if (oHeaderTitle) {
                    const sNewTitle = `Kommissionierung - Position ${this._positionIndex}/${this._totalPositions}`;
                    oHeaderTitle.setText(sNewTitle);
                    console.log("Header title updated to:", sNewTitle);
                } else {
                    console.error("headerTitle element not found");
                }
            } catch (error) {
                console.error("Error updating header title:", error);
            }
        }
    });
});
