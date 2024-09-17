import { createContext, useContext, useState } from "react";
import { produce } from "immer";

const GlobalStateContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    const [globalState, setGlobalState] = useState({
        transactions: [],
        balance: -1,
    });

    const updateGlobalState = (updater) => {
        setGlobalState((prev) => produce(prev, updater));
    }

    return (
        <GlobalStateContext.Provider value={{ globalState, updateGlobalState }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

export const useGlobalState = () => useContext(GlobalStateContext);

