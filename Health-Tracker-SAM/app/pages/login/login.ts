import {Modal, NavController, Page, ViewController} from 'ionic-angular';
import {Component, OnInit, Inject} from '@angular/core';
import {FirebaseAuth, FirebaseRef, AuthProviders, AuthMethods } from 'angularfire2';

@Page({
    templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {

    error: any

    constructor(public auth: FirebaseAuth,
        @Inject(FirebaseRef) public ref: Firebase,
        public viewCtrl: ViewController) { }
    /** 
     * this will dismiss the modal page
     */
    dismiss() {
        this.viewCtrl.dismiss();
    }

    /**
     * this creates the user using the form credentials. 
     *
     * we are preventing the default behavor of submitting the form
     * 
     * @param _credentials {Object} the email and password from the form
     * @param _event {Object} the event information from the form submit
     */
    registerUser(_credentials, _event) {
        _event.preventDefault();

        this.auth.createUser(_credentials).then((authData: FirebaseAuthData) => {
            console.log(authData)

            _credentials.created = true;

            return this.login(_credentials, _event);

        }).catch((error) => {
            this.error = error
            console.log(error)
        });
    }

    registerUserWithGoogle(_credentials, _event) {
        _event.preventDefault();

        this.auth.login({
            provider: AuthProviders.Google,
            method: AuthMethods.Popup
        }).then((value) => {
            console.log("Google login: " + JSON.stringify(value));
            this.dismiss()
        }).catch((error) => {
            this.error = error
            console.log(error)
        });
    }

    /**
     * this logs in the user using the form credentials.
     * 
     * if the user is a new user, then we need to create the user AFTER
     * we have successfully logged in
     * 
     * @param _credentials {Object} the email and password from the form
     * @param _event {Object} the event information from the form submit
     */
    login(credentials, _event) {
        _event.preventDefault();

        // if this was called from the register user,  then check if we 
        // need to create the user object or not
        let addUser = credentials.created
        credentials.created = null;

        // login using the email/password auth provider
        this.auth.login(credentials, {
            provider: AuthProviders.Password,
            method: AuthMethods.Password
        }).then((authData) => {
            console.log("login: " + JSON.stringify(authData));

            if (addUser) {
                var auth: FirebaseAuthDataPassword = authData.password
                return this.ref.child('users')
                    .child(authData.uid)
                    .set({
                        "provider": authData.provider,
                        "avatar": auth.profileImageURL,
                        "displayName": auth.email,
                        "authData": authData
                    })
            } else {
                this.dismiss()
            }

        }).then((value) => {
            this.dismiss()
        }).catch((error) => {
            this.error = error
            console.log(error)
        });
    }
}
