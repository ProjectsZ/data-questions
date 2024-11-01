"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleVerify = void 0;
const google_auth_library_1 = require("google-auth-library");
class GoogleVerify {
    constructor() {
        this.key_vs = process.env.GOOGLE_ID;
        this.client = new google_auth_library_1.OAuth2Client(this.key_vs);
    }
    async googleVerify(token) {
        // let key_vs = `${ process.env.JWT_SECRET }`;
        const ticket = await this.client.verifyIdToken({
            idToken: token,
            audience: this.key_vs, // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        if (!payload) { //para prevenir: Object is possibly 'undefined'.ts(2532)
            return {};
        }
        // const userid = payload['sub'];
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
        // console.log(payload);
        const { name, email, picture } = payload;
        return { name, email, picture };
    }
}
exports.GoogleVerify = GoogleVerify;
