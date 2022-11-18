import React from 'react';

export const observable = (predicate) => {
    return {
        subscribe: (listener) => predicate(listener),
        pipe: (mapper) => mapper(observable(predicate)),
    };
};

// Mappers

export const map = (predicate) => (obs) => 
    observable((listener) => obs.subscribe((value) => listener(predicate(value))));

export const mergehMap = (predicate) => (obs) =>   
    observable((listener) => {
        obs.subscribe((value) => {
            predicate(value).subscribe(listener)
        });
    });

export const replay = (obs) => {
    let value = null;

    return observable((listener) => {
        listener(value);
        return obs.subscribe(($) => {
            value = $;
            listener(value);
        });
    });
};

// Subject stuff

// const subject = () => {
//     return { ...observable((listener) => {

//     }), next: () => {

//     }};
// };

// const active$ = obs

// const 


export const subject = (value) => {
    let listeners = [];
    let last = value;

    return { ...observable((listener) => {
        listeners.push(listener);
        listener(last);
        return () => {
            listeners = listeners.filter((l) => l!==listener);
        };
    }), next: ($) => {
        last = $;
        listeners.forEach((l) => l($));
    }, get: () => {
        return last;
    } };
};

// obs((listener) => {
//     setTimeout(() => {
//         listener(20);
//     }, 1000);
// }).pipe(map((v) => v * 2)).subscribe(console.log)

export const useObservable = ($) => {
    const [state, setState] = React.useState(null);

    React.useEffect(() => {
        return $.subscribe((value) => {
            setState(value);
        });
    }, []);

    return state;
};
