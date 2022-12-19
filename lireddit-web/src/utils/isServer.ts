import { useEffect, useState } from "react";

//export const isServer = () => typeof window === "undefined";

export const isServer = () => {
    const [isSSR, setIsSSR] = useState(true);

    useEffect(() => {
        setIsSSR(false);
    }, []); 
    return isSSR;
}