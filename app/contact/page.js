// app/contact/page.js
export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      <p className="text-xl mb-6">You can reach us at:</p>

      <ul className="space-y-4 text-xl text-gray-800">
        <li>Email: support@campusexchange.com</li>
        <li>Phone: +91 1234567890</li>
        <li>Phone: +91 9012345678</li>
      </ul>
    </div>
  );
}
