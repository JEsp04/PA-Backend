# Proyecto E-commerce (Backend)

Backend del proyecto de aula: API REST construida con Node.js, Express y Sequelize (MySQL).

Autores

- Jhojan Espinosa — 202410173
- Geronimo Valderrama — 202410072
- Juan Loaiza — 202410170
- Juan José Múnera — 202410016

Resumen
Este repositorio contiene la API del e-commerce (productos, carrito, órdenes, pagos y envíos). Está pensada para usarse junto al frontend en `PA-Front`.

Características destacadas

- API REST con autenticación JWT.
- Modelos Sequelize: Usuarios, Productos, Carritos, Órdenes, Pagos y Envios.
- Endpoint para poblar productos desde `data/productSeed.json`.

Requisitos

- Node.js v16+ (recomendado) y npm
- MySQL (o compatible) corriendo localmente o en remoto

Instalación y ejecución (Windows PowerShell)

1. Abrir una terminal en la carpeta del backend:

```powershell
cd 'C:\Users\Valderrama\documents\WEB\PA-Backend'
```

2. Instalar dependencias:

```powershell
npm install
```

3. Configurar variables de entorno: crea un archivo `.env` en la raíz con (ejemplo):

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecommerce_perfumes
DB_USER=root
DB_PASSWORD=tu_password
PORT=4000
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1d
```

4. Levantar el servidor en modo desarrollo:

```powershell
npm run dev
```

El servidor por defecto escuchará en el puerto indicado en `.env` (por ejemplo `http://localhost:4000`).

Seeding (cargar productos de ejemplo)
Existe un endpoint para cargar los productos desde `data/productSeed.json`.

- Método: `POST` a `/api/productos/cargarProductos`
- Puedes llamar el endpoint con Postman o curl una vez que el servidor esté corriendo.

Estructura relevante

- `controllers/` — controladores por recurso (producto, orden, pago, envio, etc.)
- `models/` — modelos Sequelize y relaciones
- `routes/` — rutas expuestas por la API
- `config/database.js` — configuración de conexión a la BD (lee `.env`)

Buenas prácticas y notas

- Asegúrate de tener la base de datos creada y las credenciales en `.env` antes de arrancar.
- El endpoint de procesamiento de pagos crea la orden, el pago y el registro de envío en una transacción para mantener consistencia.
- Si piensas desplegar, cambia `JWT_SECRET` por una clave segura y configura el acceso a la base de datos en un host/usuario seguro.

## Preguntas de negocio y hallazgos

1. **Productos más vendidos:**

   - Los perfumes de línea comercial y de uso diario muestran mayor rotación. Son versátiles, accesibles y se adaptan a diferentes gustos, por eso son los más elegidos.

2. **Mes con mayor número de ventas:**

   - Diciembre es el mes con mayor volumen de ventas, impulsado por la temporada de fin de año, promociones e intercambios de regalos.

3. **Método de pago más utilizado:**

   - Tarjeta (débito o crédito) — por su rapidez, facilidad y disponibilidad es la opción más cómoda para la mayoría.

4. **Clientes que vuelven a comprar:**

   - Un grupo significativo de clientes realiza al menos una segunda compra, lo que indica una buena experiencia de producto y fidelidad.

5. **Ciudad con mayor cantidad de pedidos:**

   - Medellín concentra la mayor parte de los pedidos y es el mercado más activo según los registros.

6. **Género de perfume más vendido:**

   - Los perfumes masculinos presentan mayor movimiento y salida más rápida.

7. **Marca más vendida:**

   - Valentino se destaca como la marca con mejor desempeño en ventas.

8. **Rango de precio de los productos más vendidos:**

   - La mayoría de los productos vendidos se ubican entre $420.000 y $850.000.

9. **Tamaño de perfume más vendido:**
   - El tamaño de 100 ml muestra la mayor demanda por su duración y precio competitivo.

---

<img width="627" height="580" alt="image" src="https://github.com/user-attachments/assets/c5d9ac69-ba27-40a4-8858-1a3c8f2a2945" />
