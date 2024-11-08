const colors = require("tailwindcss/colors");
const baseConfig = require("../../../tailwind.config.js");

baseConfig.theme.extend.colors.primary = colors.green;

/** @type {import('tailwindcss').Config} */
module.exports = baseConfig;
