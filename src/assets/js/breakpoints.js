import debounce from "@/assets/js/debounce.js";

/**
 * 
 * Функция работает как @media (min-width: ... px) в css
 * 
 * cfg = {
 *  [768] : () => console.log(768), // width >= 768
 *  [576] : () => console.log(576), // width >= 576 && width < 768
 * }
 * 
 * cfg = {
 *  [768] : [foo, baz, function bar() {console.log('bar')}],
 * }
 * 
 * Вызов функций брейкпоинта осуществляется при изменении текущего
 * 
 */

export default function breakpoints(cfg = {}) {
    let currentBreakpoint = new Proxy({
        value: undefined,
    }, {
        set(target, prop, val, receiver) {
            const setUp = Reflect.set(target, prop, val, receiver);

            callsFunctionsBreakpoint();

            return setUp;
        }
    });

    initBreakpointUpdate();

    function initBreakpointUpdate() {
        if (!Object.keys(cfg).length) return;
    
        updatesBreakpoint();
    
        window.addEventListener("resize", debounce(function () {
            updatesBreakpoint();
        }, 400));
    };

    function updatesBreakpoint() {
        const breakpoint = getCurrentBreakpoint();
    
        if (currentBreakpoint.value == breakpoint) return;
    
        currentBreakpoint.value = breakpoint;
    };

    function getCurrentBreakpoint() {
        const width = window.innerWidth;
    
        return Object.keys(cfg).reduce((acc, breakpoint) => {
            if (width >= breakpoint) {
                acc = breakpoint;
            }
    
            return acc;
        }, 0);
    };

    function callsFunctionsBreakpoint() {
        const functionsBreakpoint = cfg[currentBreakpoint.value];

        if (!functionsBreakpoint) return;

        if (typeof functionsBreakpoint === "function") {
            functionsBreakpoint();

            return;
        }

        functionsBreakpoint?.forEach((func) => {
            func();
        });
    };
}