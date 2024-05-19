import { FileType } from '../../types/types';
import { Button } from '@nextui-org/react';
import { LuDownload } from 'react-icons/lu';
import api from '../../api.ts';

export default function FileDownloader({ files }: { files: FileType[] }) {
  const handleDownload = (fileId: string, fileName: string) => {
    api
      .get(`questions/download-file?id=${fileId}`, {
        responseType: 'blob',
      })
      .then((res) => {
        const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {files.map((file) => (
        <div
          key={file.id}
          className="border border-foreground-200 py-2 px-4 rounded-lg flex items-center gap-3"
        >
          <p>{file.name}</p>
          <Button
            onPress={() => handleDownload(file.id, file.name)}
            isIconOnly
            variant="flat"
            className="bg-transparent"
          >
            <LuDownload size={20} />
          </Button>
        </div>
      ))}
    </div>
  );
}
