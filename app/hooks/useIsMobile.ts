"use client";

import { useState, useEffect } from "react";

const useIsMobile = (breakpoint: number = 768) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            // Detecta si el ancho de la ventana es menor que el breakpoint
            setIsMobile(window.innerWidth <= breakpoint);
        };

        // Ejecuta el check al montar el componente
        handleResize();

        // Escucha cambios de tamaño de ventana
        window.addEventListener("resize", handleResize);

        // Limpia el evento al desmontar
        return () => window.removeEventListener("resize", handleResize);
    }, [breakpoint]);

    return isMobile;
};

export default useIsMobile;
