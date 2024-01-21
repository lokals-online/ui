import { useEffect, useState } from "react";

// todo: useData<Type> instead of dep: any!
export const useData = <T, D>(requestFn: Function, dep: Array<any>): (T | null) => {
    const [state, setState] = useState<T | null>(null);
  
    useEffect(() => {
      const dataFetch = async () => {
        const fnResult = await requestFn();
  
        // console.log(fnResult);
        setState(fnResult);
      };
  
      dataFetch();
    }, dep);
  
    return state;
  };