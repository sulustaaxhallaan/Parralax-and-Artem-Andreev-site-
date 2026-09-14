import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* Портфолио раньше жило на корне, а прайс — на /prices. Теперь на
       корне развилка, и оба переехали под /design. Ссылки, отданные
       до переезда, ведём на новые адреса. */
    async redirects() {
        return [
            {
                source: "/prices",
                destination: "/design/prices",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
