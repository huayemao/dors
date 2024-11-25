import { BaseButton, BaseInput } from "@shuriken-ui/react";
import { useHerbalContext, useHerbalDispatch } from "./context";
import { FormEvent, useEffect, useState } from "react";
import { HerbalApiService } from "./api";
import { useNavigate } from "react-router-dom";

export function Settings(params) {
  const { list } = useHerbalContext();
  const dispatch = useHerbalDispatch();
  return (
    <div>
      {/* <BaseTextarea id="start" value={start} onChange={setStart}></BaseTextarea>
              <BaseTextarea id="end" value={end} onChange={setEnd}></BaseTextarea> */}
      <TokenForm
        onTokenChange={async (token) => {
          return HerbalApiService.getArticleList(token).then((data) => {
            dispatch({ payload: { list: data.rows } });
          });
        }}
      ></TokenForm>
    </div>
  );
}

export function TokenForm({
  onTokenChange,
}: {
  onTokenChange: (token: any) => Promise<void>;
}) {
  const [captchaImage, setCap] = useState<{
    msg: string;
    img: string;
    code: number;
    uuid: string;
  }>();
  const nav = useNavigate();

  useEffect(() => {
    HerbalApiService.getCaptchaImage()
      .then((res) => {
        return res.json();
      })
      .then((d: { msg: string; img: string; code: number; uuid: string }) => {
        setCap(d);
      });
  }, []);

  return (
    <form
      className="grid grid-cols-2 gap-4"
      action=""
      onSubmit={async (e) => {
        e.preventDefault();
        {
          /* @ts-ignore */
        }
        const { token, username, password, captcha } = getInputValues(e);
        if (token) {
          // todo: 这里也可能是残存的 token
          await onTokenChange(token);
        } else {
          const token = await HerbalApiService.login(
            username,
            password,
            captchaImage!.uuid,
            captcha
          );
          console.log(token);
          await onTokenChange(token);
          nav("/", { replace: true });
        }
      }}
    >
      <fieldset>
        <BaseInput
          // @ts-ignore
          name="token"
          label="token"
          id="token"
          defaultValue={localStorage.getItem("token") || ""}
        ></BaseInput>
        <BaseButton type="submit">确定</BaseButton>
      </fieldset>
      <fieldset className="border rounded p-4 space-y-2">
        {/* @ts-ignore */}
        <BaseInput name="username" label="username" id="username"></BaseInput>
        <BaseInput
          // @ts-ignore
          name="password"
          type="password"
          label="password"
          id="password"
        ></BaseInput>
        <div className="grid grid-cols-2 gap-2 items-center">
          {/*  eslint-disable-next-line @next/next/no-img-element*/}
          <img
            src={
              captchaImage
                ? ((`data:image/gif;base64,` +
                    (captchaImage as any).img) as string)
                : ""
            }
            alt=""
          />
          {/* @ts-ignore */}
          <BaseInput name="captcha" label="captcha" id="captcha"></BaseInput>
          <BaseButton type="submit">确定</BaseButton>
        </div>
      </fieldset>
    </form>
  );

  function getInputValues(e: FormEvent<HTMLFormElement>) {
    const formEl = e.nativeEvent.target as HTMLElement;
    const getInputEl = (selector: string) =>
      (formEl.querySelector(selector) as HTMLInputElement).value;
    const token = getInputEl("input#token");
    const username = getInputEl("input#username");
    const password = getInputEl("input#password");
    const captcha = getInputEl("input#captcha");
    return { token, username, password, captcha };
  }
}
