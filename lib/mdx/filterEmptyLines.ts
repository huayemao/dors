export function filterEmptyLines(
    arr: (
        | string
        | number
        | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        | React.ReactFragment
        | React.ReactPortal
    )[]
) {
    return arr.filter((e) => {
        const isEmpty = typeof e == "string" && !e.trim();
        return !isEmpty;
    });
}