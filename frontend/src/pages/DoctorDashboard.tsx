import React, { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Users, 
  FileText, 
  Star, 
  History,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  User
} from 'lucide-react'
import WalletConnect from '../components/WalletConnect'

// Doctor Dashboard Components
const DoctorHome: React.FC = () => {
  const { user } = useAuth()
  
  return (
    <div className="space-y-6">
      <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-primary/20">
        <h2 className="text-2xl font-bold mb-4">Welcome, Dr. {user?.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary/10 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="w-6 h-6 text-primary" />
              <h3 className="font-semibold">Specialization</h3>
            </div>
            <p className="text-text-light/70 dark:text-text-dark/70">
              {user?.specialization || 'General Practice'}
            </p>
          </div>
          
          <div className="bg-secondary/10 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Star className="w-6 h-6 text-secondary" />
              <h3 className="font-semibold">Rating</h3>
            </div>
            <p className="text-text-light/70 dark:text-text-dark/70">
              4.8/5.0 (127 reviews)
            </p>
          </div>
          
          <div className="bg-green-500/10 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h3 className="font-semibold">Consultations</h3>
            </div>
            <p className="text-text-light/70 dark:text-text-dark/70">
              342 completed
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-primary/20">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/doctor/patfind"
            className="flex items-center space-x-3 p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
          >
            <Users className="w-6 h-6 text-primary" />
            <div>
              <div className="font-medium">Find Patients</div>
              <div className="text-sm text-text-light/70 dark:text-text-dark/70">
                View nearby emergency patients
              </div>
            </div>
          </Link>
          
          <Link
            to="/doctor/pow"
            className="flex items-center space-x-3 p-4 bg-secondary/10 hover:bg-secondary/20 rounded-lg transition-colors"
          >
            <FileText className="w-6 h-6 text-secondary" />
            <div>
              <div className="font-medium">Submit PoW</div>
              <div className="text-sm text-text-light/70 dark:text-text-dark/70">
                Record treatment completion
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Wallet Connection for Blockchain Activities */}
      <WalletConnect />
    </div>
  )
}

