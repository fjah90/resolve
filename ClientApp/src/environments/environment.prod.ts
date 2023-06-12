export const environment = {
  production: true,
  // saque las configuraciones de aca para que se puedan modificar sin tener que recompilar.
  // están en config.json: ClientApp\src\assets\configs\config.json
  // y el encargado de levantarlas es el SettingsService, en ClientApp\src\services\settings.service.ts
  // omnicanal: 'http://suc20001.farmacity.com.ar/wsPDVAutocobroApi/' ,

  redirectUrl: 'http://localhost:8085/',
  userServer: 'http://localhost:8085/',
};
