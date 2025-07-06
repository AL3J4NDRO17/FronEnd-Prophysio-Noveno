const path = require("path")

module.exports = function override(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    "@": path.resolve(__dirname, "src"), // Alias para la carpeta src
    "@variables": path.resolve(__dirname, "src/constants/variables.css"),

    // Componentes específicos
    "@uiLoader": path.resolve(__dirname, "src/components/admin/ui/loader/loader.jsx"),
    "@axiosInstance": path.resolve(__dirname, "src/components/api/axiosConfig.js"),
    "@uiButtons": path.resolve(__dirname, "src/components/admin/ui/buttons/buttons.jsx"),
    "@uiValidationWindow": path.resolve(__dirname, "src/components/admin/ui/validationWindow/validationWindow.jsx"),
    "@authContext": path.resolve(__dirname, "src/context/authContext.js"),
    "@Input": path.resolve(__dirname, "src/components/admin/ui/input/input.jsx"),
    "@Label": path.resolve(__dirname, "src/components/admin/ui/label/label.jsx"),
    "@Dropdown": path.resolve(__dirname, "src/components/admin/ui/dropmenu/dropdown.jsx"),
    "@Checkbox": path.resolve(__dirname, "src/components/admin/ui/checkbox/checkbox.jsx"),
    "@Button": path.resolve(__dirname, "src/components/admin/ui/generalButton/button.jsx"),

    // Componentes públicos desde public_ui
    "@avatar": path.resolve(__dirname, "src/components/public_ui/avatar.jsx"),
    "@badge": path.resolve(__dirname, "src/components/public_ui/badge.jsx"),
    "@button": path.resolve(__dirname, "src/components/public_ui/button.jsx"),
    "@calendar": path.resolve(__dirname, "src/components/public_ui/calendar.jsx"),
    "@card": path.resolve(__dirname, "src/components/public_ui/card.jsx"),
    "@checkbox": path.resolve(__dirname, "src/components/public_ui/checkbox.jsx"),
    "@dropdown-menu": path.resolve(__dirname, "src/components/public_ui/dropdown-menu.jsx"),
    "@input": path.resolve(__dirname, "src/components/public_ui/input.jsx"),
    "@label": path.resolve(__dirname, "src/components/public_ui/label.jsx"),
    "@popover": path.resolve(__dirname, "src/components/public_ui/popover.jsx"),
    "@select": path.resolve(__dirname, "src/components/public_ui/select.jsx"),
    "@textarea": path.resolve(__dirname, "src/components/public_ui/textarea.jsx"),
    "@toggleGroup": path.resolve(__dirname, "src/components/public_ui/toggleGroup.jsx"),
    "@dialog": path.resolve(__dirname, "src/components/public_ui/dialog.jsx"),
    "@table": path.resolve(__dirname, "src/components/public_ui/table.jsx"),
    "@separator": path.resolve(__dirname, "src/components/public_ui/separator.jsx")
  }

  return config
}
