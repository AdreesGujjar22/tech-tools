export type ParsedUrl = {
  origin: string;
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  hash: string;
  query: Array<{ key: string; value: string }>;
};

export function parseUrl(value: string): ParsedUrl | null {
  try {
    const url = new URL(value);
    return {
      origin: url.origin,
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      hash: url.hash,
      query: Array.from(url.searchParams.entries()).map(([key, entryValue]) => ({ key, value: entryValue })),
    };
  } catch {
    return null;
  }
}

export type DeviceInformation = {
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  colorDepth: number;
  touchSupport: boolean;
  online: boolean;
};

export function getDeviceInformation(): DeviceInformation {
  return {
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    devicePixelRatio: window.devicePixelRatio || 1,
    colorDepth: window.screen.colorDepth,
    touchSupport: navigator.maxTouchPoints > 0 || "ontouchstart" in window,
    online: navigator.onLine,
  };
}

function base64(value: string) {
  return btoa(unescape(encodeURIComponent(value)));
}

export function createBasicAuth(username: string, password: string) {
  const encoded = base64(`${username}:${password}`);
  return {
    encoded,
    header: `Authorization: Basic ${encoded}`,
    htpasswd: `${username}:${encoded}`,
  };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] || character);
}

export type OpenGraphValues = {
  title: string;
  description: string;
  url: string;
  image: string;
  siteName: string;
  type: string;
  twitterCard: string;
  twitterCreator: string;
};

export function generateOpenGraphTags(values: OpenGraphValues) {
  const tags = [
    ["name", "description", values.description],
    ["property", "og:title", values.title],
    ["property", "og:description", values.description],
    ["property", "og:url", values.url],
    ["property", "og:image", values.image],
    ["property", "og:site_name", values.siteName],
    ["property", "og:type", values.type],
    ["name", "twitter:card", values.twitterCard],
    ["name", "twitter:title", values.title],
    ["name", "twitter:description", values.description],
    ["name", "twitter:image", values.image],
    ["name", "twitter:creator", values.twitterCreator],
  ].filter(([, , content]) => content.trim());
  return tags.map(([attribute, name, content]) => `<meta ${attribute}="${escapeHtml(name)}" content="${escapeHtml(content)}">`).join("\n");
}
