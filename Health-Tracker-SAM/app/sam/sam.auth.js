"use strict";
class Auth {
    constructor(auth) {
        this.auth = auth;
    }
    init() {
        // subscribe to the auth object to check for the login status
        // of the user, if logged in, save some user information and
        // execute the firebase query...
        // .. otherwise
        // show the login modal page
        this.auth.subscribe((data) => {
            console.log("in sam.auth.service subscribe ", JSON.stringify(data));
            if (data) {
                if (data.twitter) {
                    this.authInfo = data.twitter;
                    this.authInfo.displayName = data.twitter.displayName;
                }
                else if (data.github) {
                    this.authInfo = data.github;
                    this.authInfo.displayName = data.github.displayName;
                }
                else if (data.google) {
                    this.authInfo = data.google;
                    this.authInfo.displayName = data.google.displayName;
                }
                else {
                    this.authInfo = data.password;
                    this.authInfo.displayName = data.password.email;
                }
                this.authInfo.uid = data.uid;
            }
            else {
                this.authInfo = null;
            }
        });
    }
    getUsername() {
        if (this.authInfo)
            return this.authInfo.displayName;
        return '?';
    }
    getUid() {
        if (this.authInfo)
            return this.authInfo.uid;
        return '?';
    }
}
exports.Auth = Auth;
//# sourceMappingURL=sam.auth.js.map