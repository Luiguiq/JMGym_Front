import ClassForm from '../../components/admin/ClassForm.jsx';
import { classService } from '../../services/classService.js';

function CrearClase() {
  return <main className="p-6"><ClassForm onSubmit={classService.createClass} /></main>;
}

export default CrearClase;
