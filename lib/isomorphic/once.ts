export const once = <T extends (...args: any[]) => any>(fn: T) => {
    let promise: ReturnType<T> | null = null;
    return function (...args: Parameters<T>) {
        if (!promise) {
            promise = fn.apply(this, args);
        }
        return promise;
    };
};