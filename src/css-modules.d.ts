/** Declaração global para CSS Modules — necessário para build de biblioteca */
declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

declare module '*.css' {
  const css: string
  export default css
}
