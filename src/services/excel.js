export const loadDownloadToExcelScript = (callback) => {
  const existingScript = document.getElementById('download_to_excel');

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.13.1/xlsx.full.min.js";
    script.id = 'download_to_excel';
    document.body.appendChild(script);

    script.onload = () => {
      if (callback) callback();
    };
  }

  if (existingScript && callback) callback();
};