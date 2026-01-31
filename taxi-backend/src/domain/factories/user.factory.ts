import { User, UserRole } from '../entities/user.entity';
import { v4 as uuidv4 } from 'uuid'; // Necesitarás instalar 'uuid' o usar un generador propio

export class UserFactory {
  /**
   * Crea un nuevo usuario con la lógica inicial según su rol.
   * Esto centraliza la creación y evita errores de instanciación en los Casos de Uso.
   */
  static create(name: string, email: string, role: UserRole): User {
    // Generamos un ID único (en una arquitectura pura, el ID puede venir del dominio o la DB)
    const id = uuidv4();

    // Aquí podrías añadir lógica específica por rol
    // Por ejemplo: los conductores podrían empezar como "no verificados" 
    // o con permisos específicos que definas en el futuro.
    
    switch (role) {
      case UserRole.DRIVER:
        // Lógica específica para conductores si fuera necesario
        return new User(id, name, email, UserRole.DRIVER, true);
      
      case UserRole.ADMIN:
        return new User(id, name, email, UserRole.ADMIN, true);
      
      case UserRole.CLIENT:
      default:
        return new User(id, name, email, UserRole.CLIENT, true);
    }
  }
}