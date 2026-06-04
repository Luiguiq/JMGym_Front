import { useNavigate } from 'react-router-dom';
import ClassForm from '../../components/admin/ClassForm';
import { useState } from 'react';
import { classService } from '../../services/classService';

const CrearClase = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await classService.createClass(formData);
      navigate('/admin/clases');
    } catch (error) {
      console.error('Error creando clase:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClassForm
      onSubmit={handleSubmit}
      onClose={() => navigate('/admin/clases')}
      loading={loading}
    />
  );
};

export default CrearClase;
