// app/about/page.js
export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>
      <p className="text-lg text-gray-700 leading-relaxed mb-4">
        The Campus Exchange project addresses the critical need for sustainable
        resource utilization and collaborative academic culture within
        educational institutions, where traditional resource management
        approaches result in significant underutilization of textbooks,
        laboratory equipment, stationery, and handwritten notes that remain idle
        after temporary use.
      </p>
      <p className="text-lg text-gray-700 leading-relaxed mb-4">
        This web-based platform facilitates peer-to-peer sharing, lending, and
        selling of academic resources among students, creating a structured
        environment for resource exchange within the campus ecosystem. The
        system enables students to create categorized listings for their
        available resources, search and filter through materials posted by
        others, and communicate directly to coordinate transactions through
        integrated messaging functionality.
      </p>
      <p className="text-lg text-gray-700 leading-relaxed">
        By providing a centralized solution for resource management, Campus
        Exchange promotes sustainable academic practices through resource reuse,
        reduces financial burden on students, strengthens campus community bonds
        through collaborative sharing, and develops environmentally conscious
        academic practices by extending the lifecycle of educational resources.
      </p>
    </div>
  );
}
