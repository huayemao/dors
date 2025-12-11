export function filterEmptyLines(
    arr: (
        | string
        | number
        | bigint
        | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        | Iterable<React.ReactNode>
        | React.ReactPortal
        | Promise<any>
    )[]
) {
    return arr.filter((e) => {
        const isEmpty = typeof e == "string" && !e.trim();
        return !isEmpty;
    });
}