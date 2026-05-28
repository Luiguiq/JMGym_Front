import { useEffect, useState } from 'react';
import ClassTable from '../../components/admin/ClassTable.jsx';
import { classService } from '../../services/classService.js';

function ClasesAdmin() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    classService
      .getAllClasses()
      .then(setClasses)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return <main className="p-6"><ClassTable classes={classes} loading={loading} /></main>;
}

export default ClasesAdmin;
