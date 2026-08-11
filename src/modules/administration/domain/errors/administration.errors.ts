export class AdministrationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class SettingNotFoundException extends AdministrationException {
  constructor(key: string) {
    super(`System setting with key "${key}" was not found.`);
  }
}

export class FeatureFlagNotFoundException extends AdministrationException {
  constructor(key: string) {
    super(`Feature flag with key "${key}" was not found.`);
  }
}

export class CatalogNotFoundException extends AdministrationException {
  constructor(id: string) {
    super(`Catalog entry "${id}" was not found.`);
  }
}

export class WidgetNotFoundException extends AdministrationException {
  constructor(id: string) {
    super(`Dashboard widget "${id}" was not found.`);
  }
}
