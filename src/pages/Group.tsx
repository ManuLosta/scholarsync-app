import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api.ts';

type Group = {
  title: string
}

export default function Group() {
  const { groupId } = useParams();
  const [ group, setGroup ] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`groups/getGroup?group_id=${groupId}`)
      .then(res => {
        const data = res.data;
        setGroup(data);
      })
      .catch(err => {
        console.error("Error fetching group info: ", err)
      })
      .finally(() => setLoading(false))
  }, [groupId]);

  return group &&  (
    <div className="container">
      Group page
      {groupId}
    </div>
  )
}