/**
 * Tema UI para la aplicación HD Veterinaria
 * Paleta de colores y estilos reutilizables
 */

// Colores de la paleta
export const Colors = {
  primary: '#cc0078',
  primaryHover: '#a6005f',
  secondary: '#6dd4d7',
  secondaryHover: '#4bb5b8',
  background: '#fafafa',
  border: '#e5e7eb',
  textSecondary: '#6b7280',
  textTitle: '#1a1a2e',
  white: '#ffffff',
};

// Estilos para botones
export const ButtonStyles = {
  primary: `bg-slate-950 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors font-medium`,
  secondary: `bg-slate-100 text-slate-950 px-3 py-1 rounded-md hover:bg-slate-200 transition-colors font-medium`,
  outline: `border border-slate-300 bg-white text-slate-950 px-3 py-1 rounded-md hover:bg-slate-50 transition-colors`,
  destructive: `bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors font-medium`,
  ghost: `bg-transparent text-slate-950 px-3 py-1 rounded-md hover:bg-slate-100 transition-colors`,
};

// Estilos para tablas
export const TableStyles = {
  base: `w-full border border-[${Colors.border}] bg-white rounded-md overflow-hidden`,
  header: `bg-[${Colors.background}] text-[${Colors.textTitle}] font-semibold`,
  row: `border-b border-[${Colors.border}] hover:bg-[#ffe0f3] transition-colors`,
  cell: `px-4 py-3`,
  headerCell: `px-4 py-3 text-left text-sm font-semibold text-[${Colors.textTitle}]`,
  bodyCell: `px-4 py-3 text-sm text-[${Colors.textTitle}]`,
};

// Estilos para cards y contenedores
export const CardStyles = {
  base: `bg-white border border-[${Colors.border}] rounded-lg shadow-sm`,
  header: `px-6 py-4 border-b border-[${Colors.border}] bg-[${Colors.background}]`,
  content: `px-6 py-4`,
  footer: `px-6 py-4 border-t border-[${Colors.border}] bg-[${Colors.background}]`,
};

// Estilos para formularios
export const FormStyles = {
  label: `block text-sm font-medium text-[${Colors.textTitle}] mb-1`,
  input: `w-full border border-[${Colors.border}] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[${Colors.primary}] focus:border-transparent`,
  select: `w-full border border-[${Colors.border}] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[${Colors.primary}] focus:border-transparent`,
  textarea: `w-full border border-[${Colors.border}] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[${Colors.primary}] focus:border-transparent resize-y`,
  error: `text-red-600 text-sm mt-1`,
  help: `text-[${Colors.textSecondary}] text-sm mt-1`,
};

// Estilos para estados
export const StateStyles = {
  success: {
    text: 'text-green-600',
    bg: 'bg-green-100',
    border: 'border-green-200',
    full: 'text-green-600 bg-green-100 border border-green-200 px-3 py-1 rounded-md',
  },
  error: {
    text: 'text-red-600',
    bg: 'bg-red-100',
    border: 'border-red-200',
    full: 'text-red-600 bg-red-100 border border-red-200 px-3 py-1 rounded-md',
  },
  warning: {
    text: 'text-yellow-600',
    bg: 'bg-yellow-100',
    border: 'border-yellow-200',
    full: 'text-yellow-600 bg-yellow-100 border border-yellow-200 px-3 py-1 rounded-md',
  },
  info: {
    text: 'text-blue-600',
    bg: 'bg-blue-100',
    border: 'border-blue-200',
    full: 'text-blue-600 bg-blue-100 border border-blue-200 px-3 py-1 rounded-md',
  },
};

// Estilos para layout
export const LayoutStyles = {
  page: `min-h-screen bg-[${Colors.background}] p-4 md:p-6`,
  container: `max-w-7xl mx-auto`,
  section: `mb-6`,
  title: `text-2xl font-bold text-[${Colors.textTitle}] mb-4`,
  subtitle: `text-lg font-semibold text-[${Colors.textTitle}] mb-3`,
  divider: `border-t border-[${Colors.border}] my-4`,
};

// Clases utilitarias
export const UtilityClasses = {
  text: {
    title: `text-[${Colors.textTitle}] font-bold`,
    subtitle: `text-[${Colors.textTitle}] font-semibold`,
    body: `text-[${Colors.textTitle}]`,
    secondary: `text-[${Colors.textSecondary}]`,
    muted: `text-gray-500`,
  },
  spacing: {
    small: 'mb-2',
    medium: 'mb-4',
    large: 'mb-6',
    xlarge: 'mb-8',
  },
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
  },
  grid: {
    cols1: 'grid grid-cols-1 gap-4',
    cols2: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    cols3: 'grid grid-cols-1 md:grid-cols-3 gap-4',
  },
};

// Exportar todo como objeto principal
export const UITheme = {
  Colors,
  ButtonStyles,
  TableStyles,
  CardStyles,
  FormStyles,
  StateStyles,
  LayoutStyles,
  UtilityClasses,
};

export default UITheme;