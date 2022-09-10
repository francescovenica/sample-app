import {
  NextApiRequest,
  NextApiResponse,
  GetServerSidePropsContext,
} from "next";
import { serialize, parse, CookieSerializeOptions } from "cookie";

type Req = GetServerSidePropsContext["req"] | NextApiRequest;
type Res = GetServerSidePropsContext["res"] | NextApiResponse;

export const getCookie = (req: Req): any => {
  if (req?.headers?.cookie) {
    return parse(req?.headers?.cookie);
  }

  return {};
};

export const setCookie = (
  res: Res,
  name: string,
  value: string,
  options: CookieSerializeOptions
) => {
  const cookieStr = serialize(name, value, { path: "/", ...options });

  const currentCookies = res.getHeader("Set-Cookie");

  res.setHeader(
    "Set-Cookie",
    // @ts-ignore
    !currentCookies ? [cookieStr] : currentCookies.concat(cookieStr)
  );
};

export const deleteCookie = (res: Res, name: string) => {
  setCookie(res, name, "", { maxAge: -1 });
};
