import { FileType } from '../../types/types';
import { useEffect, useState } from 'react';
import api from '../../api.ts';
import { Image } from '@nextui-org/react';

export default function ChatImage({ image }: { image: FileType }) {
  const [file, setFile] = useState<string>();

  useEffect(() => {
    api
      .get(`downloads?id=${image.id}`, {
        responseType: 'blob',
      })
      .then((res) => {
        const data: Blob = res.data;
        setFile(URL.createObjectURL(data));
      })
      .catch((error) => console.error('Error fetching image: ', error));
  }, []);

  return <Image className="border-foreground-200 border" src={file} />;
}
