import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Image } from '@nextui-org/react';

interface Image extends File {
  preview: string;
}

export default function FileUploader({
  onChange,
}: {
  onChange: (files: File[]) => void;
}) {
  const [images, setImages] = useState<Image[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      console.log(acceptedFiles);

      setImages([
        ...images,
        ...acceptedFiles
          .filter((file) => file.type.startsWith('image/'))
          .map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            }),
          ),
      ]);

      setFiles([
        ...files,
        ...acceptedFiles.filter((file) => !file.type.startsWith('image/')),
      ]);

      onChange([...files, ...images, ...acceptedFiles]);
    },
    [files, images, onChange],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
  });

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => images.forEach((image) => URL.revokeObjectURL(image.preview));
  }, []);

  return (
    <div
      className={`border p-4 rounded-lg ${isDragActive && 'border-2 border-dashed bg-primary-50 border-primary'}`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div className="align-center justify-center">
        <p>Arrastra archivos o</p>
        <Button onPress={open} color="primary">
          Subir
        </Button>
      </div>
      <div className="flex gap-4 max-h-[200px]">
        {images.map((image) => (
          <Image height={150} width={150} src={image.preview} />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {files.map((file) => (
          <div className="border p-2 rounded-md">{file.name}</div>
        ))}
      </div>
    </div>
  );
}
