import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.ts';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Group, Profile, Question as QuestionType } from '../types/types';
import { Avatar, Button, Image, Link } from '@nextui-org/react';
import Carousel from '../components/Carousel.tsx';
import { LuDownload } from 'react-icons/lu';
import MathExtension from '@aarkue/tiptap-math-extension';

type Image = {
  base64Encoding: string;
  fileType: string;
};

type FileType = {
  id: string;
  file_type: string;
  name: string;
}

export default function Question() {
  const { id } = useParams();
  const [question, setQuestion] = useState<QuestionType>();
  const [author, setAuthor] = useState<Profile>();
  const [group, setGroup] = useState<Group>();
  const [images, setImages] = useState<Image[]>([]);
  const [files, setFiles] = useState<FileType[]>([])
  const [loading, setLoading] = useState<boolean>(true);

  const editor = useEditor({
    extensions: [StarterKit, MathExtension.configure({ evaluation: true })],
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose',
      },
    },
  });

  useEffect(() => {
    api
      .get(`questions/get-question?id=${id}`)
      .then((res) => {
        const data = res.data;
        console.log(data.body);
        setQuestion(data.body);
      })
      .catch((err) => console.error(err));

    // fetch question images  
    api
      .get(`questions/get-images?id=${id}`)
      .then((res) => {
        const data = res.data;
        setImages(data.body);
      })
      .catch((err) => console.error(err));
    
    // fetch question files and filter images
    api
      .get(`questions/get-question-files?id=${id}`)
      .then((res) => {
        const data: FileType[] = res.data.body
        setFiles(
          data.filter(file => !file.file_type.startsWith("image"))
        )
      })
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    // Set editor content
    if (question?.content) {
      editor?.commands.setContent(question.content);
    }

    // fetch user profile
    api
      .get(`users/profile/${question?.authorId}`)
      .then((res) => {
        const data = res.data;
        setAuthor(data);
      })
      .catch((err) => console.error(err));

    // fetch group info
    api
      .get(`groups/getGroup?group_id=${question?.groupId}`)
      .then((res) => {
        const data = res.data;
        setGroup(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [editor, question]);

  const handleDownload = (fileId: string, fileName: string) => {
    api.get(`questions/download-file?id=${fileId}`, {
      responseType: 'blob'
    })
    .then(res => {
      const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
  }

  return (
    !loading && (
      <div className="col-span-9">
        <div className="p-4 flex gap-3 flex-col border rounded-lg">
          <div className="flex gap-2 items-center">
            <Avatar name={group?.title} color="primary" />
            <div className="flex flex-col">
              <Link
                href={`/group/${group?.id}`}
                className="font-bold hover:cursour-pointer text-foregorund"
              >
                {group?.title}
              </Link>
              <Link
                href={`/user/${author?.id}`}
                className="hover:cursour-pointer text-foregorund"
              >
                @{author?.username}
              </Link>
            </div>
          </div>
          <h1 className="text-2xl font-bold">{question?.title}</h1>
          <EditorContent editor={editor} />
          {images.length > 0 && (
            <Carousel
              images={images.map(
                (image) =>
                  `data:${image.fileType};base64,${image.base64Encoding}`,
              )}
            />
          )}
          {files.length > 0 && (
          <div className="flex gap-2">
            {files.map(file => (
              <div className='border py-2 px-4 rounded-lg flex items-center gap-3'>
                <p>{file.name}</p>
                <Button onPress={() => handleDownload(file.id, file.name)} isIconOnly variant="flat" className="bg-transparent">
                  <LuDownload size={20} />
                </Button>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    )
  );
}
