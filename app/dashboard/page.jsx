'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const [destUrl, setDestUrl] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/links')
      .then(res => res.json())
      .then(data => setLinks(data))
      .catch(() => router.push('/login'));
  }, []);

  const createLink = async (e) => {
    e.preventDefault();
    setError('');
    if (!destUrl.startsWith('http')) {
      setError('Please enter a full URL');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/create-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destUrl }),
    });
    if (res.ok) {
      const { linkId, url } = await res.json();
      setGeneratedLink(url);
      setLinks([...links, { id: linkId, destUrl, results: [] }]);
      setDestUrl('');
    } else {
      const data = await res.json();
      setError(data.error || 'Failed');
    }
    setLoading(false);
  };

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button onClick={logout} className="text-red-600 hover:underline">Logout</button>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Spy Link</h2>
          <form onSubmit={createLink} className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              placeholder="Destination URL (e.g., https://t.me/yourchannel)"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={destUrl}
              onChange={e => setDestUrl(e.target.value)}
              required
            />
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? 'Creating...' : 'Generate Link'}
            </button>
          </form>
          {generatedLink && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">Your spy link:</p>
              <input readOnly value={generatedLink} className="w-full mt-1 px-3 py-2 border rounded bg-white text-sm" />
            </div>
          )}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Links</h2>
          {links.length === 0 ? (
            <p className="text-gray-500">No links yet.</p>
          ) : (
            <ul className="space-y-3">
              {links.map(link => (
                <li key={link.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium text-gray-700">/{link.id}</p>
                    <p className="text-sm text-gray-400 truncate max-w-xs">{link.destUrl}</p>
                  </div>
                  <Link href={`/dashboard/links/${link.id}`} className="text-blue-600 hover:underline text-sm">View Results ({link.results.length})</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
