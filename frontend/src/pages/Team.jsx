import { useEffect, useState, useRef } from 'react';
import { api } from '../api';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Users, 
  Building, 
  Upload, 
  Save, 
  UserPlus, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin,
  FileText,
  Shield,
  Camera,
  Edit
} from 'lucide-react';

function Team() {
  const { t } = useTranslation();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [businessForm, setBusinessForm] = useState({
    name: '',
    ice: '',
    if_number: '',
    cnie: '',
    professional_tax_number: '',
    address: '',
    phone: '',
    email: ''
  });
  const [logoUploading, setLogoUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInput = useRef();

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const data = await api.get('/teams/me');
      setTeam(data);
      setBusinessForm({
        name: data.name || '',
        ice: data.ice || '',
        if_number: data.if_number || '',
        cnie: data.cnie || '',
        professional_tax_number: data.professional_tax_number || '',
        address: data.address || '',
        phone: data.phone || '',
        email: data.email || ''
      });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/teams/invite', { email: inviteEmail });
      setInviteEmail('');
      fetchTeam();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemove = async (user_id) => {
    if (!window.confirm('Remove this member from the team?')) return;
    try {
      await api.post('/teams/remove', { user_id });
      fetchTeam();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBusinessFormChange = (e) => {
    setBusinessForm({
      ...businessForm,
      [e.target.name]: e.target.value
    });
  };

  const handleBusinessFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post('/teams/update', businessForm);
      await fetchTeam();
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('logo', file);
      await fetch('/api/teams/logo', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` },
        body: formData,
      });
      fetchTeam();
    } catch (err) {
      setError('Logo upload failed');
    }
    setLogoUploading(false);
  };

  if (loading) {
    return (
      <div className="space-y-8 py-6 px-4 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded-lg w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 px-4 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent flex items-center gap-3">
            <Building className="h-10 w-10 text-blue-600" />
            Business Settings
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage your business information and team members
          </p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500 rounded-full">
                <Trash2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Business Information */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-white/20 rounded-full">
                <FileText className="h-6 w-6" />
              </div>
              Business Information
            </CardTitle>
            <p className="text-blue-100 mt-2">Required for Moroccan invoice compliance</p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleBusinessFormSubmit} className="space-y-6">
              {/* Logo Upload */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {team?.logo_url ? (
                    <div className="relative">
                      <img 
                        src={team.logo_url} 
                        alt="Company Logo" 
                        className="w-20 h-20 rounded-xl object-cover border-4 border-blue-100 shadow-lg" 
                      />
                      <button
                        type="button"
                        onClick={() => fileInput.current.click()}
                        className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInput.current.click()}
                      className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:from-blue-50 hover:to-blue-100 transition-colors border-2 border-dashed border-gray-300 hover:border-blue-400"
                    >
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInput}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInput.current.click()}
                  disabled={logoUploading}
                  className="text-xs"
                >
                  {logoUploading ? 'Uploading...' : 'Upload Logo'}
                </Button>
              </div>

              {/* Business Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    name="name"
                    value={businessForm.name}
                    onChange={handleBusinessFormChange}
                    placeholder="Your Business Name"
                    required
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={businessForm.email}
                    onChange={handleBusinessFormChange}
                    placeholder="business@company.com"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ICE Number *
                  </label>
                  <input
                    name="ice"
                    value={businessForm.ice}
                    onChange={handleBusinessFormChange}
                    placeholder="123456789012345"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Identifiant Commun de l'Entreprise</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    IF Number *
                  </label>
                  <input
                    name="if_number"
                    value={businessForm.if_number}
                    onChange={handleBusinessFormChange}
                    placeholder="12345678"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Identifiant Fiscal</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CNIE
                  </label>
                  <input
                    name="cnie"
                    value={businessForm.cnie}
                    onChange={handleBusinessFormChange}
                    placeholder="BK1234567"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Carte Nationale d'Identité Électronique</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Taxe Professionnelle N°
                  </label>
                  <input
                    name="professional_tax_number"
                    value={businessForm.professional_tax_number}
                    onChange={handleBusinessFormChange}
                    placeholder="TP123456"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Numéro de Taxe Professionnelle</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={businessForm.phone}
                    onChange={handleBusinessFormChange}
                    placeholder="+212 6 12 34 56 78"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Address
                  </label>
                  <textarea
                    name="address"
                    value={businessForm.address}
                    onChange={handleBusinessFormChange}
                    placeholder="123 Business Street, City, Morocco"
                    rows={3}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 shadow-lg"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Business Info
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-xl">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-white/20 rounded-full">
                <Users className="h-6 w-6" />
              </div>
              Team Members
            </CardTitle>
            <p className="text-green-100 mt-2">Manage your team access and permissions</p>
          </CardHeader>
          <CardContent className="p-6">
            {/* Invite Form */}
            <form onSubmit={handleInvite} className="mb-6">
              <div className="flex gap-2">
                <input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Email address to invite"
                  type="email"
                  required
                  className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm transition-all duration-200"
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite
                </Button>
              </div>
            </form>

            {/* Members List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 mb-4">Current Members</h3>
              {team?.members?.length > 0 ? (
                team.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                        {member.name ? member.name.charAt(0).toUpperCase() : member.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {member.name || 'No name set'}
                        </div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                        <div className="text-xs text-green-600 font-medium capitalize">
                          {member.role}
                        </div>
                      </div>
                    </div>
                    {member.role !== 'owner' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemove(member.id)}
                        className="hover:bg-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No team members yet</h3>
                  <p className="text-gray-500">Invite team members to collaborate on invoices</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Notice */}
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500 rounded-full">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Moroccan Business Compliance</h3>
              <p className="text-amber-800 text-sm leading-relaxed">
                Your ICE and IF numbers are required for Moroccan business compliance and will appear on all generated invoices. 
                Make sure these are accurate as they are legally required for valid business transactions in Morocco.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Team; 