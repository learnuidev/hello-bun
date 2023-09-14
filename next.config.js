/** @type {import('next').NextConfig} */


const path = require("path");
const webpack = require("webpack");

const nextConfig = {

    webpack: (config, { isServer }) => {
        if (!isServer) {
          config.resolve.modules.push(path.resolve("./node_modules"));
        }

        return config

    }
}

module.exports = nextConfig
