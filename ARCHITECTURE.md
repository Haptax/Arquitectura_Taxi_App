# 🏛️ Documento de Arquitectura y Patrones de Diseño

Este documento describe con rigurosidad técnica la arquitectura de software, los principios de diseño, los patrones implementados y las decisiones estructurales del proyecto **Taxi App**.

---

## 1. Principios y Paradigmas Fundamentales

1. **Clean Architecture (Robert C. Martin / Onion / Hexagonal)**:
   - Las reglas de negocio son el centro (`Domain`).
   - Las dependencias fluyen estrictamente desde las capas externas hacia las internas.
   - El Dominio no tiene conocimiento de NestJS, TypeORM, PostgreSQL ni Express.

2. **Domain-Driven Design (DDD - Táctico)**:
   - **Entidades de Dominio**: Tienen identidad propia y encapsulan comportamientos y transiciones de estado (`User`, `Trip`, `Driver`, `Profile`).
   - **Factorías (Factories)**: Encapsulan la complejidad de creación y validaciones de estado inicial (`UserFactory`, `ProfileFactory`).
   - **Repositorios (Puertos)**: Contratos abstractos en el dominio (`ITripRepository`, `IUserRepository`, etc.) implementados en la infraestructura.

3. **Principios SOLID**:
   - **S (Single Responsibility)**: Cada Caso de Uso (`UseCase`) tiene una única responsabilidad bien acotada.
   - **O (Open/Closed)**: Las estrategias de asignación de conductores (`DriverAssignmentStrategy`) permiten incorporar nuevos algoritmos sin alterar el código de solicitud de viajes.
   - **L (Liskov Substitution)**: Las implementaciones de repositorios (`TypeOrmTripRepository`) y estrategias (`NearestDriverStrategy`, `RatedDriverStrategy`) son intercambiables mediante sus interfaces.
   - **I (Interface Segregation)**: Interfaces específicas y concisas para repositorios y servicios (`IPasswordHasher`, `ITokenService`).
   - **D (Dependency Inversion)**: Los Casos de Uso dependen de abstracciones (`ITripRepository`), nunca de implementaciones concretas de base de datos.

---

## 2. Mapa de Capas del Backend

```
+---------------------------------------------------------------+
|                    PRESENTATION LAYER                         |
|   - Controllers: AuthController, TripController, etc.         |
|   - Guards: JwtAuthGuard                                      |
+-------------------------------+-------------------------------+
                                | (invoca)
                                v
+---------------------------------------------------------------+
|                    APPLICATION LAYER                          |
|   - Use Cases: RequestTripUseCase, AcceptTripUseCase, etc.    |
|   - Strategies: DriverFindingStrategy, NearestDriverStrategy  |
|   - DTOs: CreateTripDto, RegisterUserDto, etc.                |
|   - Service Interfaces: IPasswordHasher, ITokenService        |
+-------------------------------+-------------------------------+
                                | (depende de)
                                v
+---------------------------------------------------------------+
|                      DOMAIN LAYER                             |
|   - Entities: User, Driver, Trip, Profile                     |
|   - Factories: UserFactory, ProfileFactory                    |
|   - Repository Interfaces (Ports): ITripRepository, etc.      |
|   - Exceptions: DomainException                               |
+-------------------------------+-------------------------------+
                                ^
                                | (implementa contratos)
+-------------------------------+-------------------------------+
|                   INFRASTRUCTURE LAYER                        |
|   - Persistence: TypeORM Repositories & PostgreSQL Entities   |
|   - Security: AuthService (Bcrypt), JwtTokenService           |
|   - Notifications: EmailService                               |
+-------------------------------+-------------------------------+
```

---

## 3. Patrones de Diseño Implementados

### 🎯 3.1. Patrón Estrategia (Strategy Pattern)
- `IDriverAssignmentStrategy`: Define el contrato para asignar conductores.
- `NearestDriverStrategy`: Calcula la distancia geográfica entre el conductor y el origen del viaje para asignar al más cercano.
- `RatedDriverStrategy`: Selecciona al conductor con mayor calificación.

### 🏭 3.2. Patrón Factoría (Factory Pattern)
- `UserFactory` y `ProfileFactory`: Centralizan la creación y cálculo de permisos iniciales por rol (`ADMIN`, `DRIVER`, `CLIENT`).

### 🗄️ 3.3. Patrón Repositorio (Repository Pattern)
- Desacopla la lógica de negocio de TypeORM/PostgreSQL mediante interfaces de repositorio inyectadas por token (`@Inject('ITripRepository')`).
