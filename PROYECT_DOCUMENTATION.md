
# 📁 *ESTRUCTURA DEL PROYECTO*
*HD_FRONTEND*/ 
├── app/                   # Enrutador App de Next.js con grupos de rutas
│   ├── (auth)/            # Rutas de autenticación
│   ├── (dashboard)/       # Rutas protegidas del panel (dashboard)
│   ├── (public)/          # Rutas de páginas públicas               
├── features/              # Organización basada en funcionalidades (componentes, etc)
├── services/              # Rutas de API   
└── lib/                   # Funciones utilitarias 
├── ui/                    # Componentes de UI compartidos
└── styles/                # Estilos globales CSS


# NOTAS
- En Next.js, las carpetas entre paréntesis son route groups: sirven para organizar, pero no aparecen en la URL. 
Eso te permite separar  áreas como:

## Route Groups
- app/(public) para inicio, servicios, nosotros, contacto
- app/(auth) para login o registro
- app/(dashboard) para panel interno o administrativo