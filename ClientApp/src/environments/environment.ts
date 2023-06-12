export const environment = {
  production: false,
  // saque las configuraciones de aca para que se puedan modificar sin tener que recompilar.
  // están en config.json: ClientApp\src\assets\configs\config.json
  // y el encargado de levantarlas es el SettingsService, en ClientApp\src\services\settings.service.ts

  // omnicanal: 'http://localhost:1163/' ,

  redirectUrl: 'http://localhost:4200/',
  userServer: 'http://localhost:4200/',
};
