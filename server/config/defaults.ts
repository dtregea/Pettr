import {exit} from "process";

const defaults = {
    REACT_APP_API: "http://localhost:50000",
    ACCESS_TOKEN_SECRET: 'foo',
    CDN_KEY: "foo",
    CDN_NAME: "foo",
    CDN_SECRET: "foo",
    DATABASE_CONNECTION: "foo",
    PF_KEY: "foo",
    PF_SECRET: "foo",
    PORT: "50000",
    REFRESH_TOKEN_SECRET: "foo",
    
};

Object.keys(defaults).forEach(key => {
    
    if (!process.env[key]) {
        console.log(`Environmental variable ${key} is required to be set`);
        exit(1)
    }
    
    //@ts-ignore
    defaults[key] = process.env[key] ? process.env[key] : defaults[key]
})

export = defaults;