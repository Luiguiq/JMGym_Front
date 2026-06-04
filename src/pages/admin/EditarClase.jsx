import { useNavigate, useParams } from 'react-router-dom';
import ClassForm from '../../components/admin/ClassForm';
import { useState, useEffect } from 'react';
import Loader from '../../components/admin/Loader';
import { classService } from '../../services/classService';

const EditarClase = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadClassData();
  }, [id]);

  const loadClassData = async () => {
    try {
      setLoading(true);
      const data = await classService.getClassById(id);
      setClassData(data);
    } catch (error) {
      console.error('Error cargando clase:', error);
      navigate('/admin/clases');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      await classService.updateClass(id, formData);
      navigate('/admin/clases');
    } catch (error) {
      console.error('Error actualizando clase:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !classData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="lg" text="Cargando clase..." />
      </div>
    );
  }

  return (
    <ClassForm
      initialData={classData}
      onSubmit={handleSubmit}
      onClose={() => navigate('/admin/clases')}
      loading={saving}
    />
  );
};

export default EditarClase;
