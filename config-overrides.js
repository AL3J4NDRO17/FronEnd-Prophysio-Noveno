const path = require("path")

module.exports = function override(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    "@": path.resolve(__dirname, "src"), // Alias para la carpeta src
    "@variables": path.resolve(__dirname, "src/constants/variables.css"), // Alias para las variables CSS
    "@uiLoader": path.resolve(__dirname, "src/components/admin/ui/loader/loader.jsx"), // Alias para las variables CSS
    "@axiosInstance": path.resolve(__dirname, "src/components/api/axiosConfig.js"), 
    "@uiButtons": path.resolve(__dirname, "src/components/admin/ui/buttons/buttons.jsx"),
    "@uiValidationWindow": path.resolve(__dirname, "src/components/admin/ui/validationWindow/validationWindow.jsx"),
  }
  return config
}
