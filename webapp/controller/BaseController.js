sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel"
], function (Controller, UIComponent, History, JSONModel) {
	"use strict";

	return Controller.extend("inw.mockup.ewm.controller.BaseController", {

		onInit: function () {
			// Initialize user data model - available in all controllers
			this._initializeUserModel();
		},

		/**
		 * Initializes the user data model with default values.
		 * This model is available in all controllers that extend BaseController.
		 * @private
		 */
		_initializeUserModel: function () {
			const oUserData = {
				version: "1.2.3",
				user: "MUSTERMANN",
				userName: "Max Mustermann",
				plant: "1000",
				plantDescription: "Werk Hamburg",
				warehouse: "WH01",
				warehouseDescription: "Lager Nord"
			};

			const oUserModel = new JSONModel(oUserData);
			this.getView().setModel(oUserModel, "user");
		},
		/**
		 * Convenience method for accessing the component of the controller's view.
		 * @returns {sap.ui.core.Component} The component of the controller's view
		 */
		getOwnerComponent: function () {
			return Controller.prototype.getOwnerComponent.call(this);
		},

		/**
		 * Convenience method to get the components' router instance.
		 * @returns {sap.m.routing.Router} The router instance
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the i18n resource bundle of the component.
		 * @returns {Promise<sap.base.i18n.ResourceBundle>} The i18n resource bundle of the component
		 */
		getResourceBundle: function () {
			const oModel = this.getOwnerComponent().getModel("i18n");
			return oModel.getResourceBundle();
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @param {string} [sName] The model name
		 * @returns {sap.ui.model.Model} The model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @param {sap.ui.model.Model} oModel The model instance
		 * @param {string} [sName] The model name
		 * @returns {sap.ui.core.mvc.Controller} The current base controller instance
		 */
		setModel: function (oModel, sName) {
			this.getView().setModel(oModel, sName);
			return this;
		},

		/**
		 * Convenience method for triggering the navigation to a specific target.
		 * @public
		 * @param {string} sName Target name
		 * @param {object} [oParameters] Navigation parameters
		 * @param {boolean} [bReplace] Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
		 */
		navTo: function (sName, oParameters, bReplace) {
			this.getRouter().navTo(sName, oParameters, undefined, bReplace);
		},

		/**
		 * Convenience event handler for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the main route.
		 */
		onNavBack: function () {
			const sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("main", {}, undefined, true);
			}
		},

		/**
		 * Opens the user dialog with user information.
		 * This method is available in all controllers that extend BaseController.
		 */
		onOpenUserDialog: function () {
			if (!this._pUserDialog) {
				this._pUserDialog = this.loadFragment({
					name: "inw.mockup.ewm.fragment.UserDialog"
				});
			}

			this._pUserDialog.then(function (oDialog) {
				oDialog.open();
			});
		},

		/**
		 * Closes the user dialog.
		 * This method is available in all controllers that extend BaseController.
		 */
		onCloseUserDialog: function () {
			this.byId("userDialog").close();
		},

		/**
		 * Handles user logout.
		 * Closes the dialog and performs logout logic.
		 * This method is available in all controllers that extend BaseController.
		 */
		onLogout: function () {
			// Close dialog first
			this.byId("userDialog").close();

			// Here would be logout logic in a real application
			console.log("Logout requested - would redirect to login page");
		}
	});
});
