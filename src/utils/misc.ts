export const getToken = () => localStorage.getItem("token");
export const getUrlParam = (url = window.location.href) => {
  return url.substring(url.lastIndexOf("/") + 1, url.length) || null;
};
