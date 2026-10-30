
export function PrintBtn() {
  return (
    <div 
      onClick={() => window.print()}
      onKeyDown={() => window.print()} 
      className="cursor-pointer" 
      tabIndex={0} 
      aria-label='Imprimir factura'
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="#000000">
          <path d="M21 6h-3V2H6v4H3c-1.104 0-2 .896-2 2v12c0 1.104.896 2 2 2h3v4h12v-4h3c1.104 0 2-.896 2-2V8c0-1.104-.896-2-2-2zm-5-3h-6v2h6V3zm2 18H6v-2h12v2zm2-4H3V8h18v10z"/>
      </svg>
    </div>
  );
}

export default PrintBtn;
