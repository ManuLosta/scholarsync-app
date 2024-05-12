import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image } from '@nextui-org/react';
import { LuFileUp, LuX } from 'react-icons/lu';

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

  const handleDeleteImage = (image: Image) => {
    setImages(images.filter((i) => i !== image));
  };

  const handleDeleteFile = (file: File) => {
    setFiles(files.filter((f) => f !== file));
  };

  return (
    <div className="border border-foreground-200 p-2 rounded-lg flex flex-col">
      <div
        className={`outline-none p-2 rounded-lg border-dashed border border-foreground-200 flex flex-col items-center ${isDragActive && 'border-2 border-dashed bg-primary-50 border-primary'}`}
        {...getRootProps({
          onClick: (event) => event.stopPropagation(),
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-1">
          <LuFileUp size={60} />
          <p>
            Arrastra archivos o{' '}
            <span
              className="font-bold hover:cursor-pointer text-primary"
              onClick={open}
            >
              subir
            </span>
          </p>
        </div>
      </div>
      {images.length > 0 && (
        <div className="flex p-3 gap-4 max-h-[200px]">
          {images.map((image) => (
            <div className="relative">
            <span
              onClick={() => handleDeleteImage(image)}
              className="z-50 transition-all hover:cursor-pointer hover:scale-110 absolute bg-danger rounded-full top-2 right-2"
            >
              <LuX size={20} />
            </span>
              <Image
                className="h-[150px] w-[150px] rounded object-cover"
                src={image.preview}
                alt={image.name}
              />
            </div>
          ))}
        </div>
      )}
      {files.length > 0 && (
        <div className="flex p-3 basis-1/2 gap-2">
          {files.map((file) => (
            <div className="border p-2 rounded-md flex items-center gap-4">
              <p>{file.name}</p>
              <span
                onClick={() => handleDeleteFile(file)}
                className="transition-all text-danger hover:cursor-pointer hover:scale-105"
              >
              <LuX />
            </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
