import crypto from "node:crypto";

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
};

const projectId = required("FIREBASE_ADMIN_PROJECT_ID");
const apiKey = required("FIREBASE_WEB_API_KEY");
const email = required("ADMIN_EMAIL").trim().toLowerCase();
const password = required("ADMIN_PASSWORD");
const clientEmail = required("FIREBASE_ADMIN_CLIENT_EMAIL");
const privateKey = required("FIREBASE_ADMIN_PRIVATE_KEY").replace(/\\n/g, "\n");

if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("ADMIN_EMAIL must be a valid email address");
if (password.length < 6) throw new Error("ADMIN_PASSWORD must be at least 6 characters");

const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
const now = Math.floor(Date.now() / 1000);
const jwtHeader = encode({ alg: "RS256", typ: "JWT" });
const jwtClaim = encode({
  iss: clientEmail,
  scope: "https://www.googleapis.com/auth/datastore",
  aud: "https://oauth2.googleapis.com/token",
  iat: now,
  exp: now + 3600,
});
const signer = crypto.createSign("RSA-SHA256");
signer.update(`${jwtHeader}.${jwtClaim}`);
const assertion = `${jwtHeader}.${jwtClaim}.${signer.sign(privateKey, "base64url")}`;

const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  }),
});
if (!tokenResponse.ok) throw new Error(`Google token request failed: ${await tokenResponse.text()}`);
const { access_token: accessToken } = await tokenResponse.json();

const authRequest = async (endpoint) => {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:${endpoint}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  return { response, data: await response.json() };
};

let auth = await authRequest("signUp");
if (!auth.response.ok && auth.data.error?.message === "EMAIL_EXISTS") {
  auth = await authRequest("signInWithPassword");
}
if (!auth.response.ok || !auth.data.localId) {
  throw new Error(`Firebase Authentication failed: ${auth.data.error?.message || auth.response.statusText}`);
}

const documentPath = `projects/${projectId}/databases/(default)/documents/admins/${auth.data.localId}`;
const firestoreResponse = await fetch(`https://firestore.googleapis.com/v1/${documentPath}`, {
  method: "PATCH",
  headers: {
    authorization: `Bearer ${accessToken}`,
    "content-type": "application/json",
  },
  body: JSON.stringify({
    fields: {
      email: { stringValue: email },
      role: { stringValue: "admin" },
    },
  }),
});
if (!firestoreResponse.ok) throw new Error(`Firestore admin record failed: ${await firestoreResponse.text()}`);

console.log(`Admin account ready: ${email}`);
console.log(`Firestore access granted at admins/${auth.data.localId}`);
