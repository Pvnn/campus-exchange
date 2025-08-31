import Layout from "../../components/Layout";

export default function About() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-16 px-6">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          The Campus Exchange project addresses the critical need for
          sustainable resource utilization and collaborative academic culture
          within educational institutions, where traditional resource management
          approaches result in significant underutilization of textbooks,
          laboratory equip ment, stationery, and handwritten notes that remain
          idle after temporary use. This web-based platform facilitates
          peer-to-peer sharing, lending, and selling of academic resources among
          students, creating a structured environment for resource exchange
          within the campus ecosystem. The system enables students to create
          categorized listings for their available resources, search and filter
          through materials posted by others, and communicate directly to
          coordinate transactions through integrated messaging functionality.
          The platform implements secure user authentication and role-based
          access control to ensure safe transactions while maintaining user
          privacy throughout the exchange process. By providing a centralized
          database-driven solution for resource management, the Campus Exchange
          platform promotes sustainable academic practices through resource
          reuse, reduces financial burden on students by maximizing
          accessibility to essential learning materials, strengthens campus
          community bonds through collaborative sharing, and develops
          environmentally conscious academic practices by extending the
          lifecycle of educational resources
        </p>
      </div>
    </Layout>
  );
}