const PatFind: React.FC = () => {
  const [patients] = useState([
    {
      id: 1,
      name: 'John Doe',
      location: 'New York, NY',
      distance: '2.3 km',
      emergency: 'Chest Pain',
      time: '5 min ago',
      status: 'urgent'
    },
    {
      id: 2,
      name: 'Jane Smith',
      location: 'Brooklyn, NY',
      distance: '4.1 km',
      emergency: 'Difficulty Breathing',
      time: '12 min ago',
      status: 'critical'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      location: 'Queens, NY',
      distance: '6.7 km',
      emergency: 'Severe Headache',
      time: '18 min ago',
      status: 'moderate'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-500 bg-red-50 dark:bg-red-900/20'
      case 'urgent': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20'
      case 'moderate': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Emergency Patients</h2>
        <div className="flex items-center space-x-2 text-sm text-text-light/70 dark:text-text-dark/70">
          <MapPin className="w-4 h-4" />
          <span>Showing patients within 10km radius</span>
        </div>
      </div>

      <div className="grid gap-4">
        {patients.map((patient) => (
          <div key={patient.id} className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-primary/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{patient.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-text-light/70 dark:text-text-dark/70">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{patient.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{patient.time}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.status)}`}>
                {patient.status.toUpperCase()}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="font-medium">Emergency:</span>
                <span className="text-red-600 dark:text-red-400">{patient.emergency}</span>
              </div>
              <p className="text-text-light/70 dark:text-text-dark/70">
                Patient is experiencing {patient.emergency.toLowerCase()} and requires immediate medical attention.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-text-light/70 dark:text-text-dark/70">
                Distance: <span className="font-medium">{patient.distance}</span>
              </div>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors">
                  Accept Case
                </button>
                <button className="px-4 py-2 border border-primary text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ProofOfWork: React.FC = () => {
  const [formData, setFormData] = useState({
    patientAddress: '',
    treatmentDescription: '',
    medications: '',
    followUpRequired: false,
    followUpDate: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Integrate with smart contract
    console.log('Submitting PoW:', formData)
    alert('PoW submitted successfully!')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Submit Proof of Work</h2>
      
      {/* Wallet Connection for Blockchain Activities */}
      <WalletConnect />
      
      <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-primary/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Patient Address *
            </label>
            <input
              type="text"
              value={formData.patientAddress}
              onChange={(e) => setFormData({ ...formData, patientAddress: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter patient's wallet address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Treatment Description *
            </label>
            <textarea
              value={formData.treatmentDescription}
              onChange={(e) => setFormData({ ...formData, treatmentDescription: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={4}
              placeholder="Describe the treatment provided..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Medications Prescribed
            </label>
            <input
              type="text"
              value={formData.medications}
              onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="List medications prescribed (if any)"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="followUp"
              checked={formData.followUpRequired}
              onChange={(e) => setFormData({ ...formData, followUpRequired: e.target.checked })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="followUp" className="text-sm font-medium">
              Follow-up required
            </label>
          </div>

          {formData.followUpRequired && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Follow-up Date
              </label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Submit Proof of Work
          </button>
        </form>
      </div>
    </div>
  )
}

const MyRating: React.FC = () => {
  const [ratings] = useState([
    {
      id: 1,
      patient: 'Alice Johnson',
      rating: 5,
      comment: 'Excellent care and very professional. Highly recommended!',
      date: '2024-01-15'
    },
    {
      id: 2,
      patient: 'Bob Wilson',
      rating: 4,
      comment: 'Good doctor, explained everything clearly.',
      date: '2024-01-12'
    },
    {
      id: 3,
      patient: 'Carol Davis',
      rating: 5,
      comment: 'Saved my life during the emergency. Thank you!',
      date: '2024-01-10'
    }
  ])

  const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Ratings</h2>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary">{averageRating.toFixed(1)}/5.0</div>
          <div className="text-sm text-text-light/70 dark:text-text-dark/70">
            Based on {ratings.length} reviews
          </div>
        </div>
      </div>

      <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-primary/20">
        <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
        <div className="space-y-4">
          {ratings.map((rating) => (
            <div key={rating.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium">{rating.patient}</div>
                  <div className="text-sm text-text-light/70 dark:text-text-dark/70">
                    {rating.date}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-text-light/70 dark:text-text-dark/70">
                {rating.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const DoctorHistory: React.FC = () => {
  const [consultations] = useState([
    {
      id: 1,
      patient: 'John Doe',
      date: '2024-01-15',
      treatment: 'Chest pain evaluation',
      status: 'completed',
      powSubmitted: true
    },
    {
      id: 2,
      patient: 'Jane Smith',
      date: '2024-01-12',
      treatment: 'Respiratory assessment',
      status: 'completed',
      powSubmitted: true
    },
    {
      id: 3,
      patient: 'Mike Johnson',
      date: '2024-01-10',
      treatment: 'Headache consultation',
      status: 'in-progress',
      powSubmitted: false
    }
  ])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Consultation History</h2>
      
      <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-primary/20">
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <div key={consultation.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">{consultation.patient}</div>
                  <div className="text-sm text-text-light/70 dark:text-text-dark/70">
                    {consultation.treatment}
                  </div>
                  <div className="text-xs text-text-light/50 dark:text-text-dark/50">
                    {consultation.date}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  consultation.status === 'completed' 
                    ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                    : 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                }`}>
                  {consultation.status}
                </div>
                
                {consultation.powSubmitted ? (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">PoW Submitted</span>
                  </div>
                ) : (
                  <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors">
                    Submit PoW
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Import useAuth hook
import { useAuth } from '../contexts/AuthContext'

const DoctorDashboard: React.FC = () => {
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/doctor', icon: Home },
    { name: 'PatFind', href: '/doctor/patfind', icon: Users },
    { name: 'PoW', href: '/doctor/pow', icon: FileText },
    { name: 'MyRating', href: '/doctor/rating', icon: Star },
    { name: 'History', href: '/doctor/history', icon: History },
  ]

  return (
    <div className="flex space-x-8">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-light dark:text-text-dark hover:bg-primary/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<DoctorHome />} />
          <Route path="/patfind" element={<PatFind />} />
          <Route path="/pow" element={<ProofOfWork />} />
          <Route path="/rating" element={<MyRating />} />
          <Route path="/history" element={<DoctorHistory />} />
        </Routes>
      </div>
    </div>
  )
}

export default DoctorDashboard
