export const getShadowStyle = (estado) => {
    switch (estado) {
      case "COMPLETADO":
        return "0px 4px 12px rgba(34, 197, 94, 0.7)"; 
      case "CANCELADO":
        return "0px 4px 12px rgba(239, 68, 68, 0.7)"; 
      case "PENDIENTE":
        return "0px 4px 12px rgba(59, 130, 246, 0.7)"; 
      case "SUGERIDO":
        return "0px 4px 12px rgba(234, 179, 8, 0.7)"; 
      default:
        return "0px 4px 12px rgba(0, 0, 0, 0.1)"; 
    }
};