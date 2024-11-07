"use client";
import { useHerbalContext, useHerbalDispatch } from "./context";
import { TokenForm, getData } from "./page.page";

export function Settings(params) {
  const { list } = useHerbalContext();
  const dispatch = useHerbalDispatch();
  return (
    <div>
      {/* <BaseTextarea id="start" value={start} onChange={setStart}></BaseTextarea>
              <BaseTextarea id="end" value={end} onChange={setEnd}></BaseTextarea> */}
      <TokenForm
        onTokenChange={async (token) => {
          return getData(token).then((data) => {
            dispatch({ payload: { list: data.rows } });
          });
        }}
      ></TokenForm>
    </div>
  );
}
