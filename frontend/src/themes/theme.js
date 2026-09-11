import { createTheme, alpha } from '@mui/material/styles';

// Tema de Material UI. Fuentes: Fraunces (títulos) y Plus Jakarta Sans (texto).
export const colores = {
  tinta: '#0B1F33',
  oceano: '#0E5E6F',
  oceanoOscuro: '#0A4552',
  laguna: '#3AAFA9',
  arena: '#F7F3EC',
  arenaOscura: '#EFE8DC',
  coral: '#E07A5F',
  coralOscuro: '#C8644A',
  texto: '#1D2B3A',
  textoSuave: '#5B6B7B',
  borde: '#E6E0D6',
  blanco: '#FFFFFF',
  exito: '#2E8B57',
  alerta: '#C98A12',
};

const titulo = '"Fraunces Variable", Georgia, serif';
const cuerpo = '"Plus Jakarta Sans Variable", "Segoe UI", system-ui, sans-serif';

export const sombra = {
  suave: '0 1px 2px rgba(11,31,51,.04), 0 8px 24px rgba(11,31,51,.06)',
  media: '0 2px 6px rgba(11,31,51,.06), 0 18px 40px rgba(11,31,51,.10)',
};

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: colores.oceano, dark: colores.oceanoOscuro, contrastText: '#fff' },
    secondary: { main: colores.coral, dark: colores.coralOscuro, contrastText: '#fff' },
    info: { main: colores.laguna },
    success: { main: colores.exito },
    warning: { main: colores.alerta },
    background: { default: colores.arena, paper: colores.blanco },
    text: { primary: colores.texto, secondary: colores.textoSuave },
    divider: colores.borde,
  },
  // Unidad de 4px: en sx, borderRadius: 3 = 12px
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: cuerpo,
    h1: { fontFamily: titulo, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.05 },
    h2: { fontFamily: titulo, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1 },
    h3: { fontFamily: titulo, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.15 },
    h4: { fontFamily: titulo, fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontFamily: titulo, fontWeight: 600 },
    h6: { fontFamily: cuerpo, fontWeight: 700, fontSize: '1.05rem' },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 700, letterSpacing: '0.02em' },
    overline: { fontWeight: 700, letterSpacing: '0.14em', fontSize: '0.72rem' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 },
    body1: { lineHeight: 1.65 },
    body2: { lineHeight: 1.6 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: colores.arena, WebkitFontSmoothing: 'antialiased' },
        '::selection': { background: alpha(colores.laguna, 0.3) },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 20, paddingBlock: 9 },
        sizeLarge: { paddingInline: 28, paddingBlock: 13, fontSize: '1rem' },
        sizeSmall: { paddingInline: 14, paddingBlock: 5 },
        outlined: { borderColor: colores.borde, '&:hover': { borderColor: colores.oceano, background: alpha(colores.oceano, 0.04) } },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { borderRadius: 18, border: `1px solid ${colores.borde}`, boxShadow: sombra.suave },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        rounded: { borderRadius: 18 },
        outlined: { borderColor: colores.borde },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 600 },
        sizeSmall: { fontSize: '0.74rem' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: colores.blanco,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: colores.borde },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(colores.oceano, 0.5) },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: colores.arena,
            color: colores.textoSuave,
            fontWeight: 700,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            borderBottom: `1px solid ${colores.borde}`,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: { root: { borderBottom: `1px solid ${colores.borde}` } },
    },
    MuiTableRow: {
      styleOverrides: { root: { '&.MuiTableRow-hover:hover': { backgroundColor: alpha(colores.laguna, 0.06) } } },
    },
    MuiTooltip: {
      styleOverrides: { tooltip: { backgroundColor: colores.tinta, fontSize: '0.78rem', borderRadius: 8 } },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: { '&.Mui-completed': { color: colores.laguna }, '&.Mui-active': { color: colores.oceano } },
      },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 20 } },
    },
    MuiLink: {
      defaultProps: { underline: 'hover' },
    },
  },
});
