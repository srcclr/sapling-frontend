import FileSaver from 'file-saver';

export const startCSVDownload = (fileName, data) => {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8' });
  FileSaver.saveAs(blob, `${fileName}.csv`);
};
