// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  analytics: false,
  serverEndpoint: 'http://127.0.0.1:10000',
  firebaseConfig: {
    apiKey: "AIzaSyCmfXDNcDTHtWgc8DnieEk0MS6KUogR-Rc",
    authDomain: "deporty-app.firebaseapp.com",
    projectId: "deporty-app",
    storageBucket: "deporty-app.appspot.com",
    messagingSenderId: "861456172435",
    appId: "1:861456172435:web:edaf5251b6866e8fe8d466",
    measurementId: "G-NLEM82Z201"
  }
};

/*
 * For easier debugging in appelopment mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
