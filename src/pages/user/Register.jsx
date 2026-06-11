import { Link } from 'react-router-dom';
import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';

const highlights = [
  'Registro rápido',
  'Reserva inmediata',
  'Experiencia responsive',
];

function Register() {

return (

<main className="min-h-screen bg-[#eef7fd] p-4">

<section className="mx-auto grid min-h-[95vh] max-w-7xl overflow-hidden rounded-[40px] bg-white shadow-[0_30px_80px_rgba(15,23,42,.08)] lg:grid-cols-[1fr_1fr]">

<aside className="bg-gradient-to-br from-[#004aab] to-[#1576ff] p-12 text-white">

<Link
to="/cliente/login"
className="mb-12 inline-grid h-14 w-14 place-items-center rounded-2xl bg-white/15"
>

←

</Link>

<img
src={logoJmGym}
className="h-28 w-28 rounded-[28px] bg-white object-contain"
/>

<h1 className="mt-8 font-display text-6xl font-bold">
Crear cuenta
</h1>

<p className="mt-5 text-lg text-white/80">

Empieza a reservar tus clases favoritas.

</p>

<div className="mt-10 grid gap-4">

{highlights.map((x)=>(

<div
key={x}
className="rounded-3xl bg-white/10 p-5"
>

{x}

</div>

))}

</div>

</aside>

<form className="flex flex-col justify-center p-10">

<h2 className="font-display text-5xl font-bold">
Registro
</h2>

<div className="mt-8 grid gap-5">

<input
placeholder="Nombre completo"
className="rounded-2xl border p-5"
/>

<input
placeholder="DNI"
className="rounded-2xl border p-5"
/>

<input
placeholder="Correo"
className="rounded-2xl border p-5"
/>

<input
placeholder="Contraseña"
className="rounded-2xl border p-5"
/>

<button
className="min-h-16 rounded-2xl bg-brand-600 text-white font-bold"
>

Crear cuenta

</button>

<Link
to="/cliente/login"
className="text-center font-bold text-brand-600"
>

Ya tengo cuenta

</Link>

</div>

</form>

</section>

</main>

);

}

export default Register;