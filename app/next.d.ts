// next.d.ts
import "next";

declare module "next" {
  export type PageProps = {
    params?: { [key: string]: string | string[] };
    searchParams?: { [key: string]: string | string[] | undefined };
  };
}
