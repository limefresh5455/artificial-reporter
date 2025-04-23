export default function Sidebar() {
    return (
      <div className="space-y-6">
        <Newsletter />
        <Insights />
        <Tags />
       
      </div>
    );
  }
  
  function Newsletter() {
    return (
      <div className="bg-white border p-4">
        <h4 className="font-semibold mb-2">Newsletter</h4>
        <p className="text-sm">Subscribe for weekly updates.</p>
        <input type="email" placeholder="Your Email" className="w-full p-2 border mt-2 mb-2" />
        <button className="bg-blue-700 text-white px-4 py-2 w-full">Sign Up</button>
      </div>
    );
  }
  
  function Insights() {
    return (
      <div className="bg-white border p-4">
        <h4 className="font-semibold mb-2">Insights</h4>
        <ul className="text-sm list-disc pl-4">
          <li>AI Research</li>
          <li>Startups</li>
          <li>Investments</li>
        </ul>
      </div>
    );
  }
  
  function Tags() {
    const tags = ["Politics", "Tech", "Health", "Science"];
    return (
      <div className="bg-white border p-4 shadow">
        <h4 className="font-semibold mb-2">Tags</h4>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="bg-gray-200 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }
  
  // function Podcast() {
  //   return (
  //     <div className="bg-blue-900 text-white p-4">
  //       <h4 className="font-semibold mb-2">Podcast</h4>
  //       <p className="text-sm">Listen to our latest episode on AI's future.</p>
  //       <button className="mt-2 underline text-sm">View All Episodes</button>
  //     </div>
  //   );
  // }
  