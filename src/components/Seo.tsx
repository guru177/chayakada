import { useEffect } from "react";
import { SITE, absoluteUrl, jsonLdGraph } from "../seo";

type SeoProps = {
  title: string;
  description: string;
  path?: string;
};

function setNamed(name: string, content: string) {
  document.querySelector(`meta[name="${name}"]`)?.setAttribute("content", content);
}

function setProp(property: string, content: string) {
  document.querySelector(`meta[property="${property}"]`)?.setAttribute("content", content);
}

export function Seo({ title, description, path = "/" }: SeoProps) {
  useEffect(() => {
    const url = absoluteUrl(path);
    const image = absoluteUrl(SITE.image);
    document.title = title;
    setNamed("description", description);
    setNamed("keywords", SITE.keywords);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
    setProp("og:title", title);
    setProp("og:description", description);
    setProp("og:url", url);
    setProp("og:image", image);
    setNamed("twitter:title", title);
    setNamed("twitter:description", description);
    setNamed("twitter:image", image);
    const jsonLd = document.getElementById("json-ld");
    if (jsonLd) jsonLd.textContent = JSON.stringify(jsonLdGraph(path));
  }, [title, description, path]);

  return null;
}
