import { json2csv } from "json-2-csv";

export const downloadJsonAsCsv = (
  jsonData: object[],
  filename: string,
  options?: any
) => {
  const opts = Object.assign({ keys: null }, options);

  json2csv(
    jsonData,
    (err, csv?: any) => {
      if (err) {
        console.log("Error converting data to CSV format!", err);

        return;
      }

      const url = window.URL.createObjectURL(new Blob([csv]));

      const link: HTMLAnchorElement = document.createElement("a");
      link.classList.add("display-none");
      link.href = url;
      link.setAttribute("download", `${filename}.csv`);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    },
    opts
  );
};
