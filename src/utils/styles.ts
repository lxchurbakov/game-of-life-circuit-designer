export const loadStyles = (text: string) => {
  const style = document.createElement('style')

  style.innerHTML = text

  document.head.appendChild(style)
}