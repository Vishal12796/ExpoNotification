import * as React from "react";
import { CommonActions } from "@react-navigation/core";

export const navigationRef = React.createRef();
export function navigate(name, params) {
    // console.log("Navigation ref : ", navigationRef);
    navigationRef.current?.navigate(name, params);
}

export function navigateReset(name, params) {
    navigationRef.current?.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [
                {
                    name: name,
                    params: params,
                },
            ],
        })
    );
}
