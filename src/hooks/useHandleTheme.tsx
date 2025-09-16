import { useEffect } from "react";
import { useThemeStore } from "../stores/useThemeStore";

const useHandleTheme = () => {
    const { theme, setTheme } = useThemeStore();

    const handleThemeToggle = (value: "light" | "dark") => {
        window.localStorage.setItem("theme", value);
        setTheme(value);
    };

    useEffect(() => {
        const themee = () => {
            const savedTheme = window.localStorage.getItem("theme");
            if (savedTheme === "light" || savedTheme === "dark") {
                setTheme(savedTheme as "light" | "dark");
            } else {
                handleThemeToggle("light");
            }
        }
        themee();
    }, []);

    return { theme, handleThemeToggle };
}

export default useHandleTheme;