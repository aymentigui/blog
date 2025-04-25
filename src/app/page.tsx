
// import ListBlogsCategories from './ListBlogsCategories'; // Assurez-vous que le chemin est correct
// import ListBlog from './ListBlog'; // Assurez-vous que le chemin est correct

import HeaderPublic from "@/components/my/public/header";
import ListBlogs from "./admin/blogs/_component/list-blogs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen">
      {/* Header */}
      <HeaderPublic />

      {/* Welcome Banner */}
      <section className="flex items-center justify-center bg-blue-500 text-white h-96 w-full relative">
        <Image src="/blog-landing.webp" alt="" fill className="object-cover w-full h-full absolute z-0 top-0 right-0" />
        <div className="text-3xl p-4 w-full h-full font-bold flex justify-center items-center absolute top-0 right-0 z-10">
          <h1 className="text-center">Bienvenue sur notre site de blogs !</h1>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="p-4 border rounded-md m-3">
        <h2 className="text-2xl font-semibold mb-1">Nos Catégories de Blogs</h2>
        <div className="flex gap-4 overflow-auto w-full p-4">
          <Link href={"/"} className="min-w-[150px] hover:bg-amber-600 bg-amber-500 text-white border rounded-3xl shadow p-2 flex justify-center items-center">
            <p>Name categorie </p>
          </Link>
        </div>
        {/* <ListBlogsCategories /> */}
      </section>

      {/* Blogs Section */}
      <section id="blogs" className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Nos Derniers Blogs</h2>
        <ListBlogs isHideTable hideAction hidePagination hideSearch hideFliterPageSize />
      </section>

      {/* About me Section */}
      <section id="about" className="p-10 border-b border-t grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center rounded-md m-3 gap-4">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-2xl font-semibold mb-1 italic">A propos de moi</h2>
          <p className="text-center text-l italic">Je suis un développeur web passionné par l'innovation et l'optimisation des processus de développement. J'ai commencé avec des projets personnels et je suis maintenant impliqué dans des projets professionnels qui utilisent Next.js et React.js</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-2xl font-semibold mb-1 italic">Ma Mission</h2>
          <p className="text-center text-l italic">Mon objectif est de fournir des ressources précieuses et des tutoriels détaillés sur le développement web, tant pour les débutants que pour les experts.</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-2xl font-semibold mb-1 italic">Mes Competences</h2>
          <p className="text-center text-l italic">Je suis développeur web avec une expertise en Next.js, React.js, PHP et WordPress. Je me spécialise dans l'intégration front-end et back-end, tout en optimisant les performances des applications web pour offrir une expérience fluide et rapide.</p>
        </div>
      </section>

      <div className="h-[200px]"></div>
    </div>
  );
}
