import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ClassForm from '../../components/admin/ClassForm.jsx';
import { classService } from '../../services/classService.js';

function EditarClase() {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    classService
      .getClassById(id)
      .then(setClassData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <main className="p-6"><p className="text-slate-500">Cargando...</p></main>;

  return <main className="p-6"><ClassForm initialData={classData} onSubmit={(data) => classService.updateClass(id, data)} /></main>;
}

export default EditarClase;
