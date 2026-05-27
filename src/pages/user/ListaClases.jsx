import ClassCard from '../../components/user/ClassCard.jsx';
import { clientHomeData } from '../../data/clientHomeData.js';

function ListaClases() {
  return (
    <main className="min-h-screen bg-brand-50 px-6 py-8">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-extrabold text-slate-800">Clases disponibles</h1>
        <div className="mt-6 grid gap-5">
          {clientHomeData.todayClasses.map((classItem) => <ClassCard classItem={classItem} key={classItem.id} />)}
        </div>
      </section>
    </main>
  );
}

export default ListaClases;
