import { useState } from 'react';
import { User, Camera } from 'lucide-react';

export default function ProfileForm({ profile, onSave, onToast }) {
  const [form, setForm] = useState({ ...profile });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onToast('Profile updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
            {form.avatar ? (
              <img src={form.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-slate-400" />
            )}
          </div>
          <label className="absolute -bottom-1 -right-1 p-1.5 bg-primary text-white rounded-full cursor-pointer shadow-md hover:bg-blue-700 transition-colors">
            <Camera className="w-3.5 h-3.5" />
            <input 
              type="file" 
              accept="image/*" 
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setForm({ ...form, avatar: reader.result });
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>
        <div>
          <p className="font-semibold text-slate-900">{form.fullName || 'Your Name'}</p>
          <p className="text-sm text-slate-500">{form.email || 'your@email.com'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
