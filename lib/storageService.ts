/**
 * Servicio para manejar LocalStorage de forma segura
 */
export class StorageService {
  private static readonly PREFIX = 'hd_vet_';

  /**
   * Guarda un item en LocalStorage
   * @param key Clave del item
   * @param value Valor a guardar (será convertido a JSON)
   */
  static setItem<T>(key: string, value: T): void {
    try {
      const storageKey = this.PREFIX + key;
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(storageKey, serializedValue);
    } catch (error) {
      console.error(`Error al guardar en LocalStorage (key: ${key}):`, error);
      throw new Error(`No se pudo guardar el item: ${error}`);
    }
  }

  /**
   * Obtiene un item de LocalStorage
   * @param key Clave del item
   * @returns Valor parseado o null si no existe o hay error
   */
  static getItem<T>(key: string): T | null {
    try {
      const storageKey = this.PREFIX + key;
      const item = localStorage.getItem(storageKey);
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error al obtener de LocalStorage (key: ${key}):`, error);
      return null;
    }
  }

  /**
   * Actualiza un item existente en LocalStorage
   * @param key Clave del item
   * @param updater Función que recibe el valor actual y devuelve el nuevo valor
   */
  static updateItem<T>(key: string, updater: (currentValue: T | null) => T): void {
    try {
      const storageKey = this.PREFIX + key;
      const currentItem = localStorage.getItem(storageKey);
      const currentValue = currentItem ? JSON.parse(currentItem) as T : null;
      const newValue = updater(currentValue);
      const serializedValue = JSON.stringify(newValue);
      localStorage.setItem(storageKey, serializedValue);
    } catch (error) {
      console.error(`Error al actualizar en LocalStorage (key: ${key}):`, error);
      throw new Error(`No se pudo actualizar el item: ${error}`);
    }
  }

  /**
   * Elimina un item de LocalStorage
   * @param key Clave del item
   */
  static removeItem(key: string): void {
    try {
      const storageKey = this.PREFIX + key;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error(`Error al eliminar de LocalStorage (key: ${key}):`, error);
      throw new Error(`No se pudo eliminar el item: ${error}`);
    }
  }

  /**
   * Elimina todos los items del LocalStorage con el prefijo de la aplicación
   */
  static clearAll(): void {
    try {
      // Solo eliminamos los items con nuestro prefijo
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.PREFIX)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error al limpiar LocalStorage:', error);
      throw new Error(`No se pudo limpiar el almacenamiento: ${error}`);
    }
  }

  /**
   * Obtiene todas las claves almacenadas con el prefijo de la aplicación
   * @returns Lista de claves (sin el prefijo)
   */
  static getAllKeys(): string[] {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.PREFIX)) {
          // Removemos el prefijo para devolver la clave original
          keys.push(key.substring(this.PREFIX.length));
        }
      }
      return keys;
    } catch (error) {
      console.error('Error al obtener claves de LocalStorage:', error);
      return [];
    }
  }
}